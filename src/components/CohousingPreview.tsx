'use client';

import React from 'react';

export default function CohousingPreview() {
    const handleOpenModal = () => {
        window.dispatchEvent(new Event('openFormModal'));
    };

    return (
        <div 
            onClick={handleOpenModal}
            className="cursor-pointer group animate-in fade-in zoom-in duration-500"
        >
            <div className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-2xl border border-secondary-100 hover:border-secondary-300 transition-all hover:shadow-secondary-500/20 relative overflow-hidden">
                
                {/* Overlay de clique visual */}
                <div className="absolute inset-0 bg-secondary-50/20 md:bg-secondary-50/0 group-hover:bg-secondary-50/50 transition-colors z-10 flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100">
                    <span className="bg-secondary-600 text-white font-bold px-8 py-4 rounded-full shadow-lg transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2">
                        Preencher Agora
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                </div>

                <div className="relative z-0 opacity-80 blur-[1px] group-hover:blur-sm transition-all pointer-events-none">
                    <h3 className="text-xl font-bold text-primary-900 mb-8 border-b border-gray-50 pb-2">Identificação</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1 col-span-full">
                            <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo *</label>
                            <input disabled type="text" className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200" placeholder="Seu nome" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">E-mail *</label>
                            <input disabled type="text" className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200" placeholder="seu@email.com" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp *</label>
                            <input disabled type="text" className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200" placeholder="(11) 90000-0000" />
                        </div>
                        <div className="col-span-full pt-6 flex justify-end">
                            <div className="h-14 px-10 rounded-full bg-primary-900/50 text-white flex items-center font-bold">Próxima Etapa ➔</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
