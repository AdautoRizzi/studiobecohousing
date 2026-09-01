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

    // Filter States
    const [filterTime, setFilterTime] = useState('all');
    const [filterMatch, setFilterMatch] = useState('all');
    const [filterGov, setFilterGov] = useState('all');
    const [filterJourney, setFilterJourney] = useState('all');
    const [hideDealbreakers, setHideDealbreakers] = useState(false);

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
    const uniqueUserIds = Array.from(new Set([...discovery.map(d => d.user_id), ...deep.map(d => d.user_id)]));

    const generateFakeName = (uuid: string) => {
        const firstNames = ['Ana', 'Carlos', 'Mariana', 'Roberto', 'Juliana', 'Fernando', 'Camila', 'Rafael', 'Diego', 'Luciana'];
        const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Costa', 'Ribeiro'];
        const num = parseInt(uuid.substring(0, 4), 16) || 0;
        return `${firstNames[num % firstNames.length]} ${lastNames[(num + 3) % lastNames.length]}`;
    };

    // Pre-process users
    const processedUsers = uniqueUserIds.map(userId => {
        const dUser = discovery.find(d => d.user_id === userId);
        const dpUser = deep.find(d => d.user_id === userId);
        
        let matchScore = 0;
        if (dUser) matchScore += 30; // base score for discovery
        if (dpUser) {
            matchScore += 40; // baseline for answering
            if (dpUser.governance_style.includes('Consentimento') || dpUser.governance_style.includes('Sociocracia')) matchScore += 25;
            else if (dpUser.governance_style.includes('Consenso')) matchScore += 10;
        }

        let journeyStage = 'incompleto';
        if (dpUser) journeyStage = 'nivel_2'; // Profundo concluído
        else if (dUser) journeyStage = 'nivel_1'; // Apenas descobridor concluído

        return {
            userId,
            name: generateFakeName(userId),
            matchScore,
            journeyStage,
            whenToMove: dUser?.when_to_move || '',
            governance: dpUser?.governance_style || '',
            behaviors: dpUser?.incompatible_behaviors || [],
            dUser,
            dpUser
        };
    });

    // Apply Filters
    const filteredUsers = processedUsers.filter(u => {
        // Prontidão (Tempo de mudança)
        if (filterTime !== 'all' && !u.whenToMove.includes(filterTime)) return false;
        
        // Match Score
        if (filterMatch === 'high' && u.matchScore < 80) return false;
        if (filterMatch === 'medium' && (u.matchScore < 50 || u.matchScore >= 80)) return false;
        if (filterMatch === 'low' && u.matchScore >= 50) return false;

        // Governança
        if (filterGov !== 'all' && !u.governance.toLowerCase().includes(filterGov)) return false;

        // Fase da Jornada
        if (filterJourney !== 'all' && u.journeyStage !== filterJourney) return false;

        // Dealbreakers (Se ativado, esconde pessoas que têm mais de 2 incompatibilidades críticas)
        if (hideDealbreakers && u.behaviors.length >= 2) return false;

        return true;
    });

    if (loading) return <div className="p-8 text-slate-300 flex items-center gap-3"><span className="animate-spin text-2xl">⏳</span> Carregando Base de Dados e Calculando Match...</div>;

    return (
        <div className="space-y-6 text-slate-200">
            <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Análise de Match</h1>
                    <p className="text-slate-400 text-sm">Visão geral e filtragem inteligente de cohortes para formar turmas.</p>
                </div>
                <div className="bg-primary-900/30 text-primary-300 px-4 py-2 rounded-lg border border-primary-800 text-sm font-bold flex items-center gap-2">
                    🎯 {filteredUsers.length} Perfis Encontrados
                </div>
            </header>

            {/* Fila de Filtros Estratégicos */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg mb-6">
                <div className="flex items-center gap-2 mb-4 text-slate-300 font-bold">
                    <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                    Filtros Inteligentes (Montagem de Turma)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Filtro 1: Prontidão */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">1. Prontidão Temporal</label>
                        <select value={filterTime} onChange={e => setFilterTime(e.target.value)} className="bg-slate-900 border border-slate-700 text-sm rounded-lg p-2 text-white outline-none focus:border-primary-500 transition-colors">
                            <option value="all">Todos os Tempos</option>
                            <option value="Em 1 ano">Alta Urgência (1 ano)</option>
                            <option value="Entre 1 e 2 anos">Curto Prazo (1-2 anos)</option>
                            <option value="Entre 2 e 5 anos">Médio Prazo (2-5 anos)</option>
                            <option value="Mais de 5 anos">Longo Prazo (>5 anos)</option>
                        </select>
                    </div>

                    {/* Filtro 2: Match Score */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">2. Grau de Match</label>
                        <select value={filterMatch} onChange={e => setFilterMatch(e.target.value)} className="bg-slate-900 border border-slate-700 text-sm rounded-lg p-2 text-white outline-none focus:border-primary-500 transition-colors">
                            <option value="all">Todas as Pontuações</option>
                            <option value="high">🟢 Quentes (> 80%)</option>
                            <option value="medium">🟡 Mornos (50 - 80%)</option>
                            <option value="low">🔴 Frios (&lt; 50%)</option>
                        </select>
                    </div>

                    {/* Filtro 3: Governança */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">3. Perfil de Governança</label>
                        <select value={filterGov} onChange={e => setFilterGov(e.target.value)} className="bg-slate-900 border border-slate-700 text-sm rounded-lg p-2 text-white outline-none focus:border-primary-500 transition-colors">
                            <option value="all">Todas as Culturas</option>
                            <option value="consentimento">Sociocracia / Consentimento</option>
                            <option value="consenso">Unanimidade / Consenso</option>
                            <option value="maioria">Votação por Maioria</option>
                        </select>
                    </div>

                    {/* Filtro 4: Jornada */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">4. Gargalo da Jornada</label>
                        <select value={filterJourney} onChange={e => setFilterJourney(e.target.value)} className="bg-slate-900 border border-slate-700 text-sm rounded-lg p-2 text-white outline-none focus:border-primary-500 transition-colors">
                            <option value="all">Todas as Etapas</option>
                            <option value="nivel_2">✅ Perfil Completo (Descoberta + Profundo)</option>
                            <option value="nivel_1">⚠️ Empacado no Nv. 1 (Falta Profundo)</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`relative w-10 h-5 rounded-full transition-colors ${hideDealbreakers ? 'bg-red-500' : 'bg-slate-600'}`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${hideDealbreakers ? 'left-6' : 'left-1'}`}></div>
                        </div>
                        <input type="checkbox" className="hidden" checked={hideDealbreakers} onChange={e => setHideDealbreakers(e.target.checked)} />
                        <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                            Isolar Dealbreakers (Esconder perfis muito exigentes / difíceis)
                        </span>
                    </label>
                    <button 
                        onClick={() => { setFilterTime('all'); setFilterMatch('all'); setFilterGov('all'); setFilterJourney('all'); setHideDealbreakers(false); }}
                        className="text-xs text-slate-400 hover:text-white underline transition-colors"
                    >
                        Limpar Todos os Filtros
                    </button>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/80 text-slate-400 text-sm">
                            <tr>
                                <th className="p-4 font-semibold">Cliente (Simulado)</th>
                                <th className="p-4 font-semibold">Status Jornada</th>
                                <th className="p-4 font-semibold">Prontidão</th>
                                <th className="p-4 font-semibold">Governança (Peso 4)</th>
                                <th className="p-4 font-semibold w-40">Match %</th>
                                <th className="p-4 font-semibold">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700 text-sm">
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <span className="text-4xl block mb-3">🔍</span>
                                        <p className="text-slate-400 text-lg">Nenhum cliente se encaixa nestes filtros.</p>
                                    </td>
                                </tr>
                            )}
                            {filteredUsers.map(u => (
                                <tr key={u.userId} className="hover:bg-slate-700/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{u.name}</div>
                                        <div className="text-xs text-slate-500 font-mono mt-1">{u.userId.substring(0, 8)}...</div>
                                    </td>
                                    <td className="p-4">
                                        {u.journeyStage === 'nivel_2' ? (
                                            <span className="px-2.5 py-1 bg-pink-500/20 text-pink-400 rounded text-xs font-bold uppercase">Profundo Concluído</span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-bold uppercase">Falta Profundo</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-300 font-medium">
                                        {u.whenToMove || <span className="text-slate-600">-</span>}
                                    </td>
                                    <td className="p-4 text-slate-300">
                                        {u.governance ? u.governance.split('(')[0].trim() : <span className="text-slate-600">-</span>}
                                        {u.behaviors.length > 0 && (
                                            <div className="text-xs text-red-400 mt-1">{u.behaviors.length} Incompatibilidades</div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden w-20">
                                                <div className={`h-full rounded-full ${u.matchScore > 80 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : u.matchScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${u.matchScore}%` }}></div>
                                            </div>
                                            <span className={`font-bold ${u.matchScore > 80 ? 'text-green-400' : u.matchScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {u.matchScore}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-primary-400 hover:text-white transition-colors text-xs font-bold bg-primary-900/20 px-3 py-1.5 rounded-lg border border-primary-900/50 hover:bg-primary-900/40">
                                            Analisar Perfil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
