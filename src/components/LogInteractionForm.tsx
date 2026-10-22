'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { logManualInteractionAction } from '@/app/actions';

interface LogInteractionFormProps {
    leadId: string;
}

export default function LogInteractionForm({ leadId }: LogInteractionFormProps) {
    const router = useRouter();
    const [type, setType] = useState<'WhatsApp' | 'Ligação' | 'Reunião' | 'E-mail'>('WhatsApp');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const handleSelectType = (e: any) => {
            if (e.detail) {
                setType(e.detail);
                if (textareaRef.current) {
                    textareaRef.current.focus();
                }
            }
        };
        window.addEventListener('select-interaction-type', handleSelectType);
        return () => window.removeEventListener('select-interaction-type', handleSelectType);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = content.trim();
        if (!trimmed) return;

        setLoading(true);
        setErrorMsg('');
        setSuccess(false);

        try {
            const res = await logManualInteractionAction(leadId, trimmed, type);
            if (res.success) {
                setSuccess(true);
                setContent('');
                router.refresh();
                setTimeout(() => setSuccess(false), 3500);
            } else {
                setErrorMsg(res.error || 'Erro ao registrar no banco de dados.');
            }
        } catch (error: any) {
            console.error('Erro ao salvar interação:', error);
            setErrorMsg(error.message || 'Erro de conexão ao salvar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form 
            id="registro-atividade-manual" 
            onSubmit={handleSubmit} 
            className="bg-[#0f172a] p-6 rounded-3xl shadow-sm border border-slate-800 transition-all scroll-mt-24"
        >
            <h3 className="font-bold text-slate-50 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Registrar Atividade Manual
                </span>
                {success && (
                    <span className="text-xs bg-emerald-950/80 text-emerald-400 border border-emerald-600/40 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse">
                        ✓ Salvo no Histórico!
                    </span>
                )}
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipo de Contato</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {(['WhatsApp', 'Ligação', 'Reunião', 'E-mail'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                    type === t 
                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' 
                                    : 'bg-[#020617] text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white'
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
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">O que foi conversado?</label>
                    <textarea 
                        ref={textareaRef}
                        id="manual-interaction-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Ex: Liguei para confirmar o meet de amanhã. Ele está animado com a região."
                        className="w-full mt-2 p-3 rounded-xl border border-slate-700 bg-[#020617] text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm min-h-[100px] resize-none"
                    />
                </div>

                {errorMsg && (
                    <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300">
                        {errorMsg}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading || !content.trim()}
                    className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm cursor-pointer ${
                        loading
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : success
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]'
                    }`}
                >
                    {loading ? 'Salvando no banco...' : success ? '✓ Registrado com Sucesso' : 'Registrar no Histórico'}
                </button>
            </div>
        </form>
    );
}
