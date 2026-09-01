'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type DiscoveryAnswer = {
    id: string;
    user_id: string;
    when_to_move: string;
    motivations: string[];
    wants_more: string[];
    wants_less: string[];
    created_at: string;
};

type DeepAnswer = {
    id: string;
    user_id: string;
    governance_style: string;
    incompatible_behaviors: string[];
    created_at: string;
};

export default function MatchAdminDashboard() {
    const [discovery, setDiscovery] = useState<DiscoveryAnswer[]>([]);
    const [deep, setDeep] = useState<DeepAnswer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const { data: dData } = await supabase.from('match_answers_discovery').select('*').order('created_at', { ascending: false });
                const { data: dpData } = await supabase.from('match_answers_deep').select('*').order('created_at', { ascending: false });
                
                if (dData) setDiscovery(dData);
                if (dpData) setDeep(dpData);
            } catch (err) {
                console.error("Erro ao carregar dados", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Combine users who have taken both
    const users = Array.from(new Set([...discovery.map(d => d.user_id), ...deep.map(d => d.user_id)]));

    const generateFakeName = (uuid: string) => {
        const firstNames = ['Ana', 'Carlos', 'Mariana', 'Roberto', 'Juliana', 'Fernando', 'Camila', 'Rafael'];
        const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira'];
        const num = parseInt(uuid.substring(0, 4), 16);
        return `${firstNames[num % firstNames.length]} ${lastNames[(num + 3) % lastNames.length]}`;
    };

    if (loading) return <div className="p-8 text-slate-300">Carregando dados de Match...</div>;

    return (
        <div className="space-y-6 text-slate-200">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Análise de Match e Compatibilidade</h1>
                <p className="text-slate-400">Visão geral dos clientes que preencheram os formulários de Descoberta (Nível 0) e Alinhamento Profundo (Nível 1).</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total de Prospectos</h3>
                    <p className="text-4xl font-bold text-white">{users.length}</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-2">Perfis Exploradores (Nv. 0)</h3>
                    <p className="text-4xl font-bold text-white">{discovery.length}</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider mb-2">Alinhamentos Profundos (Nv. 1)</h3>
                    <p className="text-4xl font-bold text-white">{deep.length}</p>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Tabela de Clientes</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400 text-sm">
                            <tr>
                                <th className="p-4 font-semibold">Cliente (Simulado)</th>
                                <th className="p-4 font-semibold">Status Jornada</th>
                                <th className="p-4 font-semibold">Momento de Vida</th>
                                <th className="p-4 font-semibold">Governança (Peso 4)</th>
                                <th className="p-4 font-semibold">Match % Estimado</th>
                                <th className="p-4 font-semibold">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700 text-sm">
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        Nenhum formulário respondido ainda. Preencha no painel do cliente para testar!
                                    </td>
                                </tr>
                            )}
                            {users.map(userId => {
                                const dUser = discovery.find(d => d.user_id === userId);
                                const dpUser = deep.find(d => d.user_id === userId);
                                const name = generateFakeName(userId);
                                
                                let matchScore = 0;
                                if (dUser) matchScore += 30; // base score for discovery
                                if (dpUser) {
                                    matchScore += 40; // baseline for answering
                                    if (dpUser.governance_style.includes('Consentimento')) matchScore += 25;
                                    else if (dpUser.governance_style.includes('Consenso')) matchScore += 10;
                                }

                                return (
                                    <tr key={userId} className="hover:bg-slate-800/80 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{name}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-1">{userId.substring(0, 8)}...</div>
                                        </td>
                                        <td className="p-4">
                                            {dpUser ? (
                                                <span className="px-2.5 py-1 bg-pink-500/20 text-pink-400 rounded text-xs font-bold uppercase">Nível 2+</span>
                                            ) : dUser ? (
                                                <span className="px-2.5 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold uppercase">Nível 1</span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-slate-500/20 text-slate-400 rounded text-xs font-bold uppercase">Incompleto</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-300">
                                            {dUser ? dUser.when_to_move : <span className="text-slate-600">-</span>}
                                        </td>
                                        <td className="p-4 text-slate-300">
                                            {dpUser ? dpUser.governance_style : <span className="text-slate-600">-</span>}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden w-24">
                                                    <div className={`h-full rounded-full ${matchScore > 80 ? 'bg-green-500' : matchScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${matchScore}%` }}></div>
                                                </div>
                                                <span className="font-bold text-slate-200">{matchScore}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button className="text-primary-400 hover:text-white transition-colors text-xs font-bold underline">
                                                Ver Respostas Detalhadas
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
