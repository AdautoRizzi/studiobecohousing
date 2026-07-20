'use client';
import React, { useState, useEffect } from 'react';

export default function TwelveWeekBoard({ initialPlan }: { initialPlan: any }) {
    const [plan, setPlan] = useState<any>(initialPlan);
    const [saving, setSaving] = useState(false);
    const [editingVision, setEditingVision] = useState(false);
    const [visionInput, setVisionInput] = useState(initialPlan.vision || '');

    const savePlan = async (newPlan: any) => {
        setPlan(newPlan);
        setSaving(true);
        await fetch('/api/12week-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPlan)
        });
        setSaving(false);
    };

    const handleVisionSave = async () => {
        setEditingVision(false);
        const newPlan = { ...plan, vision: visionInput };
        await savePlan(newPlan);
    };

    const toggleTask = async (weekNum: number, taskId: string) => {
        const newPlan = { ...plan };
        if (!newPlan.weeks || !newPlan.weeks[weekNum] || !newPlan.weeks[weekNum].tasks) return;
        const task = newPlan.weeks[weekNum].tasks.find((t: any) => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            await savePlan(newPlan);
        }
    };

    const addTask = async (weekNum: number, desc: string) => {
        if (!desc.trim()) return;
        const newPlan = { ...plan };
        if (!newPlan.weeks) newPlan.weeks = {};
        if (!newPlan.weeks[weekNum]) newPlan.weeks[weekNum] = { weekNumber: weekNum, tasks: [] };
        if (!newPlan.weeks[weekNum].tasks) newPlan.weeks[weekNum].tasks = [];
        newPlan.weeks[weekNum].tasks.push({
            id: 'task_' + Date.now(),
            description: desc,
            completed: false
        });
        await savePlan(newPlan);
    };

    
    const updateStartDate = async (weekNum: number, date: string) => {
        const newPlan = { ...plan };
        if (!newPlan.weeks) newPlan.weeks = {};
        if (!newPlan.weeks[weekNum]) newPlan.weeks[weekNum] = { weekNumber: weekNum, tasks: [] };
        newPlan.weeks[weekNum].startDate = date;
        await savePlan(newPlan);
    };

    const removeTask = async (weekNum: number, taskId: string) => {
        if (!confirm("Remover esta tática?")) return;
        const newPlan = { ...plan };
        if (!newPlan.weeks || !newPlan.weeks[weekNum] || !newPlan.weeks[weekNum].tasks) return;
        newPlan.weeks[weekNum].tasks = newPlan.weeks[weekNum].tasks.filter((t: any) => t.id !== taskId);
        await savePlan(newPlan);
    };

    const calculateScore = (tasks: any[]) => {
        if (!tasks || tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.completed).length;
        return Math.round((completed / tasks.length) * 100);
    };

    // Converter objeto weeks em array 1..12
    const weeksArray = [];
    for (let i = 1; i <= 12; i++) {
        weeksArray.push((plan && plan.weeks && plan.weeks[i]) || { weekNumber: i, tasks: [] });
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3 mb-4">
                        <span className="text-4xl">🎯</span> Pendências do Projeto (12 Week Year)
                    </h1>
                    
                    <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Visão Principal (O Alvo das 12 Semanas)</h2>
                        {editingVision ? (
                            <div className="flex gap-2 mt-2">
                                <input 
                                    type="text" 
                                    value={visionInput} 
                                    onChange={e => setVisionInput(e.target.value)} 
                                    className="flex-1 bg-[#020617] border border-primary-500 rounded-lg px-4 py-2 text-slate-50 font-bold focus:outline-none"
                                    autoFocus
                                    onKeyDown={e => e.key === 'Enter' && handleVisionSave()}
                                />
                                <button onClick={handleVisionSave} className="bg-primary-600 text-white px-4 rounded-lg font-bold hover:bg-primary-700">Salvar</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setEditingVision(true)}>
                                <div className="text-2xl font-black text-slate-50">{plan.vision}</div>
                                <svg className="w-5 h-5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </div>
                        )}
                    </div>
                </div>
                {saving && <div className="text-xs text-primary-400 font-bold animate-pulse mt-2">Salvando na nuvem...</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {weeksArray.map(week => {
                    const score = calculateScore(week.tasks);
                    const isSuccess = score >= 85;
                    return (
                        <div key={week.weekNumber} className="bg-[#0f172a] rounded-xl border border-slate-800 flex flex-col h-[400px]">
                            
                            {/* Header do Card */}
                            <div className="p-4 border-b border-slate-800 bg-slate-900/50 rounded-t-xl flex justify-between items-center relative">
                                <div>
                                    <h3 className="font-bold text-slate-200">Semana {week.weekNumber}</h3>
                                    <div className="mt-1">
                                        <input 
                                            type="date" 
                                            value={week.startDate || ''}
                                            onChange={(e) => updateStartDate(week.weekNumber, e.target.value)}
                                            className="bg-transparent border-none text-[10px] text-slate-400 focus:ring-0 p-0 cursor-pointer outline-none uppercase font-bold"
                                        />
                                    </div>
                                </div>
                                <div className={`text-xs font-bold px-2 py-1 rounded-full ${week.tasks.length === 0 ? 'bg-slate-800 text-slate-500' : isSuccess ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>

                                    {score}%
                                </div>
                            </div>
                            
                            {/* Lista de Táticas */}
                            <div className="p-3 overflow-y-auto flex-1 space-y-2 custom-scrollbar">
                                {week.tasks.map((task: any) => (
                                    <div key={task.id} className={`group flex items-start gap-2 p-2 rounded-lg border transition-colors ${task.completed ? 'bg-green-900/10 border-green-900/30 text-slate-500' : 'bg-[#020617] border-slate-800 text-slate-300'}`}>
                                        <input 
                                            type="checkbox" 
                                            checked={task.completed} 
                                            onChange={() => toggleTask(week.weekNumber, task.id)}
                                            className="mt-1 w-4 h-4 rounded bg-slate-800 border-slate-600 text-green-500 focus:ring-green-500 focus:ring-offset-slate-900 cursor-pointer"
                                        />
                                        <span className={`text-sm flex-1 ${task.completed ? 'line-through' : ''}`}>{task.description}</span>
                                        <button onClick={() => removeTask(week.weekNumber, task.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                                {week.tasks.length === 0 && (
                                    <div className="text-center p-4 text-xs text-slate-500 italic">Nenhuma tática.</div>
                                )}
                            </div>

                            {/* Add Task Input */}
                            <div className="p-3 border-t border-slate-800 bg-slate-900/50 rounded-b-xl">
                                <form onSubmit={(e: any) => {
                                    e.preventDefault();
                                    const input = e.target.elements.taskDesc;
                                    addTask(week.weekNumber, input.value);
                                    input.value = '';
                                }}>
                                    <input 
                                        type="text" 
                                        name="taskDesc"
                                        placeholder="+ Adicionar Tática (Enter)" 
                                        className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                        autoComplete="off"
                                    />
                                </form>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
