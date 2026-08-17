'use client';

import { useState } from 'react';

export default function CerebroPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            // Em breve chamaremos a API real para processar o RAG
            await fetch('/api/cerebro/train', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content }) });
            
            
            
            setSuccess(true);
            setTitle('');
            setContent('');
            
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error(error);
            alert('Erro ao treinar a I.A.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    🧠 Cérebro do Orquestrador I.A.
                </h1>
                <p className="text-slate-400 mt-2">
                    Cole as transcrições das suas reuniões (Meet, Zoom, etc) ou documentos importantes aqui. 
                    A I.A. vai ler, fatiar e memorizar essas informações para poder responder perguntas no WhatsApp, Slack e Site.
                </p>
            </div>

            <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                {success && (
                    <div className="mb-6 p-4 bg-emerald-900/30 border border-emerald-500/50 rounded-lg text-emerald-400 flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <strong>Sucesso!</strong> A transcrição foi salva e a I.A. já está treinada com esse conhecimento.
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Título da Reunião / Documento
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Reunião Geral de Planejamento - 10/08/2026"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex justify-between">
                            <span>Conteúdo (Texto / Transcrição)</span>
                            <span className="text-slate-500 text-xs">Pode colar textos gigantes aqui.</span>
                        </label>
                        <textarea
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Cole aqui todo o texto da reunião..."
                            className="w-full h-80 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors custom-scrollbar resize-y"
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-800">
                        <button
                            type="submit"
                            disabled={loading || !title || !content}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                                loading || !title || !content 
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                                : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processando e Memorizando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    Salvar e Treinar I.A.
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
