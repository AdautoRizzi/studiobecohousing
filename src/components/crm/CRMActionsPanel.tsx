'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CRMActionsPanel({ leadId, initialNotes, leadEmail, leadPhone, leadName }: { leadId: string, initialNotes: string, leadEmail: string, leadPhone: string, leadName: string }) {
    const router = useRouter();
    
    let initialState = { step1: false, step2: false, step3: false, step4: false, step5: false };
    const match = initialNotes?.match(/__CHECKLIST_STATE__: ({.*})/);
    if (match) {
        try { initialState = JSON.parse(match[1]); } catch(e) {}
    }
    
    const [state, setState] = useState(initialState);
    const [saving, setSaving] = useState(false);

    const toggleStep = async (step: keyof typeof state) => {
        setSaving(true);
        const newState = { ...state, [step]: !state[step] };
        setState(newState);
        
        // Remove old state
        let newNotes = (initialNotes || '').replace(/__CHECKLIST_STATE__: {.*}/, '');
        newNotes += `\n__CHECKLIST_STATE__: ${JSON.stringify(newState)}`;
        
        // Save via API
        await fetch('/api/crm/update-notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: leadId, notasCrm: newNotes.trim() })
        });
        
        setSaving(false);
        router.refresh();
    };

    return (
        <div className="bg-[#0f172a] rounded-xl border border-slate-800 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-50 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span> Central de Ações (CRM Ativo)
            </h2>
            
            <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-slate-800">
                <a href={`https://wa.me/${(leadPhone||'').replace(/\D/g, '')}?text=Ol%C3%A1%20${leadName},%20aqui%20%C3%A9%20da%20Studio%20Be!`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    WhatsApp
                </a>
                
                <a href={`mailto:${leadEmail}?subject=Bem-vindo(a) %C3%A0 Studio Be!`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Gmail
                </a>

                <button onClick={() => alert("Registrar Reunião (A ser implementado no MVP final)")} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Registrar Meet / Ligação
                </button>
            </div>

            <h3 className="text-lg font-bold text-slate-300 mb-4">Método Studio Be (Checklist)</h3>
            <div className="space-y-3">
                {[
                    { id: 'step1', name: 'Passo 1: Envio do Kit Boas-Vindas (em até 24h)' },
                    { id: 'step2', name: 'Passo 2: Ligação de Descoberta / Qualificação' },
                    { id: 'step3', name: 'Passo 3: Reunião de Apresentação (Meet)' },
                    { id: 'step4', name: 'Passo 4: Follow-up & Envio de Materiais' },
                    { id: 'step5', name: 'Passo 5: Convite Oficial para Turma' },
                ].map((step) => (
                    <label key={step.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${state[step.id as keyof typeof state] ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-[#020617] border-slate-700 text-slate-300 hover:border-slate-500'}`}>
                        <input type="checkbox" className="w-5 h-5 rounded bg-slate-800 border-slate-600 text-green-500 focus:ring-green-500 focus:ring-offset-slate-900" 
                            checked={state[step.id as keyof typeof state]} 
                            onChange={() => toggleStep(step.id as keyof typeof state)}
                            disabled={saving}
                        />
                        <span className={`font-medium ${state[step.id as keyof typeof state] ? 'line-through opacity-70' : ''}`}>{step.name}</span>
                    </label>
                ))}
            </div>
            {saving && <p className="text-xs text-primary-400 mt-3 animate-pulse">Salvando progresso...</p>}
        </div>
    );
}