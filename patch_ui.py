# -*- coding: utf-8 -*-
import sys
filepath = r'C:\Users\Adauto\.gemini\antigravity\playground\sonic-hawking\src\components\crm\TwelveWeekBoard.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_vision = """                        {editingVision ? (
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
                                <div className="text-2xl font-black text-slate-50">{plan.vision3Years}</div>
                                <svg className="w-5 h-5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </div>
                        )}"""

new_vision = """                        {editingVision ? (
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
                        )}"""


old_obj = """                            {plan.objectives.map((obj: any) => (
                                <div key={obj.id} className="bg-[#020617] p-4 rounded-xl border border-slate-700 flex justify-between items-start group">
                                    <div className="font-bold text-primary-400">{obj.name}</div>
                                    <button onClick={() => removeObjective(obj.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}"""

new_obj = """                            {plan.objectives.map((obj: any) => (
                                <div key={obj.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-600 flex justify-between items-start group hover:bg-slate-800 transition">
                                    <div className="font-medium text-slate-200 text-base leading-snug pr-2">{obj.name}</div>
                                    <button onClick={() => removeObjective(obj.id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}"""


if old_vision in content and old_obj in content:
    content = content.replace(old_vision, new_vision)
    content = content.replace(old_obj, new_obj)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched TwelveWeekBoard.tsx successfully!")
else:
    if old_vision not in content: print("Could not find old_vision")
    if old_obj not in content: print("Could not find old_obj")
