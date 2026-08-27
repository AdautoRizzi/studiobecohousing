'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { supabase } from '@/lib/supabase';

export default function MidiasPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        // Read URL parameter for initial tag filter
        const params = new URLSearchParams(window.location.search);
        const tagParam = params.get('tag');
        if (tagParam) {
            setSelectedTag(tagParam);
        }

        const fetchPosts = async () => {
            const { data } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
            if (data) setPosts(data);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    const allTags = Array.from(new Set(posts.flatMap(p => p.tags || []))).sort();
    const filteredPosts = selectedTag ? posts.filter(p => p.tags && p.tags.includes(selectedTag)) : posts;

    // Helper to update URL when clicking tags
    const handleTagSelect = (tag: string | null) => {
        setSelectedTag(tag);
        if (tag) {
            window.history.pushState(null, '', `?tag=${encodeURIComponent(tag)}`);
        } else {
            window.history.pushState(null, '', window.location.pathname);
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans text-foreground flex flex-col relative">
            <PublicHeader />

            <main className="flex-1 bg-gray-50">
                <div className="container mx-auto px-6 py-20 lg:py-32">

                    <div className="text-center mb-16 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 text-primary-800 text-sm font-bold mb-6 border border-secondary-100 uppercase tracking-widest">
                            Blog & Mídias
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-primary-900 tracking-tight leading-tight mb-8">
                            O Mundo fala sobre o <span className="text-secondary-600">Cohousing</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mt-4 leading-relaxed font-light">
                            Acompanhe os estudos, reportagens e tendências do mercado imobiliário voltados para as Comunidades Intencionais.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                        {/* Lado Esquerdo: Posts */}
                        <div className="lg:col-span-8 lg:order-1 order-2">
                            {loading ? (
                                <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                                    <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                                    <p>Carregando artigos...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {filteredPosts.map(noticia => (
                                        <div key={noticia.id} className="bg-white border text-left border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group flex flex-col">
                                            
                                            {noticia.image_url ? (
                                                <div className="w-full h-56 overflow-hidden">
                                                    <img src={noticia.image_url} alt={noticia.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-12 bg-gray-50"></div>
                                            )}

                                            <div className="p-8 flex flex-col flex-1">
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {noticia.tags && noticia.tags.slice(0,2).map((t: string) => (
                                                        <span key={t} className="bg-gray-100 text-gray-600 text-[10px] uppercase font-bold px-3 py-1 rounded-full">{t}</span>
                                                    ))}
                                                    {noticia.tags && noticia.tags.length > 2 && (
                                                        <span className="text-gray-400 text-xs font-bold px-1 py-1">+{noticia.tags.length - 2}</span>
                                                    )}
                                                </div>
                                                
                                                <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-snug group-hover:text-primary-800 transition-colors">
                                                    {noticia.title}
                                                </h3>
                                                <p className="text-gray-600 text-base leading-relaxed mb-8 line-clamp-3">
                                                    {noticia.summary}
                                                </p>

                                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                                                    <span className="text-gray-400 text-sm font-medium">{new Date(noticia.published_at).toLocaleDateString('pt-BR')}</span>
                                                    
                                                    {noticia.external_url ? (
                                                        <a href={noticia.external_url} target="_blank" rel="noopener noreferrer" className="text-secondary-600 font-bold hover:text-secondary-800 flex items-center gap-2 transition-colors outline-none group-hover:underline">
                                                            Ler externa ↗
                                                        </a>
                                                    ) : (
                                                        <Link href={`/midias/${noticia.slug}`} className="text-secondary-600 font-bold hover:text-secondary-800 flex items-center gap-2 transition-colors outline-none group-hover:underline">
                                                            Ler matéria →
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredPosts.length === 0 && (
                                        <div className="col-span-full text-center text-gray-500 py-16 bg-white border border-dashed border-gray-200 rounded-3xl">
                                            Nenhum artigo encontrado.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Lado Direito: Nuvem de Tags Sidebar */}
                        <div className="lg:col-span-4 lg:order-2 order-1">
                            <div className="sticky top-32 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold text-primary-900 mb-6">Tópicos Populares</h3>
                                
                                {!loading && allTags.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        <button 
                                            onClick={() => handleTagSelect(null)}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!selectedTag ? 'bg-primary-900 text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'}`}
                                        >
                                            Todos os Artigos
                                        </button>
                                        {allTags.map(tag => (
                                            <button 
                                                key={tag as string}
                                                onClick={() => handleTagSelect(tag as string)}
                                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedTag === tag ? 'bg-secondary-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
                                            >
                                                {tag as string}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-sm">Nenhuma tag encontrada.</p>
                                )}

                                <div className="mt-12 p-6 bg-primary-50 rounded-2xl border border-primary-100">
                                    <h4 className="font-bold text-primary-900 mb-2">Fique por dentro</h4>
                                    <p className="text-sm text-primary-800 mb-4">Acompanhe as tendências e as discussões mais recentes sobre novas formas de morar.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
