'use server';

import { registerUser, approveUser, getUserByEmail, getAllUsers } from '@/lib/db';
import { cookies } from 'next/headers';

export async function loginAction(email: string) {
    const user = getUserByEmail(email);

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
        const user = registerUser(email, name, phone);
        return { success: true, user };
    } catch (err: any) {
        return { success: false, error: err.message || 'Erro ao registrar.' };
    }
}

export async function getPendingUsersAction() {
    const users = getAllUsers();
    return users.filter(u => u.status === 'Pendente');
}

export async function approveUserAction(email: string) {
    const success = approveUser(email);
    return { success };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    return { success: true };
}
