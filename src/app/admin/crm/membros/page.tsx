import React, { Suspense } from 'react';
import { getAllUsers } from '@/lib/db';
import MembersTable from './MembersTable';

export const dynamic = 'force-dynamic';

export default async function TreinamentoUsuariosPage() {
    // Fetch all users on the server
    const users = await getAllUsers();

    return (
        <div className="w-full max-w-full min-w-0">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Membros & Permissões</h1>
                    <p className="text-slate-400 mt-2">
                        Gerencie o nível de acesso dos moradores à Plataforma de Treinamento.
                    </p>
                </div>
            </div>

            <div className="bg-[#0f172a] rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                <Suspense fallback={<div className="p-8 text-center text-slate-400">Carregando membros...</div>}>
                    <MembersTable initialUsers={users} />
                </Suspense>
            </div>
        </div>
    );
}
