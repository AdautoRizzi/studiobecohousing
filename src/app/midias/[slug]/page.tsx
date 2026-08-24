'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function BlogPostPage() {
    const params = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (params.slug) {
                const { data } = await supabase.from('blog_posts').select('*').eq('slug', params.slug).single();
                setPost(data);
            }
            setLoading(false);
        };
        fetchPost();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Carregando artigo...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Artigo não encontrado</h1>
                <Link href="/midias" className="text-secondary-600 font-bold hover:underline">Voltar para Mídias</Link>
            </div>
        );
    }

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = encodeURIComponent(post.title);
    const shareLink = encodeURIComponent(shareUrl);

    // Renderizador Inteligente de Texto (Shortcodes)
    const renderContent = (text: string) => {
        if (!text) return null;
        
        return text.split('\n').map((line, i) => {
            // Verifica Imagem
            const imgMatch = line.match(/\[IMAGEM:\s*(.+)\]/i);
            if (imgMatch) {
                return (
                    <figure key={i} className="my-12">
                        <img src={imgMatch[1].trim()} alt="Ilustração do artigo" className="w-full h-auto rounded-2xl shadow-lg" />
                    </figure>
                );
            }
            
            // Verifica Vídeo
            const vidMatch = line.match(/\[VIDEO:\s*(.+)\]/i);
            if (vidMatch) {
                let url = vidMatch[1].trim();
                if (url.includes('youtube.com/watch?v=')) {
                    url = url.replace('youtube.com/watch?v=', 'youtube.com/embed/');
                    url = url.split('&')[0];
                } else if (url.includes('youtu.be/')) {
                    url = url.replace('youtu.be/', 'youtube.com/embed/');
                }
                return (
                    <div key={i} className="relative w-full aspect-video my-12 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                        <iframe src={url} className="absolute top-0 left-0 w-full h-full" allowFullScreen></iframe>
                    </div>
                );
            }
            
            // Parágrafo Normal
            if (line.trim() === '') return <br key={i} />;
            return <p key={i} className="mb-6 text-gray-700 leading-relaxed text-lg">{line}</p>;
        });
    };

    return (
        <div className="min-h-screen bg-background font-sans text-foreground flex flex-col relative">
            <PublicHeader />

            <main className="flex-1 bg-white">
                <article className="container mx-auto px-6 py-16 lg:py-24 max-w-4xl">
                    
                    <Link href="/midias" className="inline-flex items-center gap-2 text-secondary-600 font-bold hover:text-secondary-800 transition-colors mb-12">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Voltar para Mídias
                    </Link>

                    {/* Cabeçalho do Artigo */}
                    <header className="mb-12">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags && post.tags.map((t: string) => (
                                <span key={t} className="bg-primary-50 text-primary-800 text-sm font-bold px-4 py-1.5 rounded-full border border-primary-100">{t}</span>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 tracking-tight leading-tight mb-8">
                            {post.title}
                        </h1>
                        
                        <div className="flex items-center gap-4 text-gray-500 border-b border-gray-100 pb-8">
                            <span className="font-medium">{new Date(post.published_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span>•</span>
                            <span className="text-secondary-600 font-bold">{post.author_name || 'Studio Be Cohousing'}</span>
                        </div>
                    </header>

                    {/* Imagem de Capa */}
                    {post.image_url && (
                        <figure className="mb-16 -mx-6 md:mx-0">
                            <img src={post.image_url} alt={post.title} className="w-full h-auto md:rounded-3xl shadow-xl object-cover max-h-[600px]" />
                        </figure>
                    )}

                    {/* Conteúdo Renderizado */}
                    <div className="prose prose-lg prose-primary max-w-none mb-20">
                        {renderContent(post.content)}
                    </div>

                    {/* Caixa do Autor */}
                    {post.author_name && (
                        <div className="bg-gray-50 p-8 md:p-10 rounded-[2.5rem] mt-16 mb-12 flex flex-col md:flex-row items-center gap-8 border border-gray-200 shadow-inner">
                            <div className="w-24 h-24 bg-primary-900 text-white rounded-full flex items-center justify-center text-4xl font-bold shrink-0 shadow-md">
                                {post.author_name.charAt(0)}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{post.author_name}</h3>
                                <p className="text-gray-600 leading-relaxed">{post.author_bio}</p>
                            </div>
                            {post.author_social_link && (
                                <a href={post.author_social_link} target="_blank" rel="noopener noreferrer" className="bg-secondary-600 text-white px-8 py-4 rounded-full font-bold hover:bg-secondary-700 hover:scale-105 transition-all shrink-0 whitespace-nowrap shadow-lg">
                                    Seguir Autor
                                </a>
                            )}
                        </div>
                    )}

                    {/* Área de Compartilhamento */}
                    <div className="border-t border-gray-100 pt-12 text-center">
                        <h3 className="text-xl font-bold text-primary-900 mb-8">Gostou do artigo? Compartilhe e espalhe essa ideia:</h3>
                        
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareLink}`} target="_blank" rel="noopener noreferrer" 
                               className="flex items-center gap-2 bg-[#0077b5] hover:bg-[#005582] text-white px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1 shadow-md">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                LinkedIn
                            </a>
                            
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`} target="_blank" rel="noopener noreferrer" 
                               className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#165fc7] text-white px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1 shadow-md">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                                Facebook
                            </a>

                            <a href={`https://twitter.com/intent/tweet?url=${shareLink}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" 
                               className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1 shadow-md">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                                X (Twitter)
                            </a>

                            <button onClick={() => {
                                navigator.clipboard.writeText(shareUrl);
                                alert('Link copiado! Você pode colar no seu Substack, WhatsApp ou e-mail.');
                            }}
                               className="flex items-center gap-2 bg-[#FF6719] hover:bg-[#cc5214] text-white px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1 shadow-md cursor-pointer">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>
                                Copiar Link (Substack)
                            </button>
                        </div>
                    </div>

                </article>
            </main>

            <PublicFooter />
        </div>
    );
}
