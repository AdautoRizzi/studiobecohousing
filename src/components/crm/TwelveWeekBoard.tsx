'use client';
import React, { useState } from 'react';

export default function TwelveWeekBoard({ initialPlan }: { initialPlan: any }) {
    const [plan, setPlan] = useState<any>(initialPlan);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'vision' | 'kanban' | 'analytics'>('kanban');
    const [editingVision, setEditingVision] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editTaskDesc, setEditTaskDesc] = useState('');
    const [editTaskObj, setEditTaskObj] = useState<string | undefined>(undefined);
    const [editTaskTargetSprint, setEditTaskTargetSprint] = useState<number>(1);
    const [visionInput, setVisionInput] = useState(initialPlan.vision3Years || '');
    
    // Fallbacks para garantir que a estrutura exista
    if (!plan.objectives) plan.objectives = [];
    if (!plan.sprints) plan.sprints = {};
    for (let i = 1; i <= 12; i++) {
        if (!plan.sprints[i]) plan.sprints[i] = { weekNumber: i, tasks: [] };
        if (!plan.sprints[i].tasks) plan.sprints[i].tasks = [];
    }

    const currentWeek = plan.currentSprintWeek || 1;

    const savePlan = async (newPlan: any) => {
        setPlan(newPlan);
        setSaving(true);
        try {
            await fetch('/api/12week-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPlan)
            });
        } catch (e) {
            console.error(e);
        }
        setSaving(false);
    };

    const handleVisionSave = async () => {
        setEditingVision(false);
        await savePlan({ ...plan, vision3Years: visionInput });
    };

    const addObjective = async (e: any) => {
        e.preventDefault();
        const input = e.target.elements.objName;
        if (!input.value.trim()) return;
        const newPlan = { ...plan };
        newPlan.objectives.push({ id: 'obj_' + Date.now(), name: input.value });
        await savePlan(newPlan);
        input.value = '';
    };

    const removeObjective = async (id: string) => {
        if(!confirm("Remover este Objetivo?")) return;
        const newPlan = { ...plan };
        newPlan.objectives = newPlan.objectives.filter((o: any) => o.id !== id);
        await savePlan(newPlan);
    };

    const setSprintWeek = async (week: number) => {
        await savePlan({ ...plan, currentSprintWeek: week });
    };

    const addTask = async (e: any) => {
        e.preventDefault();
        const input = e.target.elements.taskDesc;
        const objSelect = e.target.elements.taskObj;
        if (!input.value.trim()) return;
        
        const newPlan = { ...plan };
        newPlan.sprints[currentWeek].tasks.push({
            id: 'task_' + Date.now(),
            description: input.value,
            status: 'todo',
            objectiveId: objSelect ? objSelect.value : undefined
        });
        await savePlan(newPlan);
        input.value = '';
    };

    const changeTaskStatus = async (taskId: string, newStatus: 'todo' | 'doing' | 'done') => {
        const newPlan = { ...plan };
        const task = newPlan.sprints[currentWeek].tasks.find((t: any) => t.id === taskId);
        if (task) {
            task.status = newStatus;
            await savePlan(newPlan);
        }
    };

    
    const saveTaskEdit = async (taskId: string) => {
        const newPlan = { ...plan };
        const task = newPlan.sprints[currentWeek].tasks.find((t: any) => t.id === taskId);
        if (task) {
            task.description = editTaskDesc;
            task.objectiveId = editTaskObj;
            await savePlan(newPlan);
        }
        setEditingTaskId(null);
    };

    
    const getSprintDateRange = (weekNumber: number, startDateStr?: string) => {
        if (!startDateStr) return `(Semana ${weekNumber})`;
        
        // Ensure we parse the date as local date to avoid timezone shifts
        // startDateStr is "YYYY-MM-DD"
        const parts = startDateStr.split('-');
        if (parts.length !== 3) return `(Semana ${weekNumber})`;
        
        const start = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        // Add weeks
        start.setDate(start.getDate() + (weekNumber - 1) * 7);
        
        const end = new Date(start);
        end.setDate(end.getDate() + 6); // 7 days per sprint, so end is start + 6
        
        const fmt = (d: Date) => `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}`;
        return `(${fmt(start)} a ${fmt(end)})`;
    };

    const handleStartDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPlan = { ...plan, startDate: e.target.value };
        await savePlan(newPlan);
    };

    const startEditingTask = (task: any) => {
        setEditTaskDesc(task.description);
        setEditTaskObj(task.objectiveId);
        setEditTaskTargetSprint(currentWeek);
        setEditingTaskId(task.id);
    };

    const removeTask = async (taskId: string) => {
        if(!confirm("Remover esta tática?")) return;
        const newPlan = { ...plan };
        newPlan.sprints[currentWeek].tasks = newPlan.sprints[currentWeek].tasks.filter((t: any) => t.id !== taskId);
        await savePlan(newPlan);
    };

    const calculateScore = (tasks: any[]) => {
        if (!tasks || tasks.length === 0) return 0;
        const done = tasks.filter(t => t.status === 'done').length;
        return Math.round((done / tasks.length) * 100);
    };

    const activeTasks = plan.sprints[currentWeek].tasks;
    const score = calculateScore(activeTasks);

    const renderTaskCard = (task: any) => {
        const obj = plan.objectives.find((o:any) => o.id === task.objectiveId);
        const isEditing = editingTaskId === task.id;

        if (isEditing) {
            return (
                <div key={task.id} className="bg-[#0f172a] p-3 rounded-lg border border-blue-500 shadow-sm relative mb-3">
                    <input 
                        type="text" 
                        value={editTaskDesc}
                        onChange={e => setEditTaskDesc(e.target.value)}
                        className="w-full bg-[#020617] border border-slate-700 rounded p-1 mb-2 text-sm text-slate-200 focus:outline-none"
                    />
                    {plan.objectives.length > 0 && (
                        <select 
                            value={editTaskObj || ''}
                            onChange={e => setEditTaskObj(e.target.value)}
                            className="w-full bg-[#020617] border border-slate-700 rounded p-1 text-xs text-slate-400 mb-2 focus:outline-none"
                        >
                            <option value="">(Sem vínculo trimestral)</option>
                            {plan.objectives.map((o:any) => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    )}
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditingTaskId(null)} className="text-xs text-slate-500 hover:text-slate-300">Cancelar</button>
                        <button onClick={() => saveTaskEdit(task.id)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Salvar</button>
                    </div>
                </div>
            );
        }

        return (
            <div key={task.id} className="bg-slate-800/80 p-4 rounded-lg border border-slate-600 shadow-sm relative group mb-3 hover:border-slate-400 transition-colors">
                <p className="text-sm text-slate-200 mb-2">{task.description}</p>
                {obj && (
                    <div className="inline-block bg-emerald-900/40 text-emerald-300 border border-emerald-700/60 text-[10px] px-2 py-1 rounded-md font-semibold truncate max-w-full mt-1">
                        {obj.name}
                    </div>
                )}
                
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-800 justify-between items-center">
                    <div className="flex gap-1">
                        {task.status !== 'todo' && <button onClick={() => changeTaskStatus(task.id, 'todo')} className="text-[10px] bg-slate-700 text-slate-200 px-2 py-1 rounded hover:bg-slate-600 transition font-medium">Todo</button>}
                        {task.status !== 'doing' && <button onClick={() => changeTaskStatus(task.id, 'doing')} className="text-[10px] bg-blue-900/50 text-blue-200 border border-blue-700/50 px-2 py-1 rounded hover:bg-blue-800 transition font-medium">Doing</button>}
                        {task.status !== 'done' && <button onClick={() => changeTaskStatus(task.id, 'done')} className="text-[10px] bg-emerald-900/50 text-emerald-200 border border-emerald-700/50 px-2 py-1 rounded hover:bg-emerald-800 transition font-medium">Done</button>}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEditingTask(task)} className="text-slate-500 hover:text-blue-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => removeTask(task.id)} className="text-slate-600 hover:text-red-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full p-4 md:p-8 bg-[#020617] min-h-screen">
            {/* Cabecalho Principal */}
            <div className="flex justify-between items-start md:items-center mb-6">
                <div className="flex items-center gap-4">
                    <a href="/admin/crm" className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-lg flex items-center gap-2 text-sm font-bold">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Voltar
                    </a>
                    <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
                        <span className="text-4xl">🚀</span> Motor Tático: Scrum + 12 Week Year
                    </h1>
                </div>
                {saving && <div className="text-xs text-primary-400 font-bold animate-pulse">Sincronizando...</div>}
            </div>

            {/* Menu de Abas */}
            <div className="flex gap-4 border-b border-slate-800 mb-8">
                <button onClick={() => setActiveTab('vision')} className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'vision' ? 'border-primary-500 text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>1. Visão Trimestral</button>
                <button onClick={() => setActiveTab('kanban')} className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'kanban' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>2. Kanban do Sprint</button>
                <button onClick={() => setActiveTab('analytics')} className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>3. Analytics & Rituais</button>
            </div>

            {/* ABA 1: VISÃO */}
            {activeTab === 'vision' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Visão de 3 Anos (Estrela Guia)</h2>
                        {editingVision ? (
                            <div className="flex flex-col gap-2 mt-2">
                                <textarea 
                                    value={visionInput} 
                                    onChange={e => setVisionInput(e.target.value)} 
                                    className="w-full bg-[#020617] border border-primary-500 rounded-lg px-4 py-3 text-slate-200 text-base focus:outline-none min-h-[150px] whitespace-pre-wrap"
                                    autoFocus
                                />
                                <div className="flex justify-end">
                                    <button onClick={handleVisionSave} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700">Salvar</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-3 cursor-pointer hover:bg-white/[0.02] p-2 rounded-lg transition-colors -ml-2" onClick={() => setEditingVision(true)}>
                                <div className="text-base font-normal text-slate-300 whitespace-pre-wrap leading-relaxed flex-1">{plan.vision3Years || 'Clique para definir a Visão de 3 Anos'}</div>
                                <svg className="w-5 h-5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-50 mb-4">Objetivos do Trimestre (12 Semanas)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {plan.objectives.map((obj: any) => (
                                <div key={obj.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-600 flex justify-between items-start group hover:bg-slate-800 transition">
                                    <div className="font-medium text-slate-200 text-base leading-snug pr-2">{obj.name}</div>
                                    <button onClick={() => removeObjective(obj.id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={addObjective} className="flex gap-2 max-w-md">
                            <input type="text" name="objName" placeholder="Novo Objetivo Trimestral..." className="flex-1 bg-[#020617] border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
                            <button type="submit" className="bg-slate-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-700 transition">Adicionar</button>
                        </form>
                    </div>
                </div>
            )}

            {/* ABA 2: KANBAN DO SPRINT */}
            {activeTab === 'kanban' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-50">Painel de Táticas:</h2>
                                <select 
                                    value={currentWeek} 
                                    onChange={(e) => setSprintWeek(parseInt(e.target.value))}
                                    className="bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-bold focus:border-blue-500 focus:outline-none"
                                >
                                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(w => (
                                        <option key={w} value={w}>Sprint {w} {getSprintDateRange(w, plan.startDate)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-slate-400 font-medium">Início do Ciclo (12WY):</label>
                                <input 
                                    type="date" 
                                    value={plan.startDate || ''}
                                    onChange={handleStartDateChange}
                                    className="bg-[#020617] border border-slate-700 rounded text-xs px-2 py-1 text-slate-300 focus:outline-none focus:border-primary-500 cursor-pointer"
                                    title="Escolha a segunda-feira que inicia a Semana 1"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-[#0f172a] px-4 py-2 rounded-xl border border-slate-800">
                            <div className="text-sm font-bold text-slate-400">Scorecard:</div>
                            <div className="w-32 bg-slate-800 rounded-full h-3 overflow-hidden">
                                <div className={`h-full transition-all duration-500 ${score >= 85 ? 'bg-green-500' : 'bg-orange-500'}`} style={{width: `${score}%`}}></div>
                            </div>
                            <div className={`font-black text-lg ${score >= 85 ? 'text-green-400' : 'text-orange-400'}`}>{score}%</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* TO DO */}
                        <div className="bg-[#020617]/50 rounded-xl border border-slate-800 flex flex-col h-[600px]">
                            <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-t-xl">
                                <h3 className="font-bold text-slate-300 uppercase text-xs tracking-wider">To Do (A Fazer)</h3>
                                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{activeTasks.filter((t:any) => t.status === 'todo').length}</span>
                            </div>
                            <div className="p-3 overflow-y-auto flex-1 custom-scrollbar">
                                {activeTasks.filter((t:any) => t.status === 'todo').map(renderTaskCard)}
                            </div>
                            <div className="p-3 border-t border-slate-800 bg-slate-900/50 rounded-b-xl">
                                <form onSubmit={addTask} className="space-y-2">
                                    <input name="taskDesc" type="text" placeholder="+ Adicionar Tática" className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none" autoComplete="off" />
                                    {plan.objectives.length > 0 && (
                                        <select name="taskObj" className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2 text-xs text-slate-400 focus:border-blue-500 focus:outline-none">
                                            <option value="">(Sem vínculo trimestral)</option>
                                            {plan.objectives.map((o:any) => <option key={o.id} value={o.id}>{o.name}</option>)}
                                        </select>
                                    )}
                                    <button type="submit" className="hidden"></button>
                                </form>
                            </div>
                        </div>

                        {/* DOING */}
                        <div className="bg-blue-950/10 rounded-xl border border-blue-900/30 flex flex-col h-[600px]">
                            <div className="p-3 border-b border-blue-900/30 flex justify-between items-center bg-blue-900/20 rounded-t-xl">
                                <h3 className="font-bold text-blue-400 uppercase text-xs tracking-wider flex items-center gap-2"><span className="animate-pulse">●</span> Doing (Em Progresso)</h3>
                                <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full">{activeTasks.filter((t:any) => t.status === 'doing').length}</span>
                            </div>
                            <div className="p-3 overflow-y-auto flex-1 custom-scrollbar">
                                {activeTasks.filter((t:any) => t.status === 'doing').map(renderTaskCard)}
                            </div>
                        </div>

                        {/* DONE */}
                        <div className="bg-green-950/10 rounded-xl border border-green-900/30 flex flex-col h-[600px]">
                            <div className="p-3 border-b border-green-900/30 flex justify-between items-center bg-green-900/20 rounded-t-xl">
                                <h3 className="font-bold text-green-400 uppercase text-xs tracking-wider">Done (Concluído)</h3>
                                <span className="text-xs bg-green-900/50 text-green-300 px-2 py-0.5 rounded-full">{activeTasks.filter((t:any) => t.status === 'done').length}</span>
                            </div>
                            <div className="p-3 overflow-y-auto flex-1 custom-scrollbar">
                                {activeTasks.filter((t:any) => t.status === 'done').map(renderTaskCard)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ABA 3: ANALYTICS */}
            {activeTab === 'analytics' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800">
                        <h2 className="text-xl font-bold text-slate-50 mb-6">Gráfico do Scorecard (Tendência)</h2>
                        <div className="flex items-end gap-2 h-48 border-b border-slate-700 pb-2">
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(w => {
                                const wScore = calculateScore(plan.sprints[w].tasks);
                                const isTarget = wScore >= 85;
                                return (
                                    <div key={w} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                                        <div className="absolute -top-8 bg-slate-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">{wScore}%</div>
                                        <div className={`w-full max-w-[24px] rounded-t-sm transition-all ${wScore === 0 ? 'bg-slate-800 h-1' : isTarget ? 'bg-green-500' : 'bg-orange-500'}`} style={{height: `${Math.max(wScore, 2)}%`}}></div>
                                        <div className="text-[10px] text-slate-500 mt-2">S{w}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-4">
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> {">="} 85% (Sucesso)</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-500 rounded-sm"></div> &lt; 85% (Atenção)</div>
                        </div>
                    </div>

                    <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800">
                        <h2 className="text-xl font-bold text-slate-50 mb-2 flex items-center gap-2"><span className="text-purple-400">✨</span> Feedback Loop Inteligente</h2>
                        <p className="text-sm text-slate-400 mb-6">Diagnóstico automático do ritmo de execução atual.</p>
                        
                        <div className="space-y-4">
                            {plan.sprints[currentWeek].tasks.filter((t:any) => t.status === 'doing').length > 3 && (
                                <div className="bg-orange-950/30 border border-orange-900/50 p-4 rounded-lg flex items-start gap-3">
                                    <div className="text-orange-400 mt-1">⚠️</div>
                                    <div>
                                        <h4 className="font-bold text-orange-400 text-sm">Gargalo no "Doing" (WIP Elevado)</h4>
                                        <p className="text-xs text-slate-300 mt-1">Você tem mais de 3 tarefas em progresso ao mesmo tempo neste Sprint. O Scrum sugere limitar o Trabalho Em Progresso (WIP) para finalizar coisas mais rápido antes de começar novas.</p>
                                    </div>
                                </div>
                            )}
                            
                            {score < 85 && currentWeek > 1 && calculateScore(plan.sprints[currentWeek - 1].tasks) < 85 && (
                                <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-lg flex items-start gap-3">
                                    <div className="text-red-400 mt-1">🚨</div>
                                    <div>
                                        <h4 className="font-bold text-red-400 text-sm">Risco ao Objetivo Trimestral</h4>
                                        <p className="text-xs text-slate-300 mt-1">Duas semanas consecutivas abaixo de 85% de execução. É altamente recomendado reavaliar a carga do Sprint na Reunião de Planejamento (Sprint Planning).</p>
                                    </div>
                                </div>
                            )}

                            {score >= 85 && (
                                <div className="bg-green-950/30 border border-green-900/50 p-4 rounded-lg flex items-start gap-3">
                                    <div className="text-green-400 mt-1">🏆</div>
                                    <div>
                                        <h4 className="font-bold text-green-400 text-sm">Velocidade Excelente</h4>
                                        <p className="text-xs text-slate-300 mt-1">O Sprint atual está com taxa de execução acima do Teto de 85%. Excelente aderência à metodologia 12-Week Year!</p>
                                    </div>
                                </div>
                            )}
                            
                            {score < 85 && plan.sprints[currentWeek].tasks.filter((t:any) => t.status === 'doing').length <= 3 && (
                                <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex items-start gap-3">
                                    <div className="text-slate-400 mt-1">🔍</div>
                                    <div>
                                        <h4 className="font-bold text-slate-300 text-sm">Análise Inicial</h4>
                                        <p className="text-xs text-slate-400 mt-1">O Sprint ainda não atingiu a meta de 85% e o limite de WIP está saudável. Foque em mover os cards de "Doing" para "Done".</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
