'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useClientTier } from '../../ClientTierContext';
import { useRouter } from 'next/navigation';

export default function DescobridorPage() {
    const { tier, setTier } = useClientTier();
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        when_to_move: '',
        motivations: [] as string[],
        wants_more: [] as string[],
        wants_less: [] as string[],
        future_vision: '',
        network_size: ''
    });

    const motivationsOptions = ['Ter mais qualidade de vida', 'Viver em comunidade', 'Combater a solidão', 'Envelhecer com autonomia', 'Segurança', 'Sustentabilidade'];
    const wantsMoreOptions = ['Natureza', 'Silêncio', 'Amigos próximos', 'Tempo livre', 'Atividades Culturais', 'Saúde e Bem-estar'];
    const wantsLessOptions = ['Trânsito', 'Poluição', 'Custos altos de manutenção', 'Estresse', 'Isolamento', 'Preocupações com segurança'];

    const toggleArray = (field: 'motivations' | 'wants_more' | 'wants_less', value: string, max: number) => {
        setFormData(prev => {
            const arr = prev[field];
            if (arr.includes(value)) {
                return { ...prev, [field]: arr.filter(i => i !== value) };
            }
            if (arr.length < max) {
                return { ...prev, [field]: [...arr, value] };
            }
            return prev;
        });
    };

    const handleSubmit = async () => {
        setStatus('loading');
        try {
            const { data: userData } = await supabase.auth.getUser();
            const user_id = userData?.user?.id;

            if (user_id) {
                const { error } = await supabase.from('match_answers_discovery').insert([{
                    user_id,
                    ...formData
                }]);
                if (error) console.error("DB Error:", error);
            } else {
                console.warn("Usuário não autenticado no Supabase. Simulando sucesso no protótipo.");
            }

            // Simulate loading
            await new Promise(r => setTimeout(r, 1500));
            setStatus('success');
            
            // Advance tier automatically
            if (tier === 0) {
                setTier(1);
            }
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="max-w-3xl mx-auto py-16 text-center">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-sm border border-green-200">
                    🌱
                </div>
                <h2 className="text-4xl font-serif font-bold text-primary-900 mb-4">Perfil Criado!</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                    Seu Perfil de Futuro é: <strong>"Explorador Comunitário"</strong>.<br/>
                    Você deu o primeiro passo na sua jornada. Liberamos o Nível 1 para você!
                </p>
                <Link href="/dashboard" className="bg-primary-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-primary-700 transition-colors inline-block text-lg">
                    Ver Minha Evolução
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
                <h1 className="text-4xl font-serif font-bold text-primary-900 tracking-tight">O Descobridor</h1>
                <p className="text-gray-600 mt-3 text-lg leading-relaxed">Descubra sua Afinidade e Momento de Vida. Estas respostas criam o seu primeiro Perfil de Futuro na plataforma.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-8 md:p-10">
                <div className="space-y-10">
                    {/* Q1 */}
                    <div className="space-y-4">
                        <label className="font-semibold text-gray-800 text-xl font-serif">1. Quando pretende mudar?</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {['Em 1 ano', 'Entre 1 e 2 anos', 'Entre 2 e 5 anos', 'Mais de 5 anos', 'Ainda não sei, só pesquisando'].map((opt) => (
                                <label key={opt} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${formData.when_to_move === opt ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-primary-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="q1" checked={formData.when_to_move === opt} onChange={() => setFormData({...formData, when_to_move: opt})} className="w-5 h-5 text-primary-600" />
                                    <span className={formData.when_to_move === opt ? 'font-semibold text-primary-900' : 'text-gray-700'}>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="space-y-4">
                        <label className="font-semibold text-gray-800 text-xl font-serif">2. O que mais motiva sua busca? <span className="text-sm font-sans text-gray-400 font-normal">(Máx. 3 respostas)</span></label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {motivationsOptions.map((opt) => {
                                const isChecked = formData.motivations.includes(opt);
                                const isDisabled = !isChecked && formData.motivations.length >= 3;
                                return (
                                    <label key={opt} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${isChecked ? 'border-primary-500 bg-primary-50' : isDisabled ? 'opacity-50 border-gray-100 cursor-not-allowed' : 'border-gray-100 hover:border-primary-200 hover:bg-gray-50'}`}>
                                        <input type="checkbox" checked={isChecked} onChange={() => toggleArray('motivations', opt, 3)} disabled={isDisabled} className="w-5 h-5 text-primary-600 rounded" />
                                        <span className={isChecked ? 'font-semibold text-primary-900' : 'text-gray-700'}>{opt}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="space-y-4">
                        <label className="font-semibold text-gray-800 text-xl font-serif">3. Pensando nos próximos 5 anos, o que gostaria de ter MAIS na vida? <span className="text-sm font-sans text-gray-400 font-normal">(Máx. 3)</span></label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {wantsMoreOptions.map((opt) => {
                                const isChecked = formData.wants_more.includes(opt);
                                const isDisabled = !isChecked && formData.wants_more.length >= 3;
                                return (
                                    <label key={opt} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${isChecked ? 'border-primary-500 bg-primary-50' : isDisabled ? 'opacity-50 border-gray-100 cursor-not-allowed' : 'border-gray-100 hover:border-primary-200 hover:bg-gray-50'}`}>
                                        <input type="checkbox" checked={isChecked} onChange={() => toggleArray('wants_more', opt, 3)} disabled={isDisabled} className="w-5 h-5 text-primary-600 rounded" />
                                        <span className={isChecked ? 'font-semibold text-primary-900' : 'text-gray-700'}>{opt}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-gray-500 text-sm">Este é o questionário da Etapa 1 (Descoberta).</p>
                        <button 
                            onClick={handleSubmit} 
                            disabled={status === 'loading'}
                            className="bg-primary-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Processando Match...' : 'Salvar Perfil Descobridor'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
