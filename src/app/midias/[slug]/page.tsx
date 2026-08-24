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
        return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
    }

    if (!post) {
        return <div className="min-h-screen flex items-center justify-center">Artigo não encontrado.</div>;
    }

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = encodeURIComponent(post.title);
    const shareLink = encodeURIComponent(shareUrl);

    return (
        <div className="min-h-screen bg-background font-sans text-foreground flex flex-col relative">
            <PublicHeader />

            <main className="flex-1 bg-white">
                <div className="container mx-auto px-6 py-20 lg:py-32 max-w-4xl">
                    
                    <Link href="/midias" className="text-secondary-600 font-bold hover:underline mb-8 inline-block">
                        ← Voltar para Mídias
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold text-primary-900 tracking-tight leading-tight mb-6">
                        {post.title}
                    </h1>
                    
                    <p className="text-gray-500 mb-12 pb-8 border-b border-gray-100 flex items-center gap-4">
                        <span>{new Date(post.published_at).toLocaleDateString('pt-BR')}</span>
                        <span>•</span>
                        <span className="text-secondary-600 font-semibold">Studio Be Cohousing</span>
                    </p>

                    <div className="prose prose-lg prose-primary max-w-none text-gray-700 leading-loose mb-16 whitespace-pre-wrap">
                        {post.content}
                    </div>

                    {/* Área de Compartilhamento */}
                    <div className="border-t border-gray-200 pt-10 mt-16 text-center">
                        <h3 className="text-xl font-bold text-primary-900 mb-6">Gostou do artigo? Compartilhe:</h3>
                        
                        <div className="flex flex-wrap justify-center gap-4">
                            {/* LinkedIn */}
                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareLink}`} target="_blank" rel="noopener noreferrer" 
                               className="flex items-center gap-2 bg-[#0077b5] hover:bg-[#005582] text-white px-6 py-3 rounded-full font-bold transition-colors">
                                LinkedIn
                            </a>
                            
                            {/* Facebook */}
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`} target="_blank" rel="noopener noreferrer" 
                               className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#165fc7] text-white px-6 py-3 rounded-full font-bold transition-colors">
                                Facebook
                            </a>

                            {/* Twitter / X */}
                            <a href={`https://twitter.com/intent/tweet?url=${shareLink}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" 
                               className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-bold transition-colors">
                                X (Twitter)
                            </a>

                            {/* Copy Link / Generic Substack approach */}
                            <button onClick={() => {
                                navigator.clipboard.writeText(shareUrl);
                                alert('Link copiado para a área de transferência! Cole no seu Substack, WhatsApp ou onde desejar.');
                            }}
                               className="flex items-center gap-2 bg-[#FF6719] hover:bg-[#cc5214] text-white px-6 py-3 rounded-full font-bold transition-colors cursor-pointer">
                                Copiar Link (Substack)
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
