'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { createTemplateAction, updateTemplateAction, deleteTemplateAction } from '@/app/actions';

interface Template {
    id: number;
    title: string;
    content: string;
}

export default function TemplateManagerClient({ initialTemplates }: { initialTemplates: Template[] }) {
    const [templates, setTemplates] = useState<Template[]>(initialTemplates);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEdit = (t: Template) => {
        setEditingId(t.id);
        setTitle(t.title);
        setContent(t.content);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setTitle('');
        setContent('');
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este template?')) return;
        setLoading(true);
        const res = await deleteTemplateAction(id);
        if (res.success) {
            setTemplates(templates.filter(t => t.id !== id));
        } else {
            alert('Erro ao excluir template: ' + res.error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        if (editingId) {
            const res = await updateTemplateAction(editingId, title, content);
            if (res.success) {
                setTemplates(templates.map(t => t.id === editingId ? { ...t, title, content } : t));
                handleCancelEdit();
            } else {
                alert('Erro ao atualizar template: ' + res.error);
            }
        } else {
            const res = await createTemplateAction(title, content);
            if (res.success) {
                // To display it immediately without full page reload, we fake the ID 
                // However since revalidatePath is called in server action, a router.refresh() or page reload works better.
                // We'll just force a hard reload for simplicity to get true ID from DB.
                window.location.reload();
            } else {
                alert('Erro ao criar template: ' + res.error);
            }
        }
        
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 sticky top-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        {editingId ? 'Editar Template' : 'Novo Template'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Título</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Boas-vindas" 
                                className="w-full h-10 px-3 rounded-lg border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Mensagem</label>
                            <textarea 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={6} 
                                placeholder="Use {nome} para personalizar automaticamente." 
                                className="w-full p-3 rounded-lg border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm" 
                                required
                            ></textarea>
                        </div>
                        <div className="flex gap-2">
                            {editingId && (
                                <Button type="button" variant="outline" onClick={handleCancelEdit} className="flex-1 h-10 rounded-lg">Cancelar</Button>
                            )}
                            <Button type="submit" disabled={loading} className="flex-1 h-10 rounded-lg">
                                {loading ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Lista de Templates */}
            <div className="lg:col-span-2 space-y-4">
                {templates.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-gray-300 text-gray-500">
                        Nenhum template cadastrado ainda.
                    </div>
                ) : (
                    templates.map(t => (
                        <div key={t.id} className={`bg-white p-6 rounded-3xl shadow-sm border transition-colors ${editingId === t.id ? 'border-primary-500 bg-primary-50/50' : 'border-gray-100 hover:border-primary-200'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900">{t.title}</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(t)} className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full transition-colors">Editar</button>
                                    <button onClick={() => handleDelete(t.id)} className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded-full transition-colors">Excluir</button>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                                "{t.content}"
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
