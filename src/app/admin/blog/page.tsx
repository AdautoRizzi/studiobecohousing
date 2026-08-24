'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [externalUrl, setExternalUrl] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
        if (!error && data) {
            setPosts(data);
        }
        setLoading(false);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        if (!editingId) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    };

    const savePost = async (e: React.FormEvent) => {
        e.preventDefault();
        const postData = { title, slug, summary, content, external_url: externalUrl || null };
        if (editingId) {
            await supabase.from('blog_posts').update(postData).eq('id', editingId);
        } else {
            await supabase.from('blog_posts').insert(postData);
        }
        setTitle('');
        setSlug('');
        setExternalUrl('');
        setSummary('');
        setContent('');
        setEditingId(null);
        loadPosts();
    };

    const editPost = (post: any) => {
        setEditingId(post.id);
        setTitle(post.title);
        setSlug(post.slug);
        setExternalUrl(post.external_url || '');
        setSummary(post.summary);
        setContent(post.content);
        window.scrollTo(0, 0);
    };

    const deletePost = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir?')) {
            await supabase.from('blog_posts').delete().eq('id', id);
            loadPosts();
        }
    };

    return (
        <div className="p-8 bg-[#020617] min-h-screen text-slate-200">
            <h1 className="text-3xl font-bold text-purple-400 mb-8">Gerenciador do Blog</h1>

            <form onSubmit={savePost} className="bg-[#0f172a] p-6 rounded-xl border border-slate-700 mb-10 shadow-lg">
                <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Postagem' : 'Nova Postagem'}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Título</label>
                        <input required value={title} onChange={handleTitleChange} className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Link (Slug)</label>
                        <input required value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none" />
                    </div>
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm text-slate-400 mb-1">Link Externo (Opcional - Ex: link do Jornal A Tribuna)</label>
                    <input value={externalUrl} onChange={e => setExternalUrl(e.target.value)} placeholder="https://..." className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none" />
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-slate-400 mb-1">Resumo (Para a página de mídias)</label>
                    <textarea required value={summary} onChange={e => setSummary(e.target.value)} className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none h-20" />
                </div>

                <div className="mb-6">
                    <label className="block text-sm text-slate-400 mb-1">Conteúdo Completo (Texto)</label>
                    <textarea required value={content} onChange={e => setContent(e.target.value)} className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none h-64" />
                </div>

                <div className="flex gap-4">
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-bold">
                        {editingId ? 'Atualizar Postagem' : 'Publicar'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setTitle(''); setSlug(''); setExternalUrl(''); setSummary(''); setContent(''); }} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <div>
                <h2 className="text-xl font-bold mb-4">Postagens Publicadas</h2>
                {loading ? <p>Carregando...</p> : (
                    <div className="grid grid-cols-1 gap-4">
                        {posts.map(p => (
                            <div key={p.id} className="bg-[#0f172a] p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-white">{p.title}</h3>
                                    <p className="text-slate-400 text-sm">/{p.slug} • Publicado em {new Date(p.published_at).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => editPost(p)} className="bg-blue-900 hover:bg-blue-800 text-blue-200 px-3 py-1 rounded text-sm">Editar</button>
                                    <button onClick={() => deletePost(p.id)} className="bg-red-900 hover:bg-red-800 text-red-200 px-3 py-1 rounded text-sm">Excluir</button>
                                </div>
                            </div>
                        ))}
                        {posts.length === 0 && <p className="text-slate-500">Nenhuma postagem ainda.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
