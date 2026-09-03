'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function BancoTerrasAdmin() {
    const [territories, setTerritories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Matriz de Pesos (Baseada no PDF "Dia 2")
    const weights: Record<string, number> = {
        natureza: 15, aderencia: 15, legal: 15, valorizacao: 15,
        agua: 10, acesso: 10,
        custo: 5, infra: 5, regenerativo: 5, comunitario: 5
    };

    // Modal state para Calculadora
    const [selectedTerritory, setSelectedTerritory] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const { data, error } = await supabase.from('territories').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setTerritories(data || []);
        } catch (err) {
            console.warn("Aviso: Tabela territories pode ainda não existir. Mostrando dados mockados.");
            // Mock data for immediate visualization
            setTerritories([
                {
                    id: '123', location_city: 'Porto Feliz (Prox. Fazenda Boa Vista)', area_hectares: 18.5, owner_name: 'Carlos Oliveira', estimated_price: 'R$ 2.400.000',
                    score_natureza: 9, score_agua: 8, score_acesso: 9, score_legal: 7, score_valorizacao: 8,
                    score_aderencia: 9, score_custo: 8, score_infra: 6, score_regenerativo: 10, score_comunitario: 6,
                    score_2035_estimado: 94, eliminatory_flags: [], stage: '2 - Primeiros investimentos', status: 'em_analise'
                }
            ]);
        } finally {
            setLoading(false);
        }
    }

    const calculateScore = (terr: any) => {
        let total = 0;
        Object.keys(weights).forEach(k => {
            const grade = terr[`score_${k}`] || 0;
            // nota (0 a 10) * (peso / 10) => pontuação máxima = peso
            total += grade * (weights[k] / 10);
        });
        return Math.round(total);
    };

    if (loading) return <div className="p-8 text-slate-300">Carregando Banco de Terras...</div>;

    return (
        <div className="space-y-6 text-slate-200 pb-20">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    🗺️ Inteligência Territorial (Mapa Vivo)
                </h1>
                <p className="text-slate-400">Banco de Terras, matriz de pontuação algorítmica e análise de assimetria de valorização para novas comunidades.</p>
            </header>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Funil de Propriedades Captadas</h2>
                    <a href="/proprietarios" target="_blank" className="text-sm text-emerald-400 hover:underline">Ver Página Pública do Proprietário &nearr;</a>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-semibold">Localização & Área</th>
                                <th className="p-4 font-semibold">Proprietário / Valor</th>
                                <th className="p-4 font-semibold">Score Atual (A)</th>
                                <th className="p-4 font-semibold">Score 2035 (B)</th>
                                <th className="p-4 font-semibold">Assimetria (C)</th>
                                <th className="p-4 font-semibold">Estágio</th>
                                <th className="p-4 font-semibold">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700 text-sm">
                            {territories.map(t => {
                                const scoreA = calculateScore(t);
                                const scoreB = t.score_2035_estimado || 0;
                                const scoreC = scoreB > scoreA ? scoreB - scoreA : 0;
                                const isEliminated = t.eliminatory_flags && t.eliminatory_flags.length > 0;
                                
                                return (
                                    <tr key={t.id} className={`hover:bg-slate-700/50 transition-colors ${isEliminated ? 'opacity-50' : ''}`}>
                                        <td className="p-4">
                                            <div className="font-bold text-white text-base">{t.location_city}</div>
                                            <div className="text-xs text-slate-400 mt-1">{t.area_hectares} hectares</div>
                                            {isEliminated && <div className="mt-2 inline-block px-2 py-0.5 bg-red-900/50 text-red-400 text-xs rounded border border-red-500/30">Descartado (Restrição)</div>}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-slate-300">{t.owner_name}</div>
                                            <div className="text-emerald-400 font-mono text-xs mt-1">{t.estimated_price}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className={`text-2xl font-bold ${scoreA >= 80 ? 'text-green-400' : scoreA >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {scoreA} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xl font-bold text-blue-400">
                                                {scoreB} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-600 font-bold text-purple-400">
                                                +{scoreC}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-slate-300">
                                            <span className="bg-slate-700 px-2 py-1 rounded">{t.stage || '1 - Emergente'}</span>
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => setSelectedTerritory(t)} className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 border border-emerald-500/50 px-3 py-2 rounded transition-colors text-xs font-bold">
                                                Calculadora & Parecer
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal da Calculadora */}
            {selectedTerritory && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-700 shadow-2xl mt-20 mb-20 relative">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/90 backdrop-blur z-10 rounded-t-2xl">
                            <div>
                                <h3 className="text-2xl font-bold text-white">Calculadora da Matriz-Mãe</h3>
                                <p className="text-slate-400 text-sm mt-1">{selectedTerritory.location_city} ({selectedTerritory.area_hectares} ha)</p>
                            </div>
                            <button onClick={() => setSelectedTerritory(null)} className="text-slate-400 hover:text-white text-2xl">&times;</button>
                        </div>

                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-4 border-b border-slate-700 pb-2">Pesos Críticos (Máx 15 cada)</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Aderência Cohousing</label><input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" defaultValue={selectedTerritory.score_aderencia} /></div>
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Natureza e Paisagem</label><input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" defaultValue={selectedTerritory.score_natureza} /></div>
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Viabilidade Urbanística</label><input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" defaultValue={selectedTerritory.score_legal} /></div>
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Potencial de Valorização</label><input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" defaultValue={selectedTerritory.score_valorizacao} /></div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-4 border-b border-slate-700 pb-2">Pesos Altos (Máx 10 cada)</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Água (Rios, nascentes)</label><input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" defaultValue={selectedTerritory.score_agua} /></div>
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Acesso (Tempo SP/Itu)</label><input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" defaultValue={selectedTerritory.score_acesso} /></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="text-orange-400 font-bold uppercase tracking-wider text-xs mb-4 border-b border-slate-700 pb-2">Pesos Complementares (Máx 5 cada)</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Infra.</label><input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" defaultValue={selectedTerritory.score_infra} /></div>
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Custo</label><input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" defaultValue={selectedTerritory.score_custo} /></div>
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Regenera</label><input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" defaultValue={selectedTerritory.score_regenerativo} /></div>
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Comunid.</label><input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" defaultValue={selectedTerritory.score_comunitario} /></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-6">
                                <div className="text-center p-4 bg-slate-900 rounded-xl border border-slate-600">
                                    <div className="text-sm text-slate-400 font-bold uppercase mb-1">Score Atual</div>
                                    <div className={`text-5xl font-black ${calculateScore(selectedTerritory) >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>{calculateScore(selectedTerritory)}</div>
                                </div>

                                <div className="text-center p-4 bg-slate-900 rounded-xl border border-blue-900">
                                    <div className="text-sm text-blue-400 font-bold uppercase mb-1">Potencial 2035 (Estimado)</div>
                                    <input type="number" className="w-24 mx-auto bg-slate-800 border border-slate-600 rounded p-2 text-white text-center text-2xl font-bold" defaultValue={selectedTerritory.score_2035_estimado} />
                                </div>

                                <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl">
                                    <h4 className="text-red-400 font-bold text-sm mb-3 uppercase">Critérios Eliminatórios</h4>
                                    <label className="flex items-start gap-2 text-sm text-slate-300 mb-2 cursor-pointer"><input type="checkbox" className="mt-1" /> Sem acesso adequado</label>
                                    <label className="flex items-start gap-2 text-sm text-slate-300 mb-2 cursor-pointer"><input type="checkbox" className="mt-1" /> Restrição legal incompatível</label>
                                    <label className="flex items-start gap-2 text-sm text-slate-300 mb-2 cursor-pointer"><input type="checkbox" className="mt-1" /> Área de Inundação</label>
                                </div>

                                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <span>💾</span> Salvar Análise
                                </button>
                                
                                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <span>🧠</span> Gerar Parecer I.A.
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
