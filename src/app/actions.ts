'use server';

import { 
    registerUser, approveUser, getUserByEmail, getAllUsers, 
    saveLead, updateLeadStatus, getInteractionsByLead, 
    getMessageTemplates, createMessageTemplate, addToMessageQueue,
    deleteLead
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
        // Prepara a observação com a nova pergunta para não quebrar a estrutura do banco
        let observacoesFinais = formData.observacoes || '';
        if (formData.participouApresentacao) {
            const extra = `[Apresentação do Studio Be: ${formData.participouApresentacao}]`;
            observacoesFinais = observacoesFinais ? `${extra}\n${observacoesFinais}` : extra;
        }
        formData.observacoes = observacoesFinais;

        // 1. Salvar no CRM interno (Supabase)
        const newLead = await saveLead(formData);

        // 2. Enviar para a Planilha do Google (Backup)
        const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbyTq7VCLn1GZG2mMB9rGZBYFtedDezWmgEtq2hkMNx9aUKbuZjboz_oyjnMuigyYs8R/exec';
        
        // Payload com chaves que batem EXATAMENTE com os cabeçalhos da planilha (Case Sensitive)
        const payload = {
            "Nome": formData.nome || '',
            "Email": formData.email || '',
            "Telefone": formData.telefone || '',
            "Moradia": formData.moradiaAtual || '',
            "Idade": formData.idade || '',
            "Profissao": formData.profissao || '',
            "Genero": formData.genero || '',
            "Local": formData.ondeMorar || '',
            "Tipologia": formData.tipologia || '',
            "Área da residência": formData.areaResidencia || '',
            "Pessoas/Com quem": `${formData.comQuem || ''} (${formData.totalPessoas || 1} pessoas - ${formData.dormitorios || 0} quartos, ${formData.suites || 0} suítes)`,
            "Observações": formData.observacoes || '',
            
            // Interesses
            "Interesse 1": (formData.interesses || [])[0] || '',
            "Interesse 2": (formData.interesses || [])[1] || '',
            "Interesse 3": (formData.interesses || [])[2] || '',
            "Interesse 4": (formData.interesses || [])[3] || '',
            
            // Valores
            "Valor 1": (formData.valores || [])[0] || '',
            "Valor 2": (formData.valores || [])[1] || '',
            "Valor 3": (formData.valores || [])[2] || '',
            "Valor 4": (formData.valores || [])[3] || '',
            
            // Empreender
            "Empreender 1": (formData.empreender || [])[0] || '',
            "Empreender 2": (formData.empreender || [])[1] || '',
            "Empreender 3": (formData.empreender || [])[2] || '',
            "Empreender 4": (formData.empreender || [])[3] || '',
            
            "Origem": formData.origem || 'Site/CRM'
        };

        try {
            const response = await fetch(googleScriptUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
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

export async function bulkImportLeadsAction(leadsData: any[]) {
    let successCount = 0;
    let failCount = 0;

    for (const lead of leadsData) {
        try {
            await saveLead(lead);
            successCount++;
        } catch (e) {
            console.error("Failed to import lead:", lead.nome, e);
            failCount++;
        }
    }

    revalidatePath('/admin/crm');
    return { success: successCount, failed: failCount };
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

export async function deleteLeadAction(id: string) {
    try {
        await deleteLead(id);
        revalidatePath('/admin/crm');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
