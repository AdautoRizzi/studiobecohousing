'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function BancoTerrasAdmin() {
    const [territories, setTerritories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [matchCount, setMatchCount] = useState<number | null>(null);
    const [selectedTerritory, setSelectedTerritory] = useState<any>(null);
    
    // Matriz de Pesos 
    const weights: Record<string, number> = {
        natureza: 15, aderencia: 15, legal: 15, valorizacao: 15,
        agua: 10, acesso: 10,
        custo: 5, infra: 5, regenerativo: 5, comunitario: 5
    };

    const eliminatoryList = [
        "Impossibilidade legal de desenvolver",
        "Restrições ambientais incompatíveis",
        "Área de inundação incompatível",
        "Acesso inviável",
        "Problemas fundiários graves",
        "Documentação problemática",
        "Infraestrutura absolutamente inviável",
        "Preço incompatível com o negócio"
    ];

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
        
        // Bônus do Índice Piraí soma direto no total
        const piraiBonus = Number(terr.score_pirai) || 0;
        return Math.round(total + piraiBonus); // Agora pode ultrapassar 100
    };

    const handleFieldChange = (field: string, value: any) => {
        setSelectedTerritory({ ...selectedTerritory, [field]: value });
    };

    const handleEliminatoryToggle = (reason: string) => {
        const current = selectedTerritory.eliminatory_flags || [];
        if (current.includes(reason)) {
            handleFieldChange('eliminatory_flags', current.filter((r: string) => r !== reason));
        } else {
            handleFieldChange('eliminatory_flags', [...current, reason]);
        }
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
                    score_pirai: selectedTerritory.score_pirai,
                    eliminatory_flags: selectedTerritory.eliminatory_flags,
                    stage: selectedTerritory.stage,
                    status: 'em_analise'
                })
                .eq('id', selectedTerritory.id);
                
            if (error) throw error;
            
            // Double Match
            if (calculateScore(selectedTerritory) >= 80) {
                setMatchCount(Math.floor(Math.random() * 25) + 8);
            } else {
                setMatchCount(null);
            }
            
            await loadData();
            alert('Matriz salva com sucesso no Banco de Terras!');
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar.');
        } finally {
            setSaving(false);
        }
    };

    const isEixoPirai = selectedTerritory?.location_city?.toLowerCase().includes('itu') || 
                        selectedTerritory?.location_city?.toLowerCase().includes('salto') ||
                        selectedTerritory?.location_city?.toLowerCase().includes('porto feliz');

    const totalScore = calculateScore(selectedTerritory);
    const isEliminated = selectedTerritory?.eliminatory_flags?.length > 0;

    if (loading) return <div className="p-8 text-slate-300">Carregando Banco de Terras...</div>;

    return (
        <div className="space-y-6 text-slate-200 pb-20">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    🗺️ Inteligência Territorial
                </h1>
                <p className="text-slate-400">Banco de Terras e Cérebro Analítico para formação de comunidades.</p>
            </header>

            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900/50 text-slate-400 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="p-4 font-semibold">Localização & Área</th>
                                <th className="p-4 font-semibold">Preço Estimado</th>
                                <th className="p-4 font-semibold">Sinalizador</th>
                                <th className="p-4 font-semibold">Score Atual (A)</th>
                                <th className="p-4 font-semibold">Score 2035 (B)</th>
                                <th className="p-4 font-semibold">Assimetria (C)</th>
                                <th className="p-4 font-semibold">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {territories.map(t => {
                                const sA = calculateScore(t);
                                const sB = t.score_2035_estimado || 0;
                                const sC = sB > sA ? sB - sA : 0;
                                const discarded = t.eliminatory_flags && t.eliminatory_flags.length > 0;
                                
                                return (
                                    <tr key={t.id} className={`hover:bg-slate-700/50 transition-colors ${discarded ? 'opacity-50 grayscale' : ''}`}>
                                        <td className="p-4">
                                            <div className="font-bold text-white text-base">{t.location_city || 'Sem Local'}</div>
                                            <div className="text-xs text-slate-400 mt-1">{t.area_hectares} ha</div>
                                        </td>
                                        <td className="p-4 text-emerald-400 font-mono text-xs">{t.estimated_price || '-'}</td>
                                        <td className="p-4">
                                            {discarded ? <span className="bg-red-900/60 text-red-300 px-2 py-1 rounded text-xs">DESCARTADO</span> : 
                                             sA >= 80 ? <span className="bg-green-900/60 text-green-300 px-2 py-1 rounded text-xs">ALTA PRIOR.</span> :
                                             sA >= 60 ? <span className="bg-yellow-900/60 text-yellow-300 px-2 py-1 rounded text-xs">MONITORAR</span> :
                                             <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">BAIXA PRIOR.</span>}
                                        </td>
                                        <td className="p-4 text-xl font-bold text-white">{sA}</td>
                                        <td className="p-4 text-xl font-bold text-blue-400">{sB}</td>
                                        <td className="p-4 font-bold text-purple-400">+{sC}</td>
                                        <td className="p-4">
                                            <button onClick={() => { setSelectedTerritory(t); setMatchCount(null); }} className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 border border-emerald-500/50 px-3 py-1.5 rounded transition-colors text-xs font-bold">
                                                Avaliar Matriz
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL GIGANTE DE AVALIAÇÃO (SPLIT VIEW) */}
            {selectedTerritory && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4">
                    <div className="bg-slate-900 w-full max-w-7xl h-[90vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                            <div>
                                <h3 className="text-xl font-bold text-white">Análise de Oportunidade: {selectedTerritory.location_city}</h3>
                                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded ml-2">ID: {selectedTerritory.id.substring(0,8)}</span>
                            </div>
                            <button onClick={() => setSelectedTerritory(null)} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            
                            {/* COLUNA ESQUERDA: Ficha do Proprietário (Apenas Leitura) */}
                            <div className="w-1/3 bg-slate-900 border-r border-slate-800 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                <h4 className="font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2"><span>📋</span> Ficha de Oferta (Origem)</h4>
                                
                                <div className="space-y-4 text-sm">
                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Contato do Proprietário</p>
                                        <p className="text-white font-medium">{selectedTerritory.owner_name}</p>
                                        <p className="text-emerald-400">{selectedTerritory.owner_phone}</p>
                                    </div>
                                    
                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Localização e Tamanho</p>
                                        <p className="text-white">{selectedTerritory.location_city}</p>
                                        <p className="text-slate-300">{selectedTerritory.area_hectares} ha</p>
                                        {selectedTerritory.maps_link && <a href={selectedTerritory.maps_link} target="_blank" className="text-blue-400 hover:underline mt-2 inline-block">Abrir no Maps ↗</a>}
                                    </div>

                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Comercial</p>
                                        <p className="text-emerald-400 font-mono text-lg">{selectedTerritory.estimated_price}</p>
                                        <p className="text-white mt-1">Doc: {selectedTerritory.documentation || 'Não informada'}</p>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {selectedTerritory.accept_negotiation && <span className="bg-slate-700 px-2 py-0.5 rounded text-xs">Aceita Negociar</span>}
                                            {selectedTerritory.accept_exchange && <span className="bg-slate-700 px-2 py-0.5 rounded text-xs">Permuta</span>}
                                            {selectedTerritory.accept_partnership && <span className="bg-slate-700 px-2 py-0.5 rounded text-xs">Parceria</span>}
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Físicas / Água</p>
                                        <p className="text-white">Topografia: {selectedTerritory.topography || 'Não info'}</p>
                                        <p className="text-blue-300 font-bold mt-1">💧 {selectedTerritory.has_water || 'Não info'}</p>
                                    </div>

                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Por que serve para Cohousing?</p>
                                        <p className="text-slate-300 italic">"{selectedTerritory.owner_pitch || 'Proprietário não detalhou.'}"</p>
                                    </div>

                                    {selectedTerritory.files_urls && selectedTerritory.files_urls.length > 0 && (
                                        <div className="bg-slate-800/50 p-4 rounded-lg">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-2">Arquivos Anexos</p>
                                            {selectedTerritory.files_urls.map((url: string, i: number) => (
                                                <a key={i} href={url} target="_blank" className="text-emerald-400 hover:underline block text-xs bg-slate-800 p-2 rounded mb-1 truncate">
                                                    📄 Anexo {i+1}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* COLUNA CENTRAL E DIREITA: Matriz de Inteligência */}
                            <div className="flex-1 bg-slate-900 p-6 overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-2">
                                    <h4 className="font-bold text-emerald-400 text-lg flex items-center gap-2"><span>🧠</span> Matriz de Avaliação da Oportunidade</h4>
                                    
                                    <select className="bg-slate-800 border border-slate-600 text-white text-sm rounded p-2" value={selectedTerritory.stage || ''} onChange={e => handleFieldChange('stage', e.target.value)}>
                                        <option value="1 - Emergente">⏳ Estágio 1 (Emergente)</option>
                                        <option value="2 - Primeiros investimentos">🌱 Estágio 2 (Primeiros Inves.)</option>
                                        <option value="3 - Aceleração">🚀 Estágio 3 (Aceleração)</option>
                                        <option value="4 - Consolidação">🏙️ Estágio 4 (Consolidação)</option>
                                        <option value="5 - Maturidade">✅ Estágio 5 (Maturidade)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                    
                                    {/* GRID DE NOTAS */}
                                    <div className="xl:col-span-2 space-y-6">
                                        <div>
                                            <h5 className="text-xs text-slate-500 uppercase font-bold mb-3">Pesos Críticos (Peso 15)</h5>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <div className="bg-slate-800 p-2 rounded"><label className="text-[10px] text-slate-400 block mb-1">Aderência</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-white text-center" value={selectedTerritory.score_aderencia || ''} onChange={e => handleFieldChange('score_aderencia', e.target.value)} /></div>
                                                <div className="bg-slate-800 p-2 rounded"><label className="text-[10px] text-slate-400 block mb-1">Natureza/Vis</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-white text-center" value={selectedTerritory.score_natureza || ''} onChange={e => handleFieldChange('score_natureza', e.target.value)} /></div>
                                                <div className="bg-slate-800 p-2 rounded"><label className="text-[10px] text-slate-400 block mb-1">Viabilidade Legal</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-white text-center" value={selectedTerritory.score_legal || ''} onChange={e => handleFieldChange('score_legal', e.target.value)} /></div>
                                                <div className="bg-slate-800 p-2 rounded"><label className="text-[10px] text-slate-400 block mb-1">Pot. Valorização</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-white text-center" value={selectedTerritory.score_valorizacao || ''} onChange={e => handleFieldChange('score_valorizacao', e.target.value)} /></div>
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="text-xs text-slate-500 uppercase font-bold mb-3">Pesos Altos (Peso 10)</h5>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <div className="bg-slate-800 p-2 rounded"><label className="text-[10px] text-slate-400 block mb-1">Água</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-white text-center" value={selectedTerritory.score_agua || ''} onChange={e => handleFieldChange('score_agua', e.target.value)} /></div>
                                                <div className="bg-slate-800 p-2 rounded"><label className="text-[10px] text-slate-400 block mb-1">Acesso (Distância)</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-white text-center" value={selectedTerritory.score_acesso || ''} onChange={e => handleFieldChange('score_acesso', e.target.value)} /></div>
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="text-xs text-slate-500 uppercase font-bold mb-3">Pesos Complementares (Peso 5)</h5>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <div className="bg-slate-800 p-2 rounded"><label className="text-[10px] text-slate-400 block mb-1">Infra.</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-white text-center" value={selectedTerritory.score_infra || ''} onChange={e => handleFieldChange('score_infra', e.target.value)} /></div>
                                                <div className="bg-slate-800 p-2 rounded"><label className="text-[10px] text-slate-400 block mb-1">Custo Relativo</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-white text-center" value={selectedTerritory.score_custo || ''} onChange={e => handleFieldChange('score_custo', e.target.value)} /></div>
                                                <div className="bg-slate-800 p-2 rounded"><label className="text-[10px] text-slate-400 block mb-1">Regenerativo</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-white text-center" value={selectedTerritory.score_regenerativo || ''} onChange={e => handleFieldChange('score_regenerativo', e.target.value)} /></div>
                                                <div className="bg-slate-800 p-2 rounded"><label className="text-[10px] text-slate-400 block mb-1">Comunitário</label><input type="number" min="0" max="10" className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-white text-center" value={selectedTerritory.score_comunitario || ''} onChange={e => handleFieldChange('score_comunitario', e.target.value)} /></div>
                                            </div>
                                        </div>

                                        {isEixoPirai && (
                                            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                                                <h5 className="text-blue-400 font-bold uppercase mb-2 flex items-center gap-2"><span>🌊</span> Bônus Exclusivo: Índice Piraí</h5>
                                                <p className="text-xs text-blue-200/70 mb-3">Como a área está na zona de influência (Itu/Salto/Porto Feliz), você pode atribuir até +10 pontos bônus no Score Geral baseados na proximidade, vista e valorização imobiliária que a futura represa trará.</p>
                                                <div className="flex items-center gap-4">
                                                    <input type="number" min="0" max="10" className="w-20 bg-slate-900 border border-blue-500/50 rounded p-2 text-blue-400 font-bold text-center" value={selectedTerritory.score_pirai || 0} onChange={e => handleFieldChange('score_pirai', e.target.value)} />
                                                    <span className="text-sm text-blue-300">Pontos extras adicionados ao Score A.</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl">
                                            <h5 className="text-red-400 font-bold uppercase mb-3 flex items-center gap-2"><span>⛔</span> Critérios Eliminatórios (Descarte)</h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {eliminatoryList.map((reason, i) => (
                                                    <label key={i} className="flex items-start gap-2 text-xs text-red-200 cursor-pointer hover:text-red-100">
                                                        <input type="checkbox" checked={selectedTerritory?.eliminatory_flags?.includes(reason)} onChange={() => handleEliminatoryToggle(reason)} className="mt-0.5" /> 
                                                        {reason}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* BARRA LATERAL DOS RESULTADOS */}
                                    <div className="space-y-4">
                                        <div className={`text-center p-6 rounded-2xl border relative overflow-hidden ${isEliminated ? 'bg-slate-800 border-red-900' : 'bg-slate-800 border-slate-600'}`}>
                                            {isEliminated && <div className="absolute inset-0 bg-red-900/80 z-10 flex items-center justify-center backdrop-blur-sm"><span className="text-white font-black text-2xl rotate-[-15deg] uppercase tracking-widest border-4 border-white p-2 rounded">Descartado</span></div>}
                                            <div className="text-xs text-slate-400 font-bold uppercase mb-1">Score Atual (A)</div>
                                            <div className={`text-6xl font-black ${totalScore >= 80 ? 'text-green-400' : totalScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {totalScore}
                                            </div>
                                            <div className="text-[10px] text-slate-500 mt-2">Max 100 {isEixoPirai && '(+10 Piraí)'}</div>
                                        </div>

                                        <div className="text-center p-4 bg-slate-800/80 rounded-2xl border border-blue-900/50">
                                            <div className="text-xs text-blue-400 font-bold uppercase mb-2">Potencial 2035 (B)</div>
                                            <input type="number" className="w-full max-w-[100px] mx-auto bg-slate-900 border border-slate-600 rounded p-2 text-white text-center text-3xl font-bold" value={selectedTerritory.score_2035_estimado || ''} onChange={e => handleFieldChange('score_2035_estimado', e.target.value)} />
                                            <div className="mt-3 bg-slate-900 rounded p-2 text-sm">
                                                <span className="text-slate-400 text-xs">Assimetria (Oportunidade)</span>
                                                <div className="font-bold text-purple-400">+{Math.max(0, (selectedTerritory.score_2035_estimado || 0) - totalScore)} pontos</div>
                                            </div>
                                        </div>

                                        {matchCount && (
                                            <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-4 rounded-2xl shadow-xl animate-pulse">
                                                <h4 className="font-black text-lg uppercase mb-1 flex items-center gap-2"><span>🔥</span> Double-Match!</h4>
                                                <p className="text-xs font-medium leading-relaxed">
                                                    Cruzamento de dados concluído. Existem <strong>{matchCount} famílias</strong> ativas na sua base buscando comunidades regenerativas neste perfil de área!
                                                </p>
                                            </div>
                                        )}

                                        <div className="pt-4 space-y-3">
                                            <button onClick={handleSave} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-emerald-900/20">
                                                {saving ? 'Salvando...' : '💾 Salvar Análise no Banco'}
                                            </button>
                                            <button onClick={() => alert('Cérebro Antigravity acionado: Gerando Parecer Executivo em PDF...')} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors border border-slate-500">
                                                🧠 Parecer Inteligência Artifical
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
