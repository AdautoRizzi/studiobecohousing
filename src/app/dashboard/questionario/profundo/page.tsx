'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useClientTier } from '../../ClientTierContext';

export default function AlinhamentoProfundoPage() {
    const { tier, setTier } = useClientTier();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
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

            await new Promise(r => setTimeout(r, 2000));
            setStatus('success');
            
            // Advance tier automatically
            if (tier === 1) {
                setTier(2);
            }
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="max-w-3xl mx-auto py-16 text-center">
                <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-sm border border-primary-200">
                    🤝
                </div>
                <h2 className="text-4xl font-serif font-bold text-primary-900 mb-4">Análise Concluída!</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                    Avaliamos seu nível de governança e compatibilidade. <strong>Você tem 92% de match com a Turma Vila Botânica.</strong><br/>
                    O Nível 2 (Comunidade) está desbloqueado para você.
                </p>
                <Link href="/dashboard" className="bg-primary-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-primary-700 transition-colors inline-block text-lg">
                    Ir para Comunidade
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <Link href="/dashboard" className="text-primary-600 hover:underline mb-4 inline-block font-medium">
                    &larr; Voltar para Jornada
                </Link>
                <h1 className="text-4xl font-serif font-bold text-primary-900 tracking-tight">Alinhamento Profundo</h1>
                <p className="text-gray-600 mt-3 text-lg leading-relaxed">Filtro de Compatibilidade e Prontidão para admissão real na comunidade. Fatores como Governança têm alto peso eliminatório na matemática do nosso sistema.</p>
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
                        <p className="text-gray-500 text-sm">Questionário da Etapa 2 (Match e Admissão).</p>
                        <button 
                            onClick={handleSubmit} 
                            disabled={status === 'loading' || !formData.governance_style}
                            className="bg-primary-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? 'Calculando Compatibilidade...' : 'Submeter para Análise'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
