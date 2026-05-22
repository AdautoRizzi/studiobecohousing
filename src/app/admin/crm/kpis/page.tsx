import React from 'react';
import { getAllLeads, getAllInteractions } from '@/lib/db';

export const dynamic = 'force-dynamic';

import { unstable_noStore as noStore } from 'next/cache';

export default async function KpisPage() {
    noStore();
    const leads = await getAllLeads();

    const totalLeads = leads.length;
    const novos = leads.filter(l => l.status === 'Novo').length;
    const contatados = leads.filter(l => l.status === 'Contatado').length;
    const qualificados = leads.filter(l => l.status === 'Qualificado').length;
    const turmaAtribuida = leads.filter(l => l.status === 'Turma Atribuída').length;
    const descartados = leads.filter(l => l.status === 'Descartado').length;

    // Métricas Fictícias de Visitantes para o MVP
    // Na fase 2, isso pode vir do Google Analytics API
    const estimatedVisits = 1250; 
    const conversionRate = totalLeads > 0 ? ((totalLeads / estimatedVisits) * 100).toFixed(1) : '0.0';

    // ======== CÁLCULO DE CONVERSÃO DE ABORDAGENS ========
    const allInteractions = await getAllInteractions();
    
    // Identificar contatos que preencheram o form atual ("Lead Site")
    const formFillers = leads.filter(l => l.categoria === 'Lead Site');
    const formFillerEmails = new Set(formFillers.map(l => l.email?.toLowerCase().trim()).filter(Boolean));
    const formFillerPhones = new Set(formFillers.map(l => l.telefone?.replace(/\D/g, '')).filter(Boolean));

    const checkConversion = (leadId: string) => {
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return false;
        if (lead.categoria === 'Lead Site') return true; // Ele próprio já é um preenchimento recente
        
        const em = lead.email?.toLowerCase().trim();
        const tel = lead.telefone?.replace(/\D/g, '');
        
        if (em && formFillerEmails.has(em)) return true;
        if (tel && formFillerPhones.has(tel)) return true;
        return false;
    };

    // Filtra IDs únicos que receberam email e whatsapp
    const emailSentLeadIds = [...new Set(allInteractions.filter(i => i.type === 'E-mail').map(i => i.lead_id))];
    const whatsSentLeadIds = [...new Set(allInteractions.filter(i => i.type === 'WhatsApp' || i.type === "'Sistema'").map(i => i.lead_id))];

    const emailsSentCount = emailSentLeadIds.length;
    const whatsSentCount = whatsSentLeadIds.length;

    const emailsConvertedCount = emailSentLeadIds.filter(checkConversion).length;
    const whatsConvertedCount = whatsSentLeadIds.filter(checkConversion).length;

    const emailConversionRate = emailsSentCount > 0 ? Math.round((emailsConvertedCount / emailsSentCount) * 100) : 0;
    const whatsConversionRate = whatsSentCount > 0 ? Math.round((whatsConvertedCount / whatsSentCount) * 100) : 0;
    // =======================================================

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Métricas & KPIs</h1>
                <p className="text-slate-400 mt-1">Acompanhe a performance da atração e qualificação da Turma Piloto.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-[#0f172a] p-6 rounded-3xl shadow-sm border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total de Leads</h3>
                    <div className="text-4xl font-extrabold text-primary-900">{totalLeads}</div>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-3xl shadow-sm border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Taxa de Conversão</h3>
                    <div className="text-4xl font-extrabold text-secondary-600">{conversionRate}%</div>
                    <p className="text-xs text-slate-500 mt-2">Est. baseada em {estimatedVisits} acessos.</p>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-3xl shadow-sm border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Qualificados</h3>
                    <div className="text-4xl font-extrabold text-green-600">{qualificados + turmaAtribuida}</div>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-3xl shadow-sm border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Turma Atribuída</h3>
                    <div className="text-4xl font-extrabold text-blue-600">{turmaAtribuida}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Funil de Vendas */}
                <div className="bg-[#0f172a] p-8 rounded-3xl shadow-sm border border-slate-800">
                    <h2 className="text-xl font-bold text-slate-50 mb-6">Funil do Cliente</h2>
                    
                    <div className="space-y-4">
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div><span className="text-xs font-bold inline-block py-1 uppercase tracking-wide text-slate-300">Novos Leads</span></div>
                                <div className="text-right"><span className="text-xs font-bold inline-block text-slate-300">{novos} ({totalLeads > 0 ? Math.round((novos/totalLeads)*100) : 0}%)</span></div>
                            </div>
                            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-800">
                                <div style={{ width: `${totalLeads > 0 ? (novos/totalLeads)*100 : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-400"></div>
                            </div>
                        </div>

                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div><span className="text-xs font-bold inline-block py-1 uppercase tracking-wide text-slate-300">Em Contato</span></div>
                                <div className="text-right"><span className="text-xs font-bold inline-block text-slate-300">{contatados} ({totalLeads > 0 ? Math.round((contatados/totalLeads)*100) : 0}%)</span></div>
                            </div>
                            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-800">
                                <div style={{ width: `${totalLeads > 0 ? (contatados/totalLeads)*100 : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-400"></div>
                            </div>
                        </div>

                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div><span className="text-xs font-bold inline-block py-1 uppercase tracking-wide text-slate-300">Qualificados (Avançados)</span></div>
                                <div className="text-right"><span className="text-xs font-bold inline-block text-slate-300">{qualificados} ({totalLeads > 0 ? Math.round((qualificados/totalLeads)*100) : 0}%)</span></div>
                            </div>
                            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-800">
                                <div style={{ width: `${totalLeads > 0 ? (qualificados/totalLeads)*100 : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Perfil Demográfico Básico */}
                <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 p-8 rounded-3xl shadow-sm text-white">
                    <h2 className="text-xl font-bold mb-6">Insights Demográficos</h2>
                    <p className="text-secondary-100 mb-6">Resumo rápido baseado nas informações do CohousingForm dos seus leads atuais.</p>
                    
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center bg-[#0f172a]/10 px-4 py-3 rounded-xl">
                            <span className="font-medium text-sm">Principal Faixa Etária</span>
                            <span className="font-bold">Dados em breve</span>
                        </li>
                        <li className="flex justify-between items-center bg-[#0f172a]/10 px-4 py-3 rounded-xl">
                            <span className="font-medium text-sm">Tipologia mais Buscada</span>
                            <span className="font-bold">Casas Térreas</span>
                        </li>
                        <li className="flex justify-between items-center bg-[#0f172a]/10 px-4 py-3 rounded-xl">
                            <span className="font-medium text-sm">Desejo de Localização</span>
                            <span className="font-bold">Interior / Litoral</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Nova Seção de Performance de Canais */}
            <div className="mt-8 bg-[#0f172a] p-8 rounded-3xl shadow-sm border border-slate-800">
                <h2 className="text-xl font-bold text-slate-50 mb-6">Performance de Canais (Conversão de Pesquisas Antigas)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* E-mail Performance */}
                    <div className="border border-slate-800 p-6 rounded-2xl bg-[#020617]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="font-bold text-slate-50 text-lg">E-mails Enviados</h3>
                        </div>
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-sm text-slate-400 font-medium">Contatos abordados</p>
                                <p className="text-2xl font-bold text-slate-50">{emailsSentCount}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-400 font-medium">Retornos (Formulário)</p>
                                <p className="text-2xl font-bold text-blue-600">{emailsConvertedCount}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                                <span>Taxa de Resposta</span>
                                <span>{emailConversionRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${emailConversionRate}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Performance */}
                    <div className="border border-slate-800 p-6 rounded-2xl bg-[#020617]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </div>
                            <h3 className="font-bold text-slate-50 text-lg">WhatsApp Enviados</h3>
                        </div>
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-sm text-slate-400 font-medium">Contatos abordados</p>
                                <p className="text-2xl font-bold text-slate-50">{whatsSentCount}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-400 font-medium">Retornos (Formulário)</p>
                                <p className="text-2xl font-bold text-green-600">{whatsConvertedCount}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                                <span>Taxa de Resposta</span>
                                <span>{whatsConversionRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${whatsConversionRate}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
