import React from 'react';
import Link from 'next/link';
import { getAllLeads, getMethodSteps } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function SalesDashboard() {
    const leads = await getAllLeads();

    // Filtra leads que não estão Descartados ou Turma Atribuída
    const activeLeads = leads.filter(l => l.status !== 'Descartado' && l.status !== 'Turma Atribuída');

    const STEPS = await getMethodSteps();

    // Classifica leads por qual passo eles estão aguardando
    const leadsByStep: Record<string, typeof leads> = { done: [] };
    STEPS.forEach(s => leadsByStep[s.id] = []);

    activeLeads.forEach(lead => {
        let state: Record<string, boolean> = {};
        const match = lead.notasCrm?.match(/__CHECKLIST_STATE__: ({.*})/);
        if (match) {
            try { state = JSON.parse(match[1]); } catch(e) {}
        }
        
        let currentPendingStep = null;
        for (const step of STEPS) {
            if (!state[step.id]) {
                currentPendingStep = step.id;
                break;
            }
        }
        
        if (currentPendingStep) {
            leadsByStep[currentPendingStep].push(lead);
        } else {
            leadsByStep.done.push(lead);
        }
    });

    return (
        <div className="p-4 md:p-8 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <Link href="/admin/crm" className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-lg flex items-center gap-2 text-sm font-bold">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Voltar
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
                            <span className="text-4xl">🚀</span> Jornada do Cliente
                        </h1>
                    </div>
                    <p className="text-slate-400 mt-2">Painel estratégico diário: Leads aguardando próxima ação.</p>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar items-start">
                {STEPS.map((step, idx) => (
                    <div key={step.id} className="bg-[#0f172a] rounded-xl border border-slate-800 flex flex-col h-[70vh] min-w-[280px] max-w-[320px] flex-1 shrink-0">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/50 rounded-t-xl">
                            <h3 className="font-bold text-slate-200 text-sm">{step.name}</h3>
                            <div className="text-xs text-slate-500 mt-1">{leadsByStep[step.id].length} leads aguardando</div>
                        </div>
                        <div className="p-3 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                            {leadsByStep[step.id].map(lead => (
                                <Link href={`/admin/crm/lead/${lead.id}`} key={lead.id} className="block bg-[#1e293b] p-3 rounded-lg border border-slate-700 hover:border-primary-500 transition-colors group">
                                    <div className="font-bold text-sm text-slate-100 truncate group-hover:text-primary-400">{lead.nome}</div>
                                    <div className="text-xs text-slate-400 mt-1 truncate">{lead.email}</div>
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                            lead.status === 'Novo' ? 'bg-blue-500/20 text-blue-400' : 
                                            lead.status === 'Qualificado' ? 'bg-green-500/20 text-green-400' : 
                                            'bg-slate-700 text-slate-300'
                                        }`}>
                                            {lead.status}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                            {leadsByStep[step.id].length === 0 && (
                                <div className="text-center p-4 text-xs text-slate-500 italic">Nenhum lead nesta etapa.</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
