'use client';

import React, { useState } from 'react';
import { UserAccount } from '@/lib/db';
import { useRouter } from 'next/navigation';

export default function MembersTable({ initialUsers }: { initialUsers: UserAccount[] }) {
    const [users, setUsers] = useState(initialUsers);
    const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
    const router = useRouter();

    const handleRoleChange = async (email: string, newRole: 'ADMIN' | 'FACILITATOR' | 'CLIENT') => {
        setLoadingEmail(email);
        try {
            const res = await fetch('/api/crm/update-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, role: newRole })
            });
            
            if (res.ok) {
                // Update local state
                setUsers(users.map(u => u.email === email ? { ...u, role: newRole } : u));
                router.refresh();
            } else {
                alert('Erro ao atualizar permissão.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro inesperado.');
        } finally {
            setLoadingEmail(null);
        }
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/10">
                <thead className="bg-[#020617]">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Nome / Email</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Permissão (Treinamento)</th>
                    </tr>
                </thead>
                <tbody className="bg-[#0f172a] divide-y divide-slate-800/50">
                    {users.map(user => (
                        <tr key={user.email} className="hover:bg-[#020617]/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-bold text-slate-50">{user.name}</div>
                                <div className="text-sm text-slate-400">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-bold rounded ${
                                    user.status === 'Aprovado' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                                }`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                    <select
                                        value={user.role || 'CLIENT'}
                                        onChange={(e) => handleRoleChange(user.email, e.target.value as any)}
                                        disabled={loadingEmail === user.email}
                                        className="bg-[#020617] border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 disabled:opacity-50 outline-none"
                                    >
                                        <option value="CLIENT">Cliente (Aluno)</option>
                                        <option value="FACILITATOR">Facilitador (Instrutor)</option>
                                        <option value="ADMIN">Administrador</option>
                                    </select>
                                    {loadingEmail === user.email && (
                                        <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-slate-400">Nenhum membro encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
