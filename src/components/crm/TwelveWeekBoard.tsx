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
    const [editTaskImage, setEditTaskImage] = useState<string | undefined>(undefined);
    const [draggedTask, setDraggedTask] = useState<string | null>(null);
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [visionInput, setVisionInput] = useState(initialPlan.vision3Years || '');
    
    // Fallbacks para garantir que a estrutura exista
    if (!plan.objectives) plan.objectives = [];
    if (!plan.sprints) plan.sprints = {};
    for (let i = 1; i <= 12; i++) {
        if (!plan.sprints[i]) plan.sprints[i] = { weekNumber: i, tasks: [] };
        if (!plan.sprints[i].tasks) plan.sprints[i].tasks = [];
        }
        if (!plan.inbox) plan.inbox = [];

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
        
        let isInbox = false;
        let taskIndex = newPlan.sprints[currentWeek].tasks.findIndex((t: any) => t.id === taskId);
        
        if (taskIndex === -1 && newPlan.inbox) {
            taskIndex = newPlan.inbox.findIndex((t: any) => t.id === taskId);
            if (taskIndex !== -1) isInbox = true;
        }
        
        if (taskIndex !== -1) {
            const task = isInbox ? newPlan.inbox[taskIndex] : newPlan.sprints[currentWeek].tasks[taskIndex];
            task.description = editTaskDesc;
            task.objectiveId = editTaskObj;
            task.imageUrl = editTaskImage;
            
            if (!isInbox && editTaskTargetSprint !== currentWeek) {
                // Move task to target sprint
                newPlan.sprints[currentWeek].tasks.splice(taskIndex, 1);
                if (!newPlan.sprints[editTaskTargetSprint]) newPlan.sprints[editTaskTargetSprint] = { weekNumber: editTaskTargetSprint, tasks: [] };
                if (!newPlan.sprints[editTaskTargetSprint].tasks) newPlan.sprints[editTaskTargetSprint].tasks = [];
                newPlan.sprints[editTaskTargetSprint].tasks.push(task);
            }
            
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

    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                
                // Compress to JPEG with 0.6 quality to keep JSON size small
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                setEditTaskImage(dataUrl);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const startEditingTask = (task: any) => {
        setEditTaskDesc(task.description);
        setEditTaskObj(task.objectiveId);
        setEditTaskTargetSprint(currentWeek);
        setEditTaskImage(task.imageUrl);
        setEditingTaskId(task.id);
    };

    
    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedTask(taskId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/json', taskId);
        // Add a slight transparency to the dragged item
        setTimeout(() => {
            if(e.target instanceof HTMLElement) e.target.classList.add('opacity-50');
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        setDraggedTask(null);
        if(e.target instanceof HTMLElement) e.target.classList.remove('opacity-50');
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
        e.preventDefault();
        const taskIdToMove = e.dataTransfer.getData('application/json') || draggedTask;
        if (!taskIdToMove) return;
        
        const newPlan = { ...plan };
        
        // Find task and its current location
        let taskIndex = -1;
        let isCurrentlyInbox = false;
        
        // Search in Inbox
        if (newPlan.inbox) {
            taskIndex = newPlan.inbox.findIndex((t:any) => String(t.id) === String(taskIdToMove));
            if (taskIndex > -1) isCurrentlyInbox = true;
        }
        
        // Search in Current Sprint
        if (taskIndex === -1 && newPlan.sprints[currentWeek]?.tasks) {
            taskIndex = newPlan.sprints[currentWeek].tasks.findIndex((t:any) => String(t.id) === String(taskIdToMove));
        }
        
        if (taskIndex === -1) return; // Task not found
        
        let taskObj;
        
        // Splice out of origin
        if (isCurrentlyInbox) {
            taskObj = newPlan.inbox[taskIndex];
            newPlan.inbox.splice(taskIndex, 1);
        } else {
            taskObj = newPlan.sprints[currentWeek].tasks[taskIndex];
            newPlan.sprints[currentWeek].tasks.splice(taskIndex, 1);
        }
        
        // Push to target
        taskObj.status = targetStatus === 'inbox' ? 'todo' : targetStatus;
        
        if (targetStatus === 'inbox') {
            if (!newPlan.inbox) newPlan.inbox = [];
            newPlan.inbox.push(taskObj);
        } else {
            if (!newPlan.sprints[currentWeek]) newPlan.sprints[currentWeek] = { weekNumber: currentWeek, tasks: [] };
            if (!newPlan.sprints[currentWeek].tasks) newPlan.sprints[currentWeek].tasks = [];
            newPlan.sprints[currentWeek].tasks.push(taskObj);
        }
        
        await savePlan(newPlan);
        setDraggedTask(null);
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

    
    const moveInboxToSprint = async (taskId: string, targetSprint: number) => {
        const newPlan = { ...plan };
        const taskIndex = newPlan.inbox.findIndex((t:any) => t.id === taskId);
        if (taskIndex > -1) {
            const task = newPlan.inbox[taskIndex];
            newPlan.inbox.splice(taskIndex, 1);
            if (!newPlan.sprints[targetSprint]) newPlan.sprints[targetSprint] = { weekNumber: targetSprint, tasks: [] };
            newPlan.sprints[targetSprint].tasks.push(task);
            await savePlan(newPlan);
        }
    };

    const addInboxTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.elements.namedItem('taskDesc') as HTMLInputElement;
        const objSelect = form.elements.namedItem('taskObj') as HTMLSelectElement;
        if (!input.value.trim()) return;
        
        const newPlan = { ...plan };
        if (!newPlan.inbox) newPlan.inbox = [];
        newPlan.inbox.push({
            id: 'inbox_' + Date.now(),
            description: input.value,
            status: 'todo',
            objectiveId: objSelect ? objSelect.value : undefined
        });
        await savePlan(newPlan);
        input.value = '';
    };

    const removeInboxTask = async (taskId: string) => {
        if(!confirm("Remover esta ideia?")) return;
        const newPlan = { ...plan };
        newPlan.inbox = newPlan.inbox.filter((t: any) => t.id !== taskId);
        await savePlan(newPlan);
    };

    
    const renderFormattedText = (text: string, isExpanded: boolean) => {
        if (!text) return null;
        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            // Line breaks
            .replace(/\n/g, "<br/>")
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>')
            // Lists (lines starting with - or *)
            .replace(/^(?:<br\/>)*(\s*)([-*])\s+(.*)$/gm, '$1<span class="text-slate-400 mr-2">•</span>$3');
            
        return (
            <div 
                className={`text-sm text-slate-200 mb-2 leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3 cursor-pointer'}`} 
                dangerouslySetInnerHTML={{__html: html}} 
            />
        );
    };

    
    const toggleExpand = (taskId: string, e: React.MouseEvent) => {
        // Prevent toggle if clicking edit button or dragging
        if ((e.target as HTMLElement).closest('button')) return;
        setExpandedTaskId(prev => prev === taskId ? null : taskId);
    };

    const renderInboxCard = (task: any) => {
        const isEditing = editingTaskId === task.id;
        if (isEditing) {
            return (
                <div key={task.id} className="bg-[#0f172a] p-3 rounded-lg border border-purple-500 shadow-sm relative mb-3">
                    <textarea 
                        value={editTaskDesc}
                        onChange={e => setEditTaskDesc(e.target.value)}
                        className="w-full bg-[#020617] border border-slate-700 rounded p-2 mb-2 text-sm text-slate-200 focus:outline-none min-h-[120px] resize-y custom-scrollbar"
                    />
                    {plan.objectives?.length > 0 && (
                        <select 
                            value={editTaskObj || ''}
                            onChange={e => setEditTaskObj(e.target.value)}
                            className="w-full bg-[#020617] border border-slate-700 rounded p-1 text-xs text-slate-400 mb-2 focus:outline-none"
                        >
                            <option value="">(Sem vínculo trimestral)</option>
                            {plan.objectives.map((o:any) => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    )}
                    
                    <div className="mb-3 border border-slate-700 border-dashed rounded p-2 text-center relative group">
                        {editTaskImage ? (
                            <div className="relative">
                                <img src={editTaskImage} alt="Anexo" className="max-h-32 mx-auto rounded" />
                                <button onClick={() => setEditTaskImage(undefined)} className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 hover:bg-red-500">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ) : (
                            <div>
                                <label className="cursor-pointer text-xs text-slate-400 hover:text-slate-200 flex flex-col items-center gap-1">
                                    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Anexar Imagem
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditingTaskId(null)} className="text-xs text-slate-500 hover:text-slate-300">Cancelar</button>
                        <button onClick={() => saveTaskEdit(task.id)} className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700">Salvar</button>
                    </div>
                </div>
            );
        }
        
        const obj = plan.objectives?.find((o:any) => o.id === task.objectiveId);
        return (
            <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)} onDragEnd={handleDragEnd} className="bg-slate-800/80 p-4 rounded-lg border border-purple-500/50 shadow-sm relative group mb-3 hover:border-purple-400 transition-colors cursor-move">
                {task.imageUrl && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-slate-700 cursor-pointer" onClick={() => setFullscreenImage(task.imageUrl)}>
                        <img src={task.imageUrl} alt="Anexo da Tática" className="w-full h-auto object-cover max-h-48 hover:opacity-90 transition-opacity" />
                    </div>
                )}
                <div onClick={(e) => toggleExpand(task.id, e)}>{renderFormattedText(task.description, expandedTaskId === task.id)}</div>
                {obj && (
                    <div className="inline-block bg-emerald-900/40 text-emerald-300 border border-emerald-700/60 text-[10px] px-2 py-1 rounded-md font-semibold truncate max-w-full mt-1">
                        {obj.name}
                    </div>
                )}
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700 justify-between items-center">
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity w-full justify-end">
                        <button onClick={() => startEditingTask(task)} className="text-slate-500 hover:text-blue-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => removeInboxTask(task.id)} className="text-slate-500 hover:text-red-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>
            </div>
        );
    };

    const renderTaskCard = (task: any) => {
        const obj = plan.objectives.find((o:any) => o.id === task.objectiveId);
        const isEditing = editingTaskId === task.id;

        if (isEditing) {
            return (
                <div key={task.id} className="bg-[#0f172a] p-3 rounded-lg border border-blue-500 shadow-sm relative mb-3">
                    <textarea 
                        value={editTaskDesc}
                        onChange={e => setEditTaskDesc(e.target.value)}
                        className="w-full bg-[#020617] border border-slate-700 rounded p-2 mb-2 text-sm text-slate-200 focus:outline-none min-h-[120px] resize-y custom-scrollbar"
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
                    <select 
                        value={editTaskTargetSprint}
                        onChange={e => setEditTaskTargetSprint(parseInt(e.target.value))}
                        className="w-full bg-[#020617] border border-slate-700 rounded p-1 text-xs text-slate-400 mb-3 focus:outline-none"
                    >
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(w => <option key={w} value={w}>Mover para Sprint {w}</option>)}
                    </select>

                    <div className="mb-3 border border-slate-700 border-dashed rounded p-2 text-center relative group">
                        {editTaskImage ? (
                            <div className="relative">
                                <img src={editTaskImage} alt="Anexo" className="max-h-32 mx-auto rounded" />
                                <button onClick={() => setEditTaskImage(undefined)} className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 hover:bg-red-500">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ) : (
                            <div>
                                <label className="cursor-pointer text-xs text-slate-400 hover:text-slate-200 flex flex-col items-center gap-1">
                                    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Anexar Imagem
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditingTaskId(null)} className="text-xs text-slate-500 hover:text-slate-300">Cancelar</button>
                        <button onClick={() => saveTaskEdit(task.id)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Salvar</button>
                    </div>
                </div>
            );
        }

        return (
            <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)} onDragEnd={handleDragEnd} className="bg-slate-800/80 p-4 rounded-lg border border-slate-600 shadow-sm relative group mb-3 hover:border-slate-400 transition-colors cursor-move">
                {task.imageUrl && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-slate-700 cursor-pointer" onClick={() => setFullscreenImage(task.imageUrl)}>
                        <img src={task.imageUrl} alt="Anexo da Tática" className="w-full h-auto object-cover max-h-48 hover:opacity-90 transition-opacity" />
                    </div>
                )}
                <div onClick={(e) => toggleExpand(task.id, e)}>{renderFormattedText(task.description, expandedTaskId === task.id)}</div>
                {obj && (
                    <div className="inline-block bg-emerald-900/40 text-emerald-300 border border-emerald-700/60 text-[10px] px-2 py-1 rounded-md font-semibold truncate max-w-full mt-1">
                        {obj.name}
                    </div>
                )}
                
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-800 justify-between items-center">
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity w-full justify-end">
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

                    <div className="grid grid-cols-1 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-6">

                        {/* BACKLOG (CAIXA DE ENTRADA) */}
                        <div className="bg-[#020617]/50 rounded-xl border border-slate-800 flex flex-col h-[600px] md:h-[70vh]" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'inbox')}>
                            <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-purple-950/20 rounded-t-xl">
                                <h3 className="font-bold text-purple-400 uppercase text-xs tracking-wider">📥 Caixa de Entrada</h3>
                                <span className="text-xs bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded-full border border-purple-700/50">{(plan.inbox || []).length}</span>
                            </div>
                            <div className="p-3 overflow-y-auto flex-1 custom-scrollbar drop-zone min-h-[50px]">
                                {(plan.inbox || []).map(renderInboxCard)}
                            </div>
                            <div className="p-3 border-t border-slate-800 bg-slate-900/50 rounded-b-xl">
                                <form onSubmit={addInboxTask} className="space-y-2">
                                    <input name="taskDesc" type="text" placeholder="+ Nova Ideia (Backlog)" className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:border-purple-500 focus:outline-none" autoComplete="off" />
                                    {plan.objectives?.length > 0 && (
                                        <select name="taskObj" className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2 text-xs text-slate-400 focus:border-purple-500 focus:outline-none">
                                            <option value="">(Sem vínculo trimestral)</option>
                                            {plan.objectives.map((o:any) => <option key={o.id} value={o.id}>{o.name}</option>)}
                                        </select>
                                    )}
                                    <button type="submit" className="hidden"></button>
                                </form>
                            </div>
                        </div>

                        {/* TO DO */}
                        <div className="bg-[#020617]/50 rounded-xl border border-slate-800 flex flex-col h-[600px] md:h-[70vh]" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'todo')}>
                            <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-t-xl">
                                <h3 className="font-bold text-slate-300 uppercase text-xs tracking-wider">To Do (A Fazer)</h3>
                                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{activeTasks.filter((t:any) => t.status === 'todo').length}</span>
                            </div>
                            <div className="p-3 overflow-y-auto flex-1 custom-scrollbar drop-zone min-h-[50px]">
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
                        <div className="bg-blue-950/10 rounded-xl border border-blue-900/30 flex flex-col h-[600px]" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'doing')}>
                            <div className="p-3 border-b border-blue-900/30 flex justify-between items-center bg-blue-900/20 rounded-t-xl">
                                <h3 className="font-bold text-blue-400 uppercase text-xs tracking-wider flex items-center gap-2"><span className="animate-pulse">●</span> Doing (Em Progresso)</h3>
                                <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full">{activeTasks.filter((t:any) => t.status === 'doing').length}</span>
                            </div>
                            <div className="p-3 overflow-y-auto flex-1 custom-scrollbar drop-zone min-h-[50px]">
                                {activeTasks.filter((t:any) => t.status === 'doing').map(renderTaskCard)}
                            </div>
                        </div>

                        
                        {/* CHECAGEM */}
                        <div className="bg-[#020617]/50 rounded-xl border border-yellow-900/30 flex flex-col h-[600px] md:h-[70vh]" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'check')}>
                            <div className="p-3 border-b border-yellow-900/30 flex justify-between items-center bg-yellow-950/20 rounded-t-xl">
                                <h3 className="font-bold text-yellow-400 uppercase text-xs tracking-wider">👀 Checagem</h3>
                                <span className="text-xs bg-yellow-900/50 text-yellow-200 px-2 py-0.5 rounded-full">{activeTasks.filter((t:any) => t.status === 'check').length}</span>
                            </div>
                            <div className="p-3 overflow-y-auto flex-1 custom-scrollbar drop-zone min-h-[50px]">
                                {activeTasks.filter((t:any) => t.status === 'check').map(renderTaskCard)}
                            </div>
                        </div>

                        {/* DONE */}
                        <div className="bg-green-950/10 rounded-xl border border-green-900/30 flex flex-col h-[600px]">
                            <div className="p-3 border-b border-green-900/30 flex justify-between items-center bg-green-900/20 rounded-t-xl">
                                <h3 className="font-bold text-green-400 uppercase text-xs tracking-wider">Done (Concluído)</h3>
                                <span className="text-xs bg-green-900/50 text-green-300 px-2 py-0.5 rounded-full">{activeTasks.filter((t:any) => t.status === 'done').length}</span>
                            </div>
                            <div className="p-3 overflow-y-auto flex-1 custom-scrollbar drop-zone min-h-[50px]">
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
