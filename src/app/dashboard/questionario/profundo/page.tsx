'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useClientTier } from '../../ClientTierContext';

export default function AlinhamentoProfundoPage() {
    const { tier, setTier } = useClientTier();
    // Novos status para acomodar o Paywall e o Relatório Premium
    const [status, setStatus] = useState<'idle' | 'loading' | 'paywall' | 'premium' | 'error'>('idle');
    const [formData, setFormData] = useState({
        governance_style: '',
        conflict_resolution: '',
        incompatible_behaviors: [] as string[]
    });

    const behaviors = ['Cigarro / Fumo', 'Música alta frequente', 'Falta de limpeza comum', 'Animais soltos sem coleira', 'Desrespeito às regras de visita'];

    const toggleBehavior = (value: string) => {
        setFormData(prev => {
            const arr = prev.incompatible_behaviors;
            if (arr.includes(value)) return { ...prev, incompatible_behaviors: arr.filter(i => i !== value) };
            if (arr.length < 3) return { ...prev, incompatible_behaviors: [...arr, value] };
            return prev;
        });
    };

    const handleSubmit = async () => {
        setStatus('loading');
        try {
            const { data: userData } = await supabase.auth.getUser();
            const user_id = userData?.user?.id;

            if (user_id) {
                const { error } = await supabase.from('match_answers_deep').insert([{
                    user_id,
                    ...formData
                }]);
                if (error) console.error("DB Error:", error);
            }

            // Simula o tempo da "Inteligência Artificial" processando os dados
            await new Promise(r => setTimeout(r, 2500));
            
            // Em vez de dar o sucesso de graça, enviamos para a tela de VENDA (Paywall)
            setStatus('paywall');
            
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    const simulatePurchase = () => {
        // Quando o usuário compra o relatório
        setStatus('premium');
        // Avança o nível oficial do cliente para a próxima fase (Nível 2)
        if (tier === 1) {
            setTier(2);
        }
    };

    // ==========================================
    // TELA 3: RELATÓRIO PREMIUM (Pós-Compra)
    // ==========================================
    if (status === 'premium') {
        return (
            <div className="max-w-4xl mx-auto py-10">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary-900">Seu Raio-X de Convivência</h1>
                        <p className="text-gray-600">Relatório Premium Desbloqueado</p>
                    </div>
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl shadow-sm border border-green-200">
                        🏆
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Card de Match Geral */}
                    <div className="bg-gradient-to-br from-primary-900 to-secondary-900 rounded-2xl p-6 text-white shadow-lg">
                        <h3 className="text-primary-200 text-sm font-bold uppercase tracking-wider mb-2">Comunidade Ideal</h3>
                        <p className="text-3xl font-serif font-bold mb-1">Vila Botânica</p>
                        <p className="text-secondary-100 text-sm mb-6">Baseado em seu perfil, esta é a turma mais compatível hoje.</p>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span>Índice de Match</span>
                                <span className="text-green-400">88%</span>
                            </div>
                            <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                                <div className="bg-green-400 w-[88%] h-full rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Radar de Compatibilidade */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                        <h3 className="text-gray-800 font-bold text-lg mb-4">Dimensões de Convivência</h3>
                        
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                                <span>Estilo de Vida</span> <span className="text-green-600">Alto</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-green-500 w-[90%] h-full"></div></div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                                <span>Saúde Financeira Compartilhada</span> <span className="text-yellow-600">Médio</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-yellow-500 w-[60%] h-full"></div></div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                                <span>Alinhamento de Governança</span> 
                                <span className={formData.governance_style.includes('Consentimento') ? 'text-green-600' : 'text-red-500'}>
                                    {formData.governance_style.includes('Consentimento') ? 'Excelente' : 'Atenção'}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div className={`h-full ${formData.governance_style.includes('Consentimento') ? 'bg-green-500 w-[95%]' : 'bg-red-500 w-[35%]'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
                    <h3 className="text-2xl font-serif font-bold text-primary-900 mb-6 border-b pb-4">Mapa de Conflitos Potenciais</h3>
                    
                    <div className="space-y-6">
                        {/* Dinâmico baseado na resposta de governança */}
                        {!formData.governance_style.includes('Consentimento') ? (
                            <div className="flex gap-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-900">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                    <h4 className="font-bold mb-1">Risco na Tomada de Decisão</h4>
                                    <p className="text-sm opacity-90">Você prefere <strong>{formData.governance_style.split('(')[0]}</strong>, mas comunidades resilientes usam a Sociocracia. Em um Cohousing, a votação por maioria cria uma "minoria perdedora" que pode gerar ressentimentos graves. Recomendamos fortemente estudar o método de consentimento antes de ingressar.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-4 p-4 bg-green-50 border border-green-100 rounded-xl text-green-900">
                                <span className="text-2xl">✅</span>
                                <div>
                                    <h4 className="font-bold mb-1">Governança Alinhada</h4>
                                    <p className="text-sm opacity-90">Sua escolha pela Sociocracia/Consentimento demonstra maturidade para a vida em comunidade. Este é o modelo oficial do Studio Be.</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-900">
                            <span className="text-2xl">🔍</span>
                            <div>
                                <h4 className="font-bold mb-1">Semáforo de Hábitos (Seus Dealbreakers)</h4>
                                <p className="text-sm opacity-90 mb-3">Você marcou os seguintes itens como 100% intoleráveis:</p>
                                <ul className="list-disc pl-5 text-sm font-semibold space-y-1">
                                    {formData.incompatible_behaviors.length > 0 ? (
                                        formData.incompatible_behaviors.map(b => <li key={b}>{b}</li>)
                                    ) : (
                                        <li>Você foi altamente tolerante (nenhum dealbreaker crítico selecionado).</li>
                                    )}
                                </ul>
                                <p className="text-sm opacity-90 mt-3">A turma da <strong>Vila Botânica</strong> possui regras rígidas e alinhadas com suas exigências. Não prevemos conflitos nesta área.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 text-center">
                        <Link href="/dashboard" className="bg-primary-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-primary-700 transition-colors inline-block text-lg">
                            Ir para a Comunidade (Nível 2 Desbloqueado)
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // TELA 2: PAYWALL (Oferta do Produto de Entrada)
    // ==========================================
    if (status === 'paywall') {
        return (
            <div className="max-w-4xl mx-auto py-8">
                <div className="text-center mb-8">
                    <div className="inline-block bg-primary-100 text-primary-800 font-bold px-4 py-1.5 rounded-full text-sm mb-4 animate-pulse">
                        Análise Concluída com Sucesso! ✨
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-primary-900 mb-4">Descubra seu Potencial de Convivência</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Nossa IA cruzou seus dados com as comunidades disponíveis e gerou o seu <strong>Raio-X de Compatibilidade</strong>.
                    </p>
                </div>

                <div className="relative bg-white rounded-2xl shadow-xl border border-secondary-200 overflow-hidden">
                    {/* Efeito de Borrão (Blur) emulando o conteúdo trancado */}
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[6px] z-10 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
                            <span className="text-4xl">🔒</span>
                        </div>
                        <h2 className="text-2xl font-bold text-primary-900 mb-2">Desbloqueie o Relatório Completo</h2>
                        <p className="text-gray-700 mb-8 max-w-md">
                            Tenha acesso ao seu Mapa de Conflitos, Análise Financeira Compartilhada e descubra exatamente em qual comunidade você viverá melhor.
                        </p>
                        <button 
                            onClick={simulatePurchase}
                            className="bg-green-600 text-white font-bold text-lg py-4 px-12 rounded-xl shadow-xl hover:bg-green-700 hover:scale-105 transition-all w-full md:w-auto"
                        >
                            Comprar Raio-X Premium por R$ 97,00
                        </button>
                        <p className="text-xs text-gray-500 mt-4 max-w-xs">
                            Pagamento 100% seguro. Este relatório é o passaporte oficial para ingressar nas comunidades Studio Be.
                        </p>
                    </div>

                    {/* Fundo simulado (Isca visual) */}
                    <div className="p-8 opacity-40 pointer-events-none select-none">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="h-32 bg-gray-100 rounded-xl border border-gray-200"></div>
                            <div className="h-32 bg-gray-100 rounded-xl border border-gray-200"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="space-y-4">
                            <div className="h-16 bg-red-50 rounded-lg"></div>
                            <div className="h-16 bg-blue-50 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // TELA 1: QUESTIONÁRIO PROFUNDO
    // ==========================================
    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <Link href="/dashboard" className="text-primary-600 hover:underline mb-4 inline-block font-medium">
                    &larr; Voltar para Jornada
                </Link>
                <h1 className="text-4xl font-serif font-bold text-primary-900 tracking-tight">Alinhamento Profundo</h1>
                <p className="text-gray-600 mt-3 text-lg leading-relaxed">Filtro de Compatibilidade para admissão na comunidade. Fatores como Governança têm alto peso eliminatório na nossa avaliação.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-8 md:p-10">
                <div className="space-y-10">
                    
                    {/* Q8 Governança - PESO 4 */}
                    <div className="space-y-4">
                        <label className="font-semibold text-gray-800 text-xl font-serif flex flex-col md:flex-row md:items-center gap-3">
                            <span>1. Como as decisões devem ser tomadas?</span>
                            <span className="inline-block bg-red-100 text-red-800 text-xs px-3 py-1.5 rounded-full uppercase tracking-wider font-bold shadow-sm w-max border border-red-200">Peso 4 (Crítico)</span>
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            {['Votação por maioria simples (metade + 1 ganha)', 'Consenso (100% precisam dizer SIM, o que pode travar decisões)', 'Consentimento / Sociocracia (Busca por objeções válidas, focado em avançar)'].map((opt) => (
                                <label key={opt} className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-colors ${formData.governance_style === opt ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-primary-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="gov" checked={formData.governance_style === opt} onChange={() => setFormData({...formData, governance_style: opt})} className="w-6 h-6 text-primary-600" />
                                    <span className={`text-lg ${formData.governance_style === opt ? 'font-semibold text-primary-900' : 'text-gray-700'}`}>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Q9 Incompatíveis - PESO 4 */}
                    <div className="space-y-4">
                        <label className="font-semibold text-gray-800 text-xl font-serif flex flex-col md:flex-row md:items-center gap-3">
                            <span>2. O que é 100% intolerável para você?</span>
                            <span className="inline-block bg-red-100 text-red-800 text-xs px-3 py-1.5 rounded-full uppercase tracking-wider font-bold shadow-sm w-max border border-red-200">Fator Eliminatório</span>
                        </label>
                        <p className="text-gray-500 text-sm">Selecione até 3 comportamentos que fariam você desistir da comunidade.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {behaviors.map((opt) => {
                                const isChecked = formData.incompatible_behaviors.includes(opt);
                                const isDisabled = !isChecked && formData.incompatible_behaviors.length >= 3;
                                return (
                                    <label key={opt} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${isChecked ? 'border-primary-500 bg-primary-50' : isDisabled ? 'opacity-50 border-gray-100 cursor-not-allowed' : 'border-gray-100 hover:border-primary-200 hover:bg-gray-50'}`}>
                                        <input type="checkbox" checked={isChecked} onChange={() => toggleBehavior(opt)} disabled={isDisabled} className="w-5 h-5 text-primary-600 rounded" />
                                        <span className={isChecked ? 'font-semibold text-primary-900' : 'text-gray-700'}>{opt}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-gray-500 text-sm">Ao submeter, o sistema processará seu Mapa de Convivência.</p>
                        <button 
                            onClick={handleSubmit} 
                            disabled={status === 'loading' || !formData.governance_style}
                            className="bg-primary-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {status === 'loading' ? (
                                <><span className="animate-spin">⚙️</span> Analisando Perfil...</>
                            ) : 'Submeter para Análise'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
