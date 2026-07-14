'use client';
import React, { useState, useEffect } from 'react';

type GlobalTask = { id: string; title: string; column_id: 'todo' | 'doing' | 'done'; created_at: string; };

export default function GlobalTasksBoard() {
    const [tasks, setTasks] = useState<GlobalTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        fetch('/api/tasks').then(r => r.json()).then(data => {
            setTasks(data || []);
            setLoading(false);
        });
    }, []);

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        
        const newTask: GlobalTask = {
            id: Date.now().toString(),
            title: newTaskTitle,
            column_id: 'todo',
            created_at: new Date().toISOString()
        };
        
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
        
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add', task: newTask })
        });
    };

    const moveTask = async (taskId: string, newCol: 'todo'|'doing'|'done') => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, column_id: newCol } : t));
        
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'move', taskId, columnId: newCol })
        });
    };
    
    const deleteTask = async (taskId: string) => {
        setTasks(tasks.filter(t => t.id !== taskId));
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', taskId })
        });
    };

    const columns = [
        { id: 'todo', name: 'A Fazer (Backlog)' },
        { id: 'doing', name: 'Fazendo (Em Progresso)' },
        { id: 'done', name: 'Concluído' }
    ];

    if (loading) return <div className="p-8 text-white">Carregando tarefas...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
                    <span className="text-4xl">📋</span> Gestor de Tarefas Globais
                </h1>
                <p className="text-slate-400 mt-2">Controle as pendências gerais da Studio Be que não estão atreladas a um Lead específico.</p>
            </div>

            <form onSubmit={addTask} className="mb-8 flex gap-3">
                <input 
                    type="text" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Ex: Definir nova campanha de anúncios no Google..." 
                    className="flex-1 bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    Adicionar Tarefa
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {columns.map(col => (
                    <div key={col.id} className="bg-[#0f172a] rounded-xl border border-slate-800 flex flex-col min-h-[500px]">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/50 rounded-t-xl">
                            <h3 className="font-bold text-slate-200">{col.name}</h3>
                            <div className="text-xs text-slate-500 mt-1">{tasks.filter(t => t.column_id === col.id).length} tarefas</div>
                        </div>
                        <div className="p-4 flex-1 space-y-3">
                            {tasks.filter(t => t.column_id === col.id).map(task => (
                                <div key={task.id} className="bg-[#1e293b] p-4 rounded-lg border border-slate-700 group relative">
                                    <p className="text-slate-200 text-sm font-medium mb-4">{task.title}</p>
                                    
                                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-700/50">
                                        <div className="flex gap-2">
                                            {col.id !== 'todo' && <button onClick={() => moveTask(task.id, 'todo')} className="text-[10px] bg-slate-800 text-slate-400 hover:text-white px-2 py-1 rounded">← Voltar</button>}
                                            {col.id === 'todo' && <button onClick={() => moveTask(task.id, 'doing')} className="text-[10px] bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 px-2 py-1 rounded">Iniciar →</button>}
                                            {col.id === 'doing' && <button onClick={() => moveTask(task.id, 'done')} className="text-[10px] bg-green-600/20 text-green-400 hover:bg-green-600/40 px-2 py-1 rounded">Concluir ✓</button>}
                                        </div>
                                        <button onClick={() => deleteTask(task.id)} className="text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Excluir">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {tasks.filter(t => t.column_id === col.id).length === 0 && (
                                <div className="text-center p-4 text-xs text-slate-500 italic border border-dashed border-slate-700 rounded-lg">Arraste para cá (Vazio)</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}