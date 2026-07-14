import React from 'react';
import Link from 'next/link';
import { getAllLeads } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function SalesDashboard() {
    const leads = await getAllLeads();

    // Filtra leads que não estão Descartados ou Turma Atribuda
    const activeLeads = leads.filter(l => l.status !== 'Descartado' && l.status !== 'Turma Atribuída');

    // Mtodo Studio Be steps
    const STEPS = [
        { id: 'step1', name: 'Passo 1: Kit Boas-Vindas' },
        { id: 'step2', name: 'Passo 2: Ligação de Descoberta' },
        { id: 'step3', name: 'Passo 3: Reunião (Meet)' },
        { id: 'step4', name: 'Passo 4: Follow-up & Materiais' },
        { id: 'step5', name: 'Passo 5: Convite Oficial' },
    ];

    // Classifica leads por qual passo eles estǜo aguardando
    const leadsByStep: Record<string, typeof leads> = {
        step1: [], step2: [], step3: [], step4: [], step5: [], done: []
    };

    activeLeads.forEach(lead => {
        let state = { step1: false, step2: false, step3: false, step4: false, step5: false };
        const match = lead.notasCrm?.match(/__CHECKLIST_STATE__: ({.*})/);
        if (match) {
            try { state = JSON.parse(match[1]); } catch(e) {}
        }
        
        if (!state.step1) leadsByStep.step1.push(lead);
        else if (!state.step2) leadsByStep.step2.push(lead);
        else if (!state.step3) leadsByStep.step3.push(lead);
        else if (!state.step4) leadsByStep.step4.push(lead);
        else if (!state.step5) leadsByStep.step5.push(lead);
        else leadsByStep.done.push(lead);
    });

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
                        <span className="text-4xl">🚀</span> Máquina de Vendas
                    </h1>
                    <p className="text-slate-400 mt-2">Painel estratgico diǭrio: Leads aguardando próxima ação.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {STEPS.map((step, idx) => (
                    <div key={step.id} className="bg-[#0f172a] rounded-xl border border-slate-800 flex flex-col h-[600px]">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/50 rounded-t-xl">
                            <h3 className="font-bold text-slate-200 text-sm">{step.name}</h3>
                            <div className="text-xs text-slate-500 mt-1">{leadsByStep[step.id].length} leads aguardando</div>
                        </div>
                        <div className="p-3 overflow-y-auto flex-1 space-y-3">
                            {leadsByStep[step.id].map(lead => (
                                <Link href={`/admin/crm/${lead.id}`} key={lead.id} className="block bg-[#1e293b] p-3 rounded-lg border border-slate-700 hover:border-primary-500 transition-colors group">
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
