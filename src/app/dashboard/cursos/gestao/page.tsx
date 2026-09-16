'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Module {
    id: string;
    title: string;
    description: string;
    order_index: number;
}

interface Lesson {
    id: string;
    module_id: string;
    title: string;
    video_url: string;
    text_content?: string;
    order_index: number;
}

export default function GestaoCursosPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);

    const [newModule, setNewModule] = useState({ title: '', description: '' });
    const [newLesson, setNewLesson] = useState({ module_id: '', title: '', video_url: '', text_content: '' });
    
    // Modal states
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

    
    const handleDeleteModule = async (id: string) => {
        if(!confirm('Tem certeza que deseja apagar este módulo e todas as suas aulas?')) return;
        await fetch(`/api/cursos/modules/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const handleDeleteLesson = async (id: string) => {
        if(!confirm('Tem certeza que deseja apagar esta aula?')) return;
        await fetch(`/api/cursos/lessons/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const handleEditModule = (mod: Module) => {
        setEditingModule(mod);
    };

    const saveModuleEdit = async () => {
        if(!editingModule) return;
        await fetch(`/api/cursos/modules/${editingModule.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: editingModule.title, description: editingModule.description || '' })
        });
        setEditingModule(null);
        fetchData();
    };

    const handleEditLesson = (les: Lesson) => {
        setEditingLesson(les);
    };

    const saveLessonEdit = async () => {
        if(!editingLesson) return;
        await fetch(`/api/cursos/lessons/${editingLesson.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: editingLesson.title, video_url: editingLesson.video_url || '', text_content: editingLesson.text_content || '' })
        });
        setEditingLesson(null);
        fetchData();
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const resMod = await fetch('/api/cursos/modules');
            const dataMod = await resMod.json();
            if (dataMod.modules) setModules(dataMod.modules);

            const resLes = await fetch('/api/cursos/lessons');
            const dataLes = await resLes.json();
            if (dataLes.lessons) setLessons(dataLes.lessons);
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateModule = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newModule.title) return;
        
        const res = await fetch('/api/cursos/modules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newModule, order_index: modules.length + 1 })
        });
        
        if(res.ok) {
            setNewModule({ title: '', description: '' });
            fetchData();
        } else {
            alert('Erro ao criar módulo');
        }
    };

    const handleCreateLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newLesson.title || !newLesson.module_id) return;
        
        const moduleLessons = lessons.filter(l => l.module_id === newLesson.module_id);
        
        const res = await fetch('/api/cursos/lessons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newLesson, order_index: moduleLessons.length + 1 })
        });
        
        if(res.ok) {
            setNewLesson({ ...newLesson, title: '', video_url: '', text_content: '' });
            fetchData();
        } else {
            alert('Erro ao criar aula');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary-900">Gestão de Treinamentos</h1>
                    <p className="text-gray-600 mt-2">Painel do Facilitador: Crie e organize módulos, aulas e testes.</p>
                </div>
                <Link href="/dashboard/cursos" className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">
                    Ver Visão do Aluno
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna Esquerda: Formulários de Criação */}
                <div className="space-y-6">
                    {/* Criar Módulo */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-100">
                        <h2 className="text-xl font-bold text-primary-900 mb-4">Novo Módulo</h2>
                        <form onSubmit={handleCreateModule} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Módulo</label>
                                <input type="text" required value={newModule.title} onChange={e => setNewModule({...newModule, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" placeholder="Ex: Módulo 1 - Introdução" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea rows={3} value={newModule.description} onChange={e => setNewModule({...newModule, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" placeholder="O que o aluno vai aprender?"></textarea>
                            </div>
                            <button type="submit" className="w-full py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors">Criar Módulo</button>
                        </form>
                    </div>

                    {/* Criar Aula */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-100">
                        <h2 className="text-xl font-bold text-primary-900 mb-4">Nova Aula</h2>
                        <form onSubmit={handleCreateLesson} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Módulo Pai</label>
                                <select required value={newLesson.module_id} onChange={e => setNewLesson({...newLesson, module_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500">
                                    <option value="" disabled>Selecione um módulo...</option>
                                    {modules.map(m => (
                                        <option key={m.id} value={m.id}>{m.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título da Aula</label>
                                <input type="text" required value={newLesson.title} onChange={e => setNewLesson({...newLesson, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" placeholder="Ex: Aula 1 - Bem-vindo" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL do Vídeo (Vimeo/YouTube)</label>
                                <input type="text" value={newLesson.video_url} onChange={e => setNewLesson({...newLesson, video_url: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição / Texto de Apoio</label>
                                <textarea rows={2} value={newLesson.text_content} onChange={e => setNewLesson({...newLesson, text_content: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" placeholder="Resumo da aula..."></textarea>
                            </div>
                            <button type="submit" className="w-full py-2 bg-secondary-600 text-white font-bold rounded-lg hover:bg-secondary-700 transition-colors">Criar Aula</button>
                        </form>
                    </div>
                </div>

                {/* Coluna Direita: Lista de Módulos e Aulas */}
                <div className="col-span-1 lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="text-center text-gray-500 p-10">Carregando conteúdo...</div>
                    ) : modules.length === 0 ? (
                        <div className="bg-white p-10 text-center rounded-2xl border border-dashed border-gray-300 text-gray-500">
                            Nenhum módulo criado ainda. Comece criando o seu primeiro módulo ao lado.
                        </div>
                    ) : (
                        modules.sort((a,b) => a.order_index - b.order_index).map(module => (
                            <div key={module.id} className="bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden">
                                <div className="bg-secondary-50 px-6 py-4 border-b border-secondary-100 flex justify-between items-start">
                                    <div className="flex-1 min-w-0 pr-6">
                                        <h3 className="text-lg font-bold text-primary-900 break-words">{module.title}</h3>
                                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap leading-relaxed">{module.description}</p>
                                    </div>
                                    <div className="flex gap-3 flex-shrink-0 mt-1">
                                        <button onClick={() => handleEditModule(module)} className="text-sm text-gray-500 hover:text-primary-600">Editar</button>
                                        <button onClick={() => handleDeleteModule(module.id)} className="text-sm text-red-400 hover:text-red-600">Excluir</button>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {lessons.filter(l => l.module_id === module.id).length === 0 ? (
                                        <div className="px-6 py-4 text-sm text-gray-400 italic">Sem aulas cadastradas neste módulo.</div>
                                    ) : (
                                        lessons.filter(l => l.module_id === module.id).sort((a,b) => a.order_index - b.order_index).map(lesson => (
                                            <div key={lesson.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-700 font-bold rounded-full text-xs">
                                                        {lesson.order_index}
                                                    </span>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{lesson.title}</p>
                                                        {lesson.video_url && <a href={lesson.video_url} target="_blank" className="text-xs text-blue-500 hover:underline">Ver Vdeo</a>}
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleEditLesson(lesson)} className="text-xs text-gray-500 hover:text-primary-600">Editar</button>
                                                    <button onClick={() => handleDeleteLesson(lesson.id)} className="text-xs text-red-400 hover:text-red-600">Excluir</button>
                                                    <button className="text-xs text-secondary-600 font-medium hover:underline">Quiz</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Editar Módulo */}
            {editingModule && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl">
                        <h3 className="text-xl font-bold text-primary-900 mb-4">Editar Módulo</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input type="text" value={editingModule.title} onChange={e => setEditingModule({...editingModule, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea rows={8} value={editingModule.description} onChange={e => setEditingModule({...editingModule, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={() => setEditingModule(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancelar</button>
                                <button onClick={saveModuleEdit} className="px-4 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors">Salvar Alterações</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Editar Aula */}
            {editingLesson && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
                        <h3 className="text-xl font-bold text-primary-900 mb-4">Editar Aula</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input type="text" value={editingLesson.title} onChange={e => setEditingLesson({...editingLesson, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL do Vídeo</label>
                                <input type="text" value={editingLesson.video_url} onChange={e => setEditingLesson({...editingLesson, video_url: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição / Texto de Apoio</label>
                                <textarea rows={6} value={editingLesson.text_content || ''} onChange={e => setEditingLesson({...editingLesson, text_content: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" placeholder="Resumo da aula..."></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={() => setEditingLesson(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancelar</button>
                                <button onClick={saveLessonEdit} className="px-4 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors">Salvar Alterações</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
