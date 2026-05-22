'use client';

import React, { useState } from 'react';
import { logManualInteraction } from '@/lib/db';

interface LogInteractionFormProps {
    leadId: string;
}

export default function LogInteractionForm({ leadId }: LogInteractionFormProps) {
    const [type, setType] = useState<'WhatsApp' | 'Ligação' | 'Reunião' | 'E-mail'>('WhatsApp');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            await logManualInteraction(leadId, content, type);
            setSuccess(true);
            setContent('');
            setTimeout(() => {
                setSuccess(false);
                window.location.reload(); // Refresh to show new interaction
            }, 1000);
        } catch (error) {
            console.error('Erro ao salvar interação:', error);
            alert('Erro ao salvar interação. Verifique a conexão.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[#0f172a] p-6 rounded-3xl shadow-sm border border-slate-800">
            <h3 className="font-bold text-slate-50 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Registrar Atividade Manual
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tipo de Contato</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {['WhatsApp', 'Ligação', 'Reunião', 'E-mail'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t as any)}
                                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                                    type === t 
                                    ? 'bg-primary-900 text-white border-primary-900 shadow-sm' 
                                    : 'bg-[#0f172a] text-slate-300 border-slate-800 hover:border-primary-200'
                                }`}
                            >
                                {t === 'WhatsApp' && '📱 '}
                                {t === 'Ligação' && '📞 '}
                                {t === 'Reunião' && '👥 '}
                                {t === 'E-mail' && '✉️ '}
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">O que foi conversado?</label>
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Ex: Liguei para confirmar o meet de amanhã. Ele está animado com a região."
                        className="w-full mt-2 p-3 rounded-xl border border-slate-800 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm min-h-[100px] resize-none"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading || !content.trim()}
                    className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm ${
                        success 
                        ? 'bg-green-500 text-white' 
                        : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98]'
                    }`}
                >
                    {loading ? 'Salvando...' : success ? '✓ Registrado' : 'Registrar no Histórico'}
                </button>
            </div>
        </form>
    );
}
