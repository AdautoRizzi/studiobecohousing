'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function BancoTerrasAdmin() {
    const [territories, setTerritories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [matchCount, setMatchCount] = useState<number | null>(null);
    
    const weights: Record<string, number> = {
        natureza: 15, aderencia: 15, legal: 15, valorizacao: 15,
        agua: 10, acesso: 10,
        custo: 5, infra: 5, regenerativo: 5, comunitario: 5
    };

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
            console.warn(err);
        } finally {
            setLoading(false);
        }
    }

    const calculateScore = (terr: any) => {
        if (!terr) return 0;
        let total = 0;
        Object.keys(weights).forEach(k => {
            const grade = Number(terr[`score_${k}`]) || 0;
            total += grade * (weights[k] / 10);
        });
        return Math.round(total);
    };

    const handleFieldChange = (field: string, value: string | boolean) => {
        setSelectedTerritory({ ...selectedTerritory, [field]: value });
    };

    const handleSave = async () => {
        if (!selectedTerritory || !selectedTerritory.id) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('territories')
                .update({
                    score_natureza: selectedTerritory.score_natureza,
                    score_agua: selectedTerritory.score_agua,
                    score_aderencia: selectedTerritory.score_aderencia,
                    score_valorizacao: selectedTerritory.score_valorizacao,
                    score_legal: selectedTerritory.score_legal,
                    score_acesso: selectedTerritory.score_acesso,
                    score_custo: selectedTerritory.score_custo,
                    score_infra: selectedTerritory.score_infra,
                    score_regenerativo: selectedTerritory.score_regenerativo,
                    score_comunitario: selectedTerritory.score_comunitario,
                    score_2035_estimado: selectedTerritory.score_2035_estimado,
                    status: 'em_analise'
                })
                .eq('id', selectedTerritory.id);
                
            if (error) throw error;
            
            // Simular o Double-Match se o score for >= 80
            if (calculateScore(selectedTerritory) >= 80) {
                setMatchCount(Math.floor(Math.random() * 20) + 5);
            } else {
                setMatchCount(null);
            }
            
            await loadData();
            alert('Análise salva com sucesso!');
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar.');
        } finally {
            setSaving(false);
        }
    };

    const handleGerarParecer = () => {
        alert('Cérebro I.A. Antigravity ativado: Gerando parecer executivo baseado nos scores (Funcionalidade em desenvolvimento)...');
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
                                <th className="p-4 font-semibold">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700 text-sm">
                            {territories.map(t => {
                                const scoreA = calculateScore(t);
                                const scoreB = t.score_2035_estimado || 0;
                                const scoreC = scoreB > scoreA ? scoreB - scoreA : 0;
                                
                                return (
                                    <tr key={t.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white text-base">{t.location_city || 'Sem Localização'}</div>
                                            <div className="text-xs text-slate-400 mt-1">{t.area_hectares} hectares</div>
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
                                        <td className="p-4">
                                            <button onClick={() => { setSelectedTerritory(t); setMatchCount(null); }} className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 border border-emerald-500/50 px-3 py-2 rounded transition-colors text-xs font-bold">
                                                Calculadora & Parecer
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {territories.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">Nenhuma propriedade cadastrada ainda. Utilize o formulário público para captar.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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
                                    <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-4 border-b border-slate-700 pb-2">Pesos Críticos (0-10, Peso 15)</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Aderência Cohousing</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" value={selectedTerritory.score_aderencia || ''} onChange={e => handleFieldChange('score_aderencia', e.target.value)} /></div>
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Natureza e Paisagem</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" value={selectedTerritory.score_natureza || ''} onChange={e => handleFieldChange('score_natureza', e.target.value)} /></div>
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Viabilidade Urbanística</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" value={selectedTerritory.score_legal || ''} onChange={e => handleFieldChange('score_legal', e.target.value)} /></div>
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Potencial de Valorização</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" value={selectedTerritory.score_valorizacao || ''} onChange={e => handleFieldChange('score_valorizacao', e.target.value)} /></div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-4 border-b border-slate-700 pb-2">Pesos Altos (0-10, Peso 10)</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Água (Rios, nascentes)</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" value={selectedTerritory.score_agua || ''} onChange={e => handleFieldChange('score_agua', e.target.value)} /></div>
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Acesso (Tempo SP/Itu)</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" value={selectedTerritory.score_acesso || ''} onChange={e => handleFieldChange('score_acesso', e.target.value)} /></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="text-orange-400 font-bold uppercase tracking-wider text-xs mb-4 border-b border-slate-700 pb-2">Pesos Complementares (0-10, Peso 5)</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Infra.</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" value={selectedTerritory.score_infra || ''} onChange={e => handleFieldChange('score_infra', e.target.value)} /></div>
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Custo</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" value={selectedTerritory.score_custo || ''} onChange={e => handleFieldChange('score_custo', e.target.value)} /></div>
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Regenera</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" value={selectedTerritory.score_regenerativo || ''} onChange={e => handleFieldChange('score_regenerativo', e.target.value)} /></div>
                                        <div className="bg-slate-800 p-3 rounded"><label className="text-xs text-slate-400 block mb-1">Comunid.</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" value={selectedTerritory.score_comunitario || ''} onChange={e => handleFieldChange('score_comunitario', e.target.value)} /></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-6">
                                <div className="text-center p-4 bg-slate-900 rounded-xl border border-slate-600">
                                    <div className="text-sm text-slate-400 font-bold uppercase mb-1">Score Atual (Dinâmico)</div>
                                    <div className={`text-5xl font-black ${calculateScore(selectedTerritory) >= 80 ? 'text-green-400' : calculateScore(selectedTerritory) >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {calculateScore(selectedTerritory)}
                                    </div>
                                </div>

                                <div className="text-center p-4 bg-slate-900 rounded-xl border border-blue-900">
                                    <div className="text-sm text-blue-400 font-bold uppercase mb-1">Potencial 2035 (0-100)</div>
                                    <input type="number" className="w-24 mx-auto bg-slate-800 border border-slate-600 rounded p-2 text-white text-center text-2xl font-bold" value={selectedTerritory.score_2035_estimado || ''} onChange={e => handleFieldChange('score_2035_estimado', e.target.value)} />
                                </div>

                                {matchCount && (
                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl shadow-lg border border-orange-400 animate-pulse">
                                        <h4 className="font-bold text-sm uppercase mb-1 flex items-center gap-2"><span>🔥</span> Double-Match!</h4>
                                        <p className="text-xs">O Cérebro I.A. encontrou <strong>{matchCount} famílias</strong> na sua base de clientes com prontidão alta que buscam este perfil de território!</p>
                                    </div>
                                )}

                                <button onClick={handleSave} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    {saving ? 'Salvando...' : '💾 Salvar Análise'}
                                </button>
                                
                                <button onClick={handleGerarParecer} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
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
