'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { supabase } from '@/lib/supabase';

export default function MidiasPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
            if (data) setPosts(data);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-background font-sans text-foreground flex flex-col relative">
            <PublicHeader />

            <main className="flex-1 bg-white">
                <div className="container mx-auto px-6 py-20 lg:py-32">

                    <div className="text-center mb-24 max-w-4xl mx-auto">
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

                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Carregando artigos...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
                            {posts.map(noticia => (
                                <div key={noticia.id} className="bg-white border text-left border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group flex flex-col">
                                    <span className="text-primary-600 font-bold text-sm tracking-wider uppercase">Artigo</span>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-4 leading-snug group-hover:text-primary-800 transition-colors">
                                        {noticia.title}
                                    </h3>
                                    <p className="text-gray-600 text-base leading-relaxed mb-8 line-clamp-4">
                                        {noticia.summary}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                        <span className="text-gray-400 text-sm font-medium">{new Date(noticia.published_at).toLocaleDateString('pt-BR')}</span>
                                        <Link href={`/midias/${noticia.slug}`} className="text-secondary-600 font-bold hover:text-secondary-800 flex items-center gap-2 transition-colors outline-none">
                                            Ler matéria inteira
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            {posts.length === 0 && (
                                <div className="col-span-full text-center text-gray-500 py-10 border border-dashed rounded-3xl">
                                    Nenhum artigo publicado ainda.
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
