'use server';

import { 
    registerUser, approveUser, getUserByEmail, getAllUsers, 
    saveLead, updateLeadStatus, getInteractionsByLead, 
    getMessageTemplates, createMessageTemplate, addToMessageQueue 
} from '@/lib/db';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function loginAction(email: string) {
    const user = await getUserByEmail(email);

    if (!user) {
        return { success: false, error: 'Credenciais inválidas ou e-mail não encontrado.' };
    }

    if (user.status === 'Pendente') {
        return {
            success: false,
            error: 'Sua conta está em análise por favor aguarde a liberação do Studio Be.',
            status: 'Pendente'
        };
    }

    // Se aprovado, logamos via cookies (Next 15 await)
    const cookieStore = await cookies();
    cookieStore.set('auth_token', user.email, { httpOnly: true, path: '/' });

    return { success: true };
}

export async function registerAction(email: string, name: string, phone: string) {
    try {
        const user = await registerUser(email, name, phone);
        return { success: true, user };
    } catch (err: any) {
        return { success: false, error: err.message || 'Erro ao registrar.' };
    }
}

export async function getPendingUsersAction() {
    const users = await getAllUsers();
    return users.filter(u => u.status === 'Pendente');
}

export async function approveUserAction(email: string) {
    const success = await approveUser(email);
    return { success };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    return { success: true };
}

export async function adminLoginAction(email: string, pass: string) {
    const allowedAdmins = [
        'ajrizzi@gmail.com',
        'pct@cmaisi.com',
        'claudia.studiobertucci@gmail.com'
    ];

    if (allowedAdmins.includes(email) && pass === 'StudioBeSucesso') {
        const cookieStore = await cookies();
        cookieStore.set('admin_token', email, { httpOnly: true, path: '/' });
        return { success: true };
    }

    return { success: false, error: 'Credenciais administrativas inválidas.' };
}

export async function adminLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_token');
    return { success: true };
}

export async function submitCohousingFormAction(formData: any) {
    try {
        // 1. Salvar no CRM interno (Supabase)
        const newLead = await saveLead(formData);

        // 2. Enviar para a Planilha do Google (Backup)
        const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbyTq7VCLn1GZG2mMB9rGZBYFtedDezWmgEtq2hkMNx9aUKbuZjboz_oyjnMuigyYs8R/exec';
        
        // Criar o payload em formato de formulário (mais compatível com scripts básicos de planilha)
        const params = new URLSearchParams();
        params.append('nome', formData.nome || '');
        params.append('email', formData.email || '');
        params.append('telefone', formData.telefone || '');
        params.append('moradiaAtual', formData.moradiaAtual || '');
        params.append('idade', formData.idade || '');
        params.append('profissao', formData.profissao || '');
        params.append('genero', formData.genero || '');
        params.append('ondeMorar', formData.ondeMorar || '');
        params.append('tipologia', formData.tipologia || '');
        params.append('areaResidencia', formData.areaResidencia || '');
        params.append('comQuem', `${formData.comQuem || ''} (${formData.totalPessoas || 1} pessoas - ${formData.dormitorios || 0} quartos, ${formData.suites || 0} suítes)`);
        params.append('observacoes', formData.observacoes || '');
        
        // Interesses
        params.append('interesse_1', (formData.interesses || [])[0] || '');
        params.append('interesse_2', (formData.interesses || [])[1] || '');
        params.append('interesse_3', (formData.interesses || [])[2] || '');
        params.append('interesse_4', (formData.interesses || [])[3] || '');
        
        // Valores
        params.append('valor_1', (formData.valores || [])[0] || '');
        params.append('valor_2', (formData.valores || [])[1] || '');
        params.append('valor_3', (formData.valores || [])[2] || '');
        params.append('valor_4', (formData.valores || [])[3] || '');
        
        // Empreender
        params.append('empreender_1', (formData.empreender || [])[0] || '');
        params.append('empreender_2', (formData.empreender || [])[1] || '');
        params.append('empreender_3', (formData.empreender || [])[2] || '');
        params.append('empreender_4', (formData.empreender || [])[3] || '');
        
        params.append('origem', formData.origem || 'Site/CRM');

        try {
            const response = await fetch(googleScriptUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
                redirect: 'follow'
            });
            
            if (!response.ok) {
                console.error("Planilha retornou erro:", response.status, response.statusText);
            }
        } catch (err) {
            console.error("Erro crítico no backup Google Sheets:", err);
        }

        return { success: true, leadId: newLead.id };
    } catch (error: any) {
        console.error("Erro detalhado ao salvar lead:", error);
        return { 
            success: false, 
            error: error.message || 'Erro ao salvar o formulário no CRM.',
            details: error.details || error.hint || '' 
        };
    }
}

export async function updateLeadStatusAction(formData: FormData) {
    const leadId = formData.get('leadId') as string;
    const status = formData.get('status') as any;
    const notasCrm = formData.get('notasCrm') as string;
    const proximoContato = formData.get('proximoContato') as string;

    if (!leadId || !status) return;

    await updateLeadStatus(leadId, status, notasCrm, proximoContato || null);
    revalidatePath('/admin/crm');
    revalidatePath(`/admin/crm/lead/${leadId}`);
}

export async function queueMessageAction(leadId: string, message: string) {
    try {
        await addToMessageQueue(leadId, message);
        revalidatePath(`/admin/crm/lead/${leadId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createTemplateAction(title: string, content: string) {
    try {
        await createMessageTemplate(title, content);
        revalidatePath('/admin/crm/templates');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
