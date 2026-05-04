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
        const newLead = await saveLead(formData);
        return { success: true, leadId: newLead.id };
    } catch (error: any) {
        return { success: false, error: error.message || 'Erro ao salvar o formulário no CRM.' };
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
