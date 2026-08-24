'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form fields
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [externalUrl, setExternalUrl] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [authorBio, setAuthorBio] = useState('');
    const [authorSocialLink, setAuthorSocialLink] = useState('');
    
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
        
        // Convert comma string to array
        const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t !== '');

        const postData = { 
            title, 
            slug, 
            summary, 
            content, 
            external_url: externalUrl || null,
            tags: tagsArray,
            image_url: imageUrl || null,
            author_name: authorName || null,
            author_bio: authorBio || null,
            author_social_link: authorSocialLink || null
        };

        if (editingId) {
            await supabase.from('blog_posts').update(postData).eq('id', editingId);
        } else {
            await supabase.from('blog_posts').insert(postData);
        }
        
        clearForm();
        loadPosts();
    };

    const clearForm = () => {
        setTitle('');
        setSlug('');
        setExternalUrl('');
        setSummary('');
        setContent('');
        setTags('');
        setImageUrl('');
        setAuthorName('');
        setAuthorBio('');
        setAuthorSocialLink('');
        setEditingId(null);
    };

    const editPost = (post: any) => {
        setEditingId(post.id);
        setTitle(post.title);
        setSlug(post.slug);
        setExternalUrl(post.external_url || '');
        setSummary(post.summary || '');
        setContent(post.content || '');
        setTags(post.tags ? post.tags.join(', ') : '');
        setImageUrl(post.image_url || '');
        setAuthorName(post.author_name || '');
        setAuthorBio(post.author_bio || '');
        setAuthorSocialLink(post.author_social_link || '');
        window.scrollTo(0, 0);
    };

    const deletePost = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir?')) {
            await supabase.from('blog_posts').delete().eq('id', id);
            loadPosts();
        }
    };

    return (
        <div className="p-8 bg-[#020617] min-h-screen text-slate-200 font-sans">
            <h1 className="text-3xl font-bold text-purple-400 mb-8">Gerenciador do Blog</h1>

            <form onSubmit={savePost} className="bg-[#0f172a] p-6 rounded-xl border border-slate-700 mb-10 shadow-lg">
                <h2 className="text-xl font-bold mb-6 text-white">{editingId ? 'Editar Postagem' : 'Nova Postagem'}</h2>
                
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Link Externo (Opcional - Redirecionar para fora)</label>
                        <input value={externalUrl} onChange={e => setExternalUrl(e.target.value)} placeholder="https://..." className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Tags (Separadas por vírgula)</label>
                        <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Sustentabilidade, Entrevista, Mercado" className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none" />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-slate-400 mb-1">Imagem de Capa (Link da imagem)</label>
                    <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none" />
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-slate-400 mb-1">Resumo (Aparece nos cartões)</label>
                    <textarea required value={summary} onChange={e => setSummary(e.target.value)} className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none h-20" />
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm text-slate-400">Conteúdo Completo (Texto da matéria)</label>
                    </div>
                    <div className="bg-[#1e293b] text-xs text-slate-300 p-3 rounded mb-2 border border-slate-700">
                        <strong>Dica de formatação:</strong><br/>
                        Para colocar uma IMAGEM no meio do texto, pule uma linha e cole: <code className="text-purple-400">[IMAGEM: https://site.com/foto.jpg]</code><br/>
                        Para colocar um VÍDEO no meio do texto, pule uma linha e cole: <code className="text-purple-400">[VIDEO: https://youtube.com/watch?v=...]</code>
                    </div>
                    <textarea required value={content} onChange={e => setContent(e.target.value)} className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none h-64" />
                </div>

                <div className="border-t border-slate-700 pt-6 mb-6">
                    <h3 className="text-lg font-bold mb-4 text-white">Dados do Autor</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Nome</label>
                            <input value={authorName} onChange={e => setAuthorName(e.target.value)} placeholder="Ex: Claudia" className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-slate-400 mb-1">Link da Rede Social (LinkedIn/Insta)</label>
                            <input value={authorSocialLink} onChange={e => setAuthorSocialLink(e.target.value)} placeholder="https://..." className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Mini Biografia</label>
                        <textarea value={authorBio} onChange={e => setAuthorBio(e.target.value)} placeholder="Fundadora do Studio Be..." className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none h-16" />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded font-bold transition-colors">
                        {editingId ? 'Atualizar Postagem' : 'Publicar'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={clearForm} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded transition-colors">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <div>
                <h2 className="text-2xl font-bold mb-6 text-white">Postagens Publicadas</h2>
                {loading ? <p className="text-slate-400">Carregando...</p> : (
                    <div className="grid grid-cols-1 gap-4">
                        {posts.map(p => (
                            <div key={p.id} className="bg-[#0f172a] p-5 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-lg text-white">{p.title}</h3>
                                    <p className="text-slate-400 text-sm mt-1">
                                        <span className="bg-slate-800 px-2 py-0.5 rounded text-xs mr-2">{p.external_url ? 'Link Externo' : 'Artigo Interno'}</span>
                                        /{p.slug} • Publicado em {new Date(p.published_at).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => editPost(p)} className="bg-blue-900/50 hover:bg-blue-800 text-blue-200 px-4 py-2 rounded text-sm transition-colors border border-blue-900/50">Editar</button>
                                    <button onClick={() => deletePost(p.id)} className="bg-red-900/50 hover:bg-red-800 text-red-200 px-4 py-2 rounded text-sm transition-colors border border-red-900/50">Excluir</button>
                                </div>
                            </div>
                        ))}
                        {posts.length === 0 && <p className="text-slate-500 italic">Nenhuma postagem ainda.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
