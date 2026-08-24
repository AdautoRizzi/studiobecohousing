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
        const fetchPosts = async () => {
            const { data } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
            if (data) setPosts(data);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    // Extrair todas as tags únicas
    const allTags = Array.from(new Set(posts.flatMap(p => p.tags || []))).sort();

    // Filtrar posts
    const filteredPosts = selectedTag ? posts.filter(p => p.tags && p.tags.includes(selectedTag)) : posts;

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

                    {/* Nuvem de Tags */}
                    {!loading && allTags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3 mb-16">
                            <button 
                                onClick={() => setSelectedTag(null)}
                                className={`px-6 py-2 rounded-full font-semibold transition-all ${!selectedTag ? 'bg-primary-900 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}
                            >
                                Todos
                            </button>
                            {allTags.map(tag => (
                                <button 
                                    key={tag}
                                    onClick={() => setSelectedTag(tag as string)}
                                    className={`px-6 py-2 rounded-full font-semibold transition-all ${selectedTag === tag ? 'bg-secondary-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                                >
                                    {tag as string}
                                </button>
                            ))}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                            <p>Carregando artigos...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
                            {filteredPosts.map(noticia => (
                                <div key={noticia.id} className="bg-white border text-left border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group flex flex-col">
                                    
                                    {noticia.image_url && (
                                        <div className="w-full h-56 overflow-hidden">
                                            <img src={noticia.image_url} alt={noticia.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    )}

                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {noticia.tags && noticia.tags.map((t: string) => (
                                                <span key={t} className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">{t}</span>
                                            ))}
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-snug group-hover:text-primary-800 transition-colors">
                                            {noticia.title}
                                        </h3>
                                        <p className="text-gray-600 text-base leading-relaxed mb-8 line-clamp-4">
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
                                    Nenhum artigo encontrado para esta categoria.
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
