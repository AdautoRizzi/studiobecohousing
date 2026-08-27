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
                            {post.author_avatar_url ? (
                                <div className="w-24 h-24 shrink-0 shadow-md rounded-full overflow-hidden border-4 border-white">
                                    <img src={post.author_avatar_url} alt={post.author_name} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-24 h-24 bg-primary-900 text-white rounded-full flex items-center justify-center text-4xl font-bold shrink-0 shadow-md">
                                    {post.author_name.charAt(0)}
                                </div>
                            )}
                            
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
                                LinkedIn
                            </a>
                            
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`} target="_blank" rel="noopener noreferrer" 
                               className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#165fc7] text-white px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1 shadow-md">
                                Facebook
                            </a>

                            <a href={`https://twitter.com/intent/tweet?url=${shareLink}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" 
                               className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1 shadow-md">
                                X (Twitter)
                            </a>

                            <button onClick={() => {
                                navigator.clipboard.writeText(shareUrl);
                                alert('Link copiado! Você pode colar no seu Substack, WhatsApp ou e-mail.');
                            }}
                               className="flex items-center gap-2 bg-[#FF6719] hover:bg-[#cc5214] text-white px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1 shadow-md cursor-pointer">
                                Copiar Link
                            </button>
                        </div>
                    </div>

                </article>
            </main>

            <PublicFooter />
        </div>
    );
}
