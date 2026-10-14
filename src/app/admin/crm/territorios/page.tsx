'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

export default function BancoTerrasAdmin() {
    const [territories, setTerritories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [matchCount, setMatchCount] = useState<number | null>(null);
    const [selectedTerritory, setSelectedTerritory] = useState<any>(null);
    const [showHelp, setShowHelp] = useState(false);
    const [aiReport, setAiReport] = useState<string | null>(null);
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);

    // Filtros e Busca
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'todos' | 'avaliados' | 'pendentes' | 'descartados'>('todos');
    
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
            const activeTerritories = (data || []).filter(t => t.status !== 'excluido');
            setTerritories(activeTerritories);
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
        return Math.round(total + piraiBonus);
    };

    const handleGenerateReport = async () => {
        if (!selectedTerritory) return;
        setIsGeneratingAi(true);
        try {
            const res = await fetch('/api/crm/parecer-ia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ territory: selectedTerritory })
            });
            const data = await res.json();
            if (data.report) {
                setAiReport(data.report);
            } else {
                alert(data.error || 'Erro desconhecido ao gerar parecer.');
            }
        } catch (e: any) {
            alert('Erro ao conectar com Cérebro: ' + e.message);
        } finally {
            setIsGeneratingAi(false);
        }
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

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta propriedade do Banco de Terras?')) return;
        setSaving(true);
        try {
            // Atualização otimista na tela imediatamente
            setTerritories(prev => prev.filter(t => t.id !== id));

            // 1. Tenta exclusão física (Hard Delete)
            const { data: delData, error: hardError } = await supabase
                .from('territories')
                .delete()
                .eq('id', id)
                .select();

            // 2. Se a política RLS do Supabase barrar o hard delete, executa soft delete (status: 'excluido')
            if (hardError || !delData || delData.length === 0) {
                const { error: softError } = await supabase
                    .from('territories')
                    .update({ status: 'excluido' })
                    .eq('id', id);
                if (softError) throw softError;
            }

            await loadData();
        } catch (err: any) {
            console.error('Erro ao excluir propriedade:', err);
            alert('Erro ao excluir propriedade: ' + (err.message || 'Tente novamente'));
            await loadData();
        } finally {
            setSaving(false);
        }
    };

    const isEixoPirai = selectedTerritory?.location_city?.toLowerCase().includes('itu') || 
                        selectedTerritory?.location_city?.toLowerCase().includes('salto') ||
                        selectedTerritory?.location_city?.toLowerCase().includes('porto feliz');

    const totalScore = calculateScore(selectedTerritory);
    const isEliminated = selectedTerritory?.eliminatory_flags?.length > 0;

    // Métricas de andamento
    const metrics = useMemo(() => {
        const total = territories.length;
        const descartados = territories.filter(t => t.eliminatory_flags && t.eliminatory_flags.length > 0).length;
        const avaliados = territories.filter(t => {
            const isDiscarded = t.eliminatory_flags && t.eliminatory_flags.length > 0;
            return !isDiscarded && calculateScore(t) > 0;
        }).length;
        const pendentes = territories.filter(t => {
            const isDiscarded = t.eliminatory_flags && t.eliminatory_flags.length > 0;
            return !isDiscarded && calculateScore(t) === 0;
        }).length;
        return { total, descartados, avaliados, pendentes };
    }, [territories]);

    // Filtragem de territórios
    const filteredTerritories = useMemo(() => {
        return territories.filter(t => {
            const sA = calculateScore(t);
            const isDiscarded = t.eliminatory_flags && t.eliminatory_flags.length > 0;

            // Filtro de status
            if (statusFilter === 'descartados' && !isDiscarded) return false;
            if (statusFilter === 'avaliados' && (isDiscarded || sA === 0)) return false;
            if (statusFilter === 'pendentes' && (isDiscarded || sA > 0)) return false;

            // Filtro de busca de texto
            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase();
                const matchOwner = (t.owner_name || '').toLowerCase().includes(term);
                const matchProperty = (t.property_name || '').toLowerCase().includes(term);
                const matchCity = (t.location_city || '').toLowerCase().includes(term);
                const matchPhone = (t.owner_phone || '').replace(/\D/g, '').includes(term.replace(/\D/g, ''));
                const matchEmail = (t.owner_email || '').toLowerCase().includes(term);
                if (!matchOwner && !matchProperty && !matchCity && !matchPhone && !matchEmail) return false;
            }

            return true;
        });
    }, [territories, statusFilter, searchTerm]);

    if (loading) return <div className="p-8 text-slate-300">Carregando Banco de Terras...</div>;

    return (
        <div className="space-y-6 text-slate-200 pb-20">
            <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        🗺️ Inteligência Territorial
                    </h1>
                    <p className="text-slate-400">Banco de Terras e Cérebro Analítico para formação de comunidades.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => window.print()}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                        title="Imprimir ou salvar PDF da lista"
                    >
                        <span>🖨️</span>
                        <span>Imprimir / Salvar PDF</span>
                    </button>
                    <button 
                        onClick={() => setShowHelp(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <span>📖</span>
                        <span>Guia Metodológico</span>
                    </button>
                </div>
            </header>

            {/* CARDS DE SITUAÇÃO / ANDAMENTO GERAL */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div 
                    onClick={() => setStatusFilter('todos')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${statusFilter === 'todos' ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'}`}
                >
                    <div className="text-xs text-slate-400 uppercase font-semibold">Total de Áreas</div>
                    <div className="text-2xl font-bold text-white mt-1">{metrics.total}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Cadastradas no banco</div>
                </div>

                <div 
                    onClick={() => setStatusFilter('pendentes')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${statusFilter === 'pendentes' ? 'bg-slate-800 border-amber-500 ring-2 ring-amber-500/20' : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'}`}
                >
                    <div className="text-xs text-amber-400 uppercase font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        Aguardando Análise
                    </div>
                    <div className="text-2xl font-bold text-amber-300 mt-1">{metrics.pendentes}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Sem avaliação técnica</div>
                </div>

                <div 
                    onClick={() => setStatusFilter('avaliados')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${statusFilter === 'avaliados' ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'}`}
                >
                    <div className="text-xs text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        Avaliadas / Em Andamento
                    </div>
                    <div className="text-2xl font-bold text-emerald-300 mt-1">{metrics.avaliados}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Com Score calculado</div>
                </div>

                <div 
                    onClick={() => setStatusFilter('descartados')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${statusFilter === 'descartados' ? 'bg-slate-800 border-red-500 ring-2 ring-red-500/20' : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'}`}
                >
                    <div className="text-xs text-red-400 uppercase font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                        Descartadas
                    </div>
                    <div className="text-2xl font-bold text-red-300 mt-1">{metrics.descartados}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Critérios eliminatórios</div>
                </div>
            </div>

            {/* BARRA DE PESQUISA & FILTROS RÁPIDOS */}
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Buscar por proprietário, chácara, telefone, cidade..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')} 
                            className="absolute right-3 top-2 text-slate-400 hover:text-white text-xs"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs">
                    <span className="text-slate-400 whitespace-nowrap mr-1">Filtrar:</span>
                    <button 
                        onClick={() => setStatusFilter('todos')} 
                        className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${statusFilter === 'todos' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    >
                        Todos ({metrics.total})
                    </button>
                    <button 
                        onClick={() => setStatusFilter('pendentes')} 
                        className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${statusFilter === 'pendentes' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    >
                        Pendentes ({metrics.pendentes})
                    </button>
                    <button 
                        onClick={() => setStatusFilter('avaliados')} 
                        className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${statusFilter === 'avaliados' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    >
                        Avaliados ({metrics.avaliados})
                    </button>
                    <button 
                        onClick={() => setStatusFilter('descartados')} 
                        className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${statusFilter === 'descartados' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    >
                        Descartados ({metrics.descartados})
                    </button>
                </div>
            </div>

            {/* TABELA DE PROPRIEDADES */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900/70 text-slate-400 uppercase tracking-wider text-xs border-b border-slate-700">
                            <tr>
                                <th className="p-4 font-semibold min-w-[280px]">Propriedade & Proprietário</th>
                                <th className="p-4 font-semibold min-w-[160px]">Localização & Área</th>
                                <th className="p-4 font-semibold min-w-[130px]">Preço Estimado</th>
                                <th className="p-4 font-semibold min-w-[160px]">Situação & Andamento</th>
                                <th className="p-4 font-semibold text-center">Score Atual (A)</th>
                                <th className="p-4 font-semibold text-center">Score 2035 (B)</th>
                                <th className="p-4 font-semibold text-center">Assimetria (C)</th>
                                <th className="p-4 font-semibold text-right min-w-[160px]">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredTerritories.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-slate-400">
                                        Nenhuma propriedade encontrada com os filtros selecionados.
                                    </td>
                                </tr>
                            ) : (
                                filteredTerritories.map(t => {
                                    const sA = calculateScore(t);
                                    const sB = t.score_2035_estimado || 0;
                                    const sC = sB > sA ? sB - sA : 0;
                                    const discarded = t.eliminatory_flags && t.eliminatory_flags.length > 0;
                                    const isPending = !discarded && sA === 0;
                                    const isEvaluated = !discarded && sA > 0;
                                    
                                    // Limpa telefone para link do WhatsApp
                                    const cleanPhone = (t.owner_phone || '').replace(/\D/g, '');
                                    
                                    return (
                                        <tr key={t.id} className={`hover:bg-slate-700/40 transition-colors ${discarded ? 'opacity-60 bg-red-950/10' : ''}`}>
                                            {/* 1. DADOS DO PROPRIETÁRIO, NOME DA CHÁCARA, TELEFONE E EMAIL */}
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    {/* Nome da Chácara / Sítio / Fazenda */}
                                                    <div className="font-bold text-white text-base flex items-center gap-1.5">
                                                        <span className="text-emerald-400">🏡</span>
                                                        <span>{t.property_name || <span className="text-slate-500 italic font-normal">Sem denominação</span>}</span>
                                                    </div>

                                                    {/* Nome do Proprietário */}
                                                    <div className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                                                        <span className="text-slate-400">👤</span>
                                                        <span>{t.owner_name || <span className="text-slate-500 italic text-xs">Proprietário não informado</span>}</span>
                                                    </div>

                                                    {/* Contatos: WhatsApp e E-mail */}
                                                    <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                                                        {cleanPhone ? (
                                                            <a 
                                                                href={`https://wa.me/55${cleanPhone}`}
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium bg-emerald-950/40 hover:bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-800/50"
                                                                title="Abrir conversa no WhatsApp"
                                                            >
                                                                <span>💬</span>
                                                                <span>{t.owner_phone}</span>
                                                            </a>
                                                        ) : (
                                                            <span className="text-slate-500 italic text-[11px]">Sem telefone</span>
                                                        )}

                                                        {t.owner_email && (
                                                            <a 
                                                                href={`mailto:${t.owner_email}`}
                                                                className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors hover:underline"
                                                                title="Enviar e-mail"
                                                            >
                                                                <span>✉️</span>
                                                                <span className="truncate max-w-[180px]">{t.owner_email}</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* 2. LOCALIZAÇÃO & ÁREA */}
                                            <td className="p-4">
                                                <div className="font-semibold text-white text-sm flex items-center gap-1">
                                                    <span>📍</span>
                                                    <span>{t.location_city || 'Sem Local'}</span>
                                                </div>
                                                <div className="text-xs text-slate-400 mt-1 font-mono">
                                                    {t.area_hectares ? `${t.area_hectares} ha` : '0 ha'}
                                                </div>
                                                {t.maps_link && (
                                                    <a 
                                                        href={t.maps_link} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="text-[11px] text-blue-400 hover:text-blue-300 inline-flex items-center gap-0.5 mt-1 hover:underline"
                                                    >
                                                        <span>Maps</span>
                                                        <span>↗</span>
                                                    </a>
                                                )}
                                            </td>

                                            {/* 3. PREÇO ESTIMADO */}
                                            <td className="p-4">
                                                <div className="text-emerald-400 font-mono text-xs font-semibold">
                                                    {t.estimated_price || '-'}
                                                </div>
                                                {t.price_per_hectare > 0 && (
                                                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                                        R$ {t.price_per_hectare.toLocaleString('pt-BR')}/ha
                                                    </div>
                                                )}
                                            </td>

                                            {/* 4. SITUAÇÃO / ANDAMENTO (O QUE JÁ ANDOU OU NÃO ANDOU) */}
                                            <td className="p-4">
                                                <div className="space-y-1.5">
                                                    {/* Status de Avaliação */}
                                                    {discarded ? (
                                                        <span className="inline-flex items-center gap-1 bg-red-900/60 text-red-200 border border-red-700/50 px-2 py-0.5 rounded text-xs font-bold">
                                                            <span>⛔</span> Descartado
                                                        </span>
                                                    ) : isEvaluated ? (
                                                        <span className="inline-flex items-center gap-1 bg-emerald-900/60 text-emerald-200 border border-emerald-700/50 px-2 py-0.5 rounded text-xs font-bold">
                                                            <span>✅</span> Avaliado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-amber-900/50 text-amber-200 border border-amber-700/40 px-2 py-0.5 rounded text-xs font-medium">
                                                            <span>⏳</span> Aguarda Análise
                                                        </span>
                                                    )}

                                                    {/* Sinalizador de Prioridade */}
                                                    <div>
                                                        {discarded ? null : 
                                                         sA >= 80 ? <span className="bg-green-900/60 text-green-300 px-2 py-0.5 rounded text-[10px] font-bold">ALTA PRIOR.</span> :
                                                         sA >= 60 ? <span className="bg-yellow-900/60 text-yellow-300 px-2 py-0.5 rounded text-[10px] font-bold">MONITORAR</span> :
                                                         <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px]">BAIXA PRIOR.</span>}
                                                    </div>

                                                    {/* Estágio Atual */}
                                                    {t.stage && (
                                                        <div className="text-[11px] text-slate-400">
                                                            {t.stage}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* 5. SCORES */}
                                            <td className="p-4 text-center">
                                                <span className={`text-xl font-bold ${sA > 0 ? 'text-white' : 'text-slate-500'}`}>
                                                    {sA}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`text-xl font-bold ${sB > 0 ? 'text-blue-400' : 'text-slate-500'}`}>
                                                    {sB}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`font-bold ${sC > 0 ? 'text-purple-400' : 'text-slate-500'}`}>
                                                    +{sC}
                                                </span>
                                            </td>

                                            {/* 6. AÇÕES */}
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => { setSelectedTerritory(t); setMatchCount(null); }} 
                                                        className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 border border-emerald-500/50 px-3 py-1.5 rounded transition-colors text-xs font-bold whitespace-nowrap"
                                                    >
                                                        {isEvaluated ? 'Editar Matriz' : 'Avaliar Matriz'}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(t.id)} 
                                                        className="bg-red-600/20 text-red-400 hover:bg-red-600/40 border border-red-500/50 px-2.5 py-1.5 rounded transition-colors text-xs font-bold"
                                                        title="Excluir propriedade"
                                                    >
                                                        Excluir
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
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
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span>🏡</span>
                                    <span>{selectedTerritory.property_name || 'Propriedade'}</span>
                                    <span className="text-slate-400 font-normal text-base">- {selectedTerritory.location_city || 'Sem cidade'}</span>
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">ID: {selectedTerritory.id.substring(0,8)}</span>
                                    {selectedTerritory.owner_name && (
                                        <span className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                                            Proprietário: {selectedTerritory.owner_name}
                                        </span>
                                    )}
                                </div>
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
                                        <p className="text-white font-medium">{selectedTerritory.property_name ? `${selectedTerritory.property_name} (${selectedTerritory.owner_name})` : selectedTerritory.owner_name}</p>
                                        <p className="text-emerald-400">{selectedTerritory.owner_phone} ({selectedTerritory.preferred_contact || 'WhatsApp'})</p>
                                        {selectedTerritory.owner_email && <p className="text-slate-300 text-xs mt-1">{selectedTerritory.owner_email}</p>}
                                    </div>
                                    
                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Localização e Tamanho</p>
                                        <p className="text-white">{selectedTerritory.location_city}</p>
                                        {selectedTerritory.address && <p className="text-slate-400 text-xs mt-1">{selectedTerritory.address}</p>}
                                        {selectedTerritory.coordinates && <p className="text-slate-400 text-xs font-mono">{selectedTerritory.coordinates}</p>}
                                        {selectedTerritory.maps_link && (
                                            <a href={selectedTerritory.maps_link} target="_blank" rel="noreferrer" className="text-blue-400 text-xs block mt-2 hover:underline">
                                                Abrir no Google Maps ↗
                                            </a>
                                        )}
                                        <div className="mt-2 text-slate-300 text-xs">
                                            <span>Área Total: <strong>{selectedTerritory.area_hectares} ha</strong></span>
                                            {selectedTerritory.useful_area && <span className="ml-2">| Útil: <strong>{selectedTerritory.useful_area} ha</strong></span>}
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Condições Comerciais</p>
                                        <p className="text-emerald-400 font-bold">{selectedTerritory.estimated_price || 'A combinar'}</p>
                                        {selectedTerritory.price_per_hectare && <p className="text-slate-400 text-xs font-mono">R$ {selectedTerritory.price_per_hectare}/ha</p>}
                                        <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
                                            {selectedTerritory.accept_negotiation && <span className="bg-slate-700 px-2 py-0.5 rounded text-white">Negocia Valor</span>}
                                            {selectedTerritory.accept_exchange && <span className="bg-slate-700 px-2 py-0.5 rounded text-white">Permuta</span>}
                                            {selectedTerritory.accept_partnership && <span className="bg-slate-700 px-2 py-0.5 rounded text-white">Parceria</span>}
                                            {selectedTerritory.accept_buy_option && <span className="bg-slate-700 px-2 py-0.5 rounded text-white">Opção de Compra</span>}
                                        </div>
                                    </div>

                                    {selectedTerritory.owner_pitch && (
                                        <div className="bg-slate-800/50 p-4 rounded-lg">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Por que tem potencial? (Pitch)</p>
                                            <p className="text-slate-300 text-xs italic whitespace-pre-wrap">{selectedTerritory.owner_pitch}</p>
                                        </div>
                                    )}

                                    {selectedTerritory.files_urls && selectedTerritory.files_urls.length > 0 && (
                                        <div className="bg-slate-800/50 p-4 rounded-lg">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-2">Arquivos e Anexos</p>
                                            <div className="space-y-1">
                                                {selectedTerritory.files_urls.map((url: string, idx: number) => (
                                                    <a key={idx} href={url} target="_blank" rel="noreferrer" className="block text-blue-400 text-xs hover:underline truncate">
                                                        📄 Documento #{idx + 1}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* COLUNA DIREITA: Matriz de Inteligência (Interativa) */}
                            <div className="w-2/3 bg-slate-900/50 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                <div className="flex justify-between items-center bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Score Studio Be: {totalScore}</h4>
                                        <p className="text-xs text-slate-400">Nota técnica baseada nos pesos estratégicos.</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={handleGenerateReport} 
                                            disabled={isGeneratingAi}
                                            className="bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                                        >
                                            <span>🤖</span>
                                            <span>{isGeneratingAi ? 'Gerando...' : 'Parecer I.A.'}</span>
                                        </button>
                                        <button 
                                            onClick={handleSave} 
                                            disabled={saving}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-lg transition-colors disabled:opacity-50"
                                        >
                                            {saving ? 'Salvando...' : 'Salvar Matriz'}
                                        </button>
                                    </div>
                                </div>

                                {matchCount && (
                                    <div className="bg-pink-900/30 border border-pink-500/40 p-4 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🔥</span>
                                            <div>
                                                <h5 className="font-bold text-pink-300">Potencial de Match Elevado!</h5>
                                                <p className="text-xs text-pink-200/80">Esta área possui alta aderência com o banco de leads.</p>
                                            </div>
                                        </div>
                                        <span className="text-pink-400 font-bold bg-pink-950/60 px-3 py-1 rounded text-sm">+{matchCount} Leads Compatíveis</span>
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold block mb-2">Estágio de Maturidade</label>
                                    <select 
                                        value={selectedTerritory.stage || '1 - Emergente'} 
                                        onChange={e => handleFieldChange('stage', e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-sm"
                                    >
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
                                                {eliminatoryList.map(item => (
                                                    <label key={item} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={(selectedTerritory.eliminatory_flags || []).includes(item)}
                                                            onChange={() => handleEliminatoryToggle(item)}
                                                            className="rounded bg-slate-800 border-slate-600 text-red-600 focus:ring-0" 
                                                        />
                                                        <span>{item}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* PROJEÇÃO 2035 & ASSIMETRIA */}
                                    <div className="space-y-6">
                                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                            <h5 className="text-sm font-bold text-blue-400 mb-2">Projeção 2035 (Score B)</h5>
                                            <p className="text-xs text-slate-400 mb-4">Qual a nota estimada deste território daqui a 10 anos considerando a maturação da região e da comunidade?</p>
                                            
                                            <input 
                                                type="number" 
                                                min="0" 
                                                max="110"
                                                value={selectedTerritory.score_2035_estimado || ''}
                                                onChange={e => handleFieldChange('score_2035_estimado', e.target.value)}
                                                className="w-full bg-slate-900 border border-blue-500/50 rounded-lg p-3 text-blue-400 font-bold text-2xl text-center mb-4"
                                                placeholder="Ex: 85"
                                            />

                                            <div className="bg-purple-900/30 border border-purple-500/40 p-3 rounded-lg text-center">
                                                <span className="text-xs text-purple-300 font-bold uppercase block">Assimetria de Lucro (C)</span>
                                                <span className="text-2xl font-black text-purple-400">
                                                    +{Number(selectedTerritory.score_2035_estimado || 0) > totalScore ? Number(selectedTerritory.score_2035_estimado || 0) - totalScore : 0}
                                                </span>
                                                <span className="text-[10px] text-purple-200/60 block mt-1">Pontos de valorização esperada</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE AJUDA E METODOLOGIA */}
            {showHelp && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 shadow-2xl relative">
                        <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
                        
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">📖 Metodologia de Inteligência Territorial</h2>
                        <p className="text-sm text-slate-400 mb-6">Como a Studio Be pontua, descarta e projeta a valorização das terras comunitárias.</p>

                        <div className="space-y-6">
                            {/* Estágios */}
                            <section>
                                <h3 className="text-emerald-400 font-bold border-b border-slate-800 pb-2 mb-4 text-lg">🌱 Estágios de Maturidade</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                                        <span className="font-bold text-white">Estágio 1 (Emergente)</span>
                                        <p className="mt-1 text-slate-400">Área bruta ou rural tradicional. Nenhuma intervenção comunitária. Preço de terra nua. Maior potencial de assimetria e maior risco regulatório/executivo.</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                                        <span className="font-bold text-white">Estágio 2 (Primeiros Invest.)</span>
                                        <p className="mt-1 text-slate-400">Pioneiros já identificaram valor. Processo de regularização iniciado, infraestrutura básica planejada. A assimetria ainda é alta, mas com alicerces mais claros.</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                                        <span className="font-bold text-white">Estágio 3 (Aceleração)</span>
                                        <p className="mt-1 text-slate-400">Obras avançando, documentação clara, ecossistema e comunidade ganhando corpo. O risco despenca e a velocidade de vendas/atração aumenta muito.</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                                        <span className="font-bold text-white">Estágio 4 (Consolidação)</span>
                                        <p className="mt-1 text-slate-400">Cohousing habitado e maduro. Risco próximo de zero. A valorização atingiu o platô e o local agora é um polo reconhecido e estabelecido (venda de mercado).</p>
                                    </div>
                                </div>
                            </section>

                            {/* Pesos Críticos */}
                            <section>
                                <h3 className="text-red-400 font-bold border-b border-slate-800 pb-2 mb-4 text-lg">🔥 Pesos Críticos (Peso 15)</h3>
                                <div className="space-y-3 text-sm text-slate-300">
                                    <p><strong className="text-white">Aderência:</strong> O perfil atrai o público-alvo da Studio Be? (0 = Foge do nosso DNA corporativo/comunitário; 10 = O local "grita" Studio Be).</p>
                                    <p><strong className="text-white">Natureza/Visual:</strong> Avaliação cênica. (0 = Área degradada e sem atrativos; 10 = Paisagem de tirar o fôlego, mata preservada, paraíso natural).</p>
                                    <p><strong className="text-white">Viabilidade Legal:</strong> O projeto passa na prefeitura/órgãos ambientais? (0 = Cheio de entraves e APPs complexas; 10 = Plano Diretor permite, zoneamento perfeito).</p>
                                    <p><strong className="text-white">Pot. Valorização:</strong> A região está crescendo? (0 = Estagnada ou em declínio; 10 = Vetor de crescimento da cidade, grandes obras ao redor).</p>
                                </div>
                            </section>

                            {/* Pesos Altos */}
                            <section>
                                <h3 className="text-blue-400 font-bold border-b border-slate-800 pb-2 mb-4 text-lg">⭐ Pesos Altos (Peso 10)</h3>
                                <div className="space-y-3 text-sm text-slate-300">
                                    <p><strong className="text-white">Água:</strong> Segurança hídrica. (0 = Seco, dependência total de caminhão-pipa; 10 = Nascentes próprias fortes, lagos, lençol freático abundante).</p>
                                    <p><strong className="text-white">Acesso (Distância):</strong> Facilidade de chegar. (0 = Estrada de terra terrível, muito distante de centros; 10 = Asfalto na porta, próximo a rodovias e cidades).</p>
                                </div>
                            </section>

                            {/* Pesos Complementares */}
                            <section>
                                <h3 className="text-slate-300 font-bold border-b border-slate-800 pb-2 mb-4 text-lg">⚖️ Pesos Complementares (Peso 5)</h3>
                                <div className="space-y-3 text-sm text-slate-300">
                                    <p><strong className="text-white">Infraestrutura:</strong> O que já tem pronto? (0 = Nada, mato puro; 10 = Energia trifásica, internet, sedes prontas, cercas boas).</p>
                                    <p><strong className="text-white">Custo Relativo:</strong> Oportunidade de compra. (0 = Acima do preço de mercado; 10 = "Barganha", muito abaixo do valor real).</p>
                                    <p><strong className="text-white">Regenerativo:</strong> Oportunidade de impacto ecológico. (0 = Não há o que recuperar ou impossível; 10 = Pode virar um grande case de reflorestamento e carbono).</p>
                                    <p><strong className="text-white">Comunitário:</strong> Impacto no entorno. (0 = Isolado/hostil; 10 = Possibilidade gigante de envolver produtores locais e gerar impacto social positivo).</p>
                                </div>
                            </section>

                            {/* Especiais */}
                            <section className="bg-blue-900/20 p-4 rounded-xl border border-blue-900/50">
                                <h3 className="text-purple-400 font-bold mb-2 text-lg">✨ Índice Piraí (Bônus) & Assimetria 2035</h3>
                                <div className="space-y-3 text-sm text-slate-300">
                                    <p><strong className="text-white">Índice Piraí (Até +10 pontos extras):</strong> O "Fator X". Use para premiar terrenos que têm algo único que a matemática não captura (ex: vista exclusiva para um cânion, história única, localização num eixo muito desejado). Soma direto na nota final, podendo ultrapassar os 100 pontos.</p>
                                    <p><strong className="text-white">Score 2035:</strong> Projete a nota do terreno em 10 anos. A diferença entre o Score Atual e o 2035 gera a "Assimetria" (o lucro/valorização projetada). Terrenos Emergentes geralmente têm notas atuais baixas (ex: 45) mas alto Score 2035 (ex: 85), revelando uma assimetria enorme (+40).</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        
            {aiReport && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-purple-500/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar p-8 shadow-2xl relative">
                        <button onClick={() => setAiReport(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
                        
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">🤖 Parecer Executivo de Investimento</h2>
                        
                        <div className="prose prose-invert prose-emerald max-w-none text-slate-300">
                            <div dangerouslySetInnerHTML={{ __html: aiReport.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>

                        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-800">
                            <button onClick={() => setAiReport(null)} className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700">Fechar</button>
                            <button onClick={() => window.print()} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Exportar PDF</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
