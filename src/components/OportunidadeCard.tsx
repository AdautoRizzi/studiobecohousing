'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export interface MediaItem {
    type: 'image' | 'video';
    url: string;
    thumbUrl: string;
    title: string;
}

export interface OportunidadeProps {
    id: string;
    titulo: string;
    descricao: string;
    status: string;
    tipo: string;
    imagem_url: string;
    destaque?: boolean;
    media: MediaItem[];
    linkInteresse?: string;
}

export default function OportunidadeCard({
    id,
    titulo,
    descricao,
    status,
    tipo,
    imagem_url,
    destaque,
    media = [],
    linkInteresse = '/#cadastro'
}: OportunidadeProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleClose = useCallback(() => {
        setSelectedIndex(null);
    }, []);

    const handlePrev = useCallback(() => {
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex - 1 + media.length) % media.length);
    }, [selectedIndex, media.length]);

    const handleNext = useCallback(() => {
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex + 1) % media.length);
    }, [selectedIndex, media.length]);

    // Teclado: ESC para fechar, setas para navegar
    useEffect(() => {
        if (selectedIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [selectedIndex, handleClose, handlePrev, handleNext]);

    const activeItem = selectedIndex !== null ? media[selectedIndex] : null;

    return (
        <>
            <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden flex flex-col md:flex-row shadow-lg hover:shadow-2xl transition-shadow duration-500">
                {/* Imagem Principal da Oportunidade */}
                <div 
                    onClick={() => media.length > 0 && setSelectedIndex(0)}
                    className={`w-full md:w-2/5 lg:w-1/2 bg-gray-100 relative min-h-[320px] md:min-h-full ${media.length > 0 ? 'cursor-pointer group' : ''} overflow-hidden`}
                >
                    {imagem_url ? (
                        <img 
                            src={imagem_url} 
                            alt={titulo} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}

                    {destaque && (
                        <div className="absolute top-6 left-6 z-10">
                            <span className="inline-block px-4 py-2 bg-yellow-400 text-yellow-900 text-xs font-black uppercase tracking-widest rounded-full shadow-md">
                                Oportunidade em Destaque
                            </span>
                        </div>
                    )}

                    {media.length > 0 && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                            <span className="text-white text-sm font-semibold flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                                Clique para ver galeria em tela cheia
                            </span>
                        </div>
                    )}
                </div>

                {/* Conteúdo ao lado */}
                <div className="p-8 md:p-12 flex-1 flex flex-col justify-center w-full md:w-3/5 lg:w-1/2">
                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="px-4 py-1.5 bg-primary-50 text-primary-700 text-xs uppercase font-bold tracking-wider rounded-full border border-primary-100">
                            {tipo}
                        </span>
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs uppercase font-bold tracking-wider rounded-full border border-gray-200">
                            Status: {status}
                        </span>
                    </div>

                    <h3 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-6 leading-tight">
                        {titulo}
                    </h3>
                    
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        {descricao}
                    </p>

                    {/* Galeria de Fotos e Vídeo ao lado/abaixo do texto */}
                    {media.length > 0 && (
                        <div className="mb-8 pt-2 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Fotos & Vídeo do Projeto
                                </span>
                                <span className="text-xs text-primary-600 font-semibold hidden sm:inline">
                                    Clique para abrir
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {media.map((item, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedIndex(idx)}
                                        className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 border-2 border-gray-100 hover:border-primary-500 shadow-sm hover:shadow-md transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <img 
                                            src={item.thumbUrl} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />

                                        {item.type === 'video' ? (
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex flex-col items-center justify-center p-2">
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/95 text-primary-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                    <svg className="w-4 h-4 md:w-5 md:h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                                <span className="text-[11px] font-bold text-white mt-1.5 drop-shadow">
                                                    Vídeo 3D
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-end p-2 opacity-0 group-hover:opacity-100">
                                                <div className="w-6 h-6 rounded-full bg-white/90 text-gray-800 flex items-center justify-center shadow">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Botão direcionando para o cadastro de interesse */}
                    <div className="mt-auto">
                        <Link 
                            href={linkInteresse} 
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-1 text-lg w-full md:w-auto text-center"
                        >
                            Tenho interesse neste projeto
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modal / Lightbox Interativo */}
            {selectedIndex !== null && activeItem && (
                <div 
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
                    onClick={handleClose}
                >
                    {/* Botão Fechar */}
                    <button 
                        type="button"
                        onClick={handleClose}
                        className="absolute top-4 right-4 md:top-6 md:right-6 z-20 text-white/80 hover:text-white p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors focus:outline-none"
                        aria-label="Fechar galeria"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Botão Anterior */}
                    {media.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrev();
                            }}
                            className="absolute left-2 md:left-6 z-20 text-white/80 hover:text-white p-3 bg-white/10 hover:bg-white/25 rounded-full transition-all backdrop-blur-sm focus:outline-none"
                            aria-label="Mídia anterior"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Botão Próximo */}
                    {media.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                            className="absolute right-2 md:right-6 z-20 text-white/80 hover:text-white p-3 bg-white/10 hover:bg-white/25 rounded-full transition-all backdrop-blur-sm focus:outline-none"
                            aria-label="Próxima mídia"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Conteúdo Central */}
                    <div 
                        className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {activeItem.type === 'video' ? (
                            <div className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                <video 
                                    key={activeItem.url}
                                    src={activeItem.url} 
                                    controls 
                                    autoPlay 
                                    playsInline
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <img 
                                    src={activeItem.url} 
                                    alt={activeItem.title} 
                                    className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
                                />
                            </div>
                        )}

                        {/* Título e contador */}
                        <div className="mt-4 flex flex-col items-center text-center">
                            <p className="text-white text-base md:text-lg font-medium drop-shadow">
                                {activeItem.title}
                            </p>
                            <span className="text-white/60 text-xs mt-1">
                                {selectedIndex + 1} de {media.length} • Use as setas do teclado para navegar
                            </span>
                        </div>

                        {/* Barra de miniaturas inferior */}
                        <div className="mt-4 flex gap-2">
                            {media.map((m, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedIndex(idx)}
                                    className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                                        idx === selectedIndex 
                                            ? 'border-primary-400 scale-105 shadow-lg' 
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img src={m.thumbUrl} alt={m.title} className="w-full h-full object-cover" />
                                    {m.type === 'video' && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
