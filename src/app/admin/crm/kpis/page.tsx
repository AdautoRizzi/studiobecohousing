import React from 'react';
import { getAllLeads } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function KpisPage() {
    const leads = getAllLeads();

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

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Métricas & KPIs</h1>
                <p className="text-gray-500 mt-1">Acompanhe a performance da atração e qualificação da Turma Piloto.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total de Leads</h3>
                    <div className="text-4xl font-extrabold text-primary-900">{totalLeads}</div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Taxa de Conversão</h3>
                    <div className="text-4xl font-extrabold text-secondary-600">{conversionRate}%</div>
                    <p className="text-xs text-gray-400 mt-2">Est. baseada em {estimatedVisits} acessos.</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Qualificados</h3>
                    <div className="text-4xl font-extrabold text-green-600">{qualificados + turmaAtribuida}</div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Turma Atribuída</h3>
                    <div className="text-4xl font-extrabold text-blue-600">{turmaAtribuida}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Funil de Vendas */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Funil do Cliente</h2>
                    
                    <div className="space-y-4">
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div><span className="text-xs font-bold inline-block py-1 uppercase tracking-wide text-gray-600">Novos Leads</span></div>
                                <div className="text-right"><span className="text-xs font-bold inline-block text-gray-600">{novos} ({totalLeads > 0 ? Math.round((novos/totalLeads)*100) : 0}%)</span></div>
                            </div>
                            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100">
                                <div style={{ width: `${totalLeads > 0 ? (novos/totalLeads)*100 : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-400"></div>
                            </div>
                        </div>

                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div><span className="text-xs font-bold inline-block py-1 uppercase tracking-wide text-gray-600">Em Contato</span></div>
                                <div className="text-right"><span className="text-xs font-bold inline-block text-gray-600">{contatados} ({totalLeads > 0 ? Math.round((contatados/totalLeads)*100) : 0}%)</span></div>
                            </div>
                            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100">
                                <div style={{ width: `${totalLeads > 0 ? (contatados/totalLeads)*100 : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-400"></div>
                            </div>
                        </div>

                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div><span className="text-xs font-bold inline-block py-1 uppercase tracking-wide text-gray-600">Qualificados (Avançados)</span></div>
                                <div className="text-right"><span className="text-xs font-bold inline-block text-gray-600">{qualificados} ({totalLeads > 0 ? Math.round((qualificados/totalLeads)*100) : 0}%)</span></div>
                            </div>
                            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100">
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
                        <li className="flex justify-between items-center bg-white/10 px-4 py-3 rounded-xl">
                            <span className="font-medium text-sm">Principal Faixa Etária</span>
                            <span className="font-bold">Dados em breve</span>
                        </li>
                        <li className="flex justify-between items-center bg-white/10 px-4 py-3 rounded-xl">
                            <span className="font-medium text-sm">Tipologia mais Buscada</span>
                            <span className="font-bold">Casas Térreas</span>
                        </li>
                        <li className="flex justify-between items-center bg-white/10 px-4 py-3 rounded-xl">
                            <span className="font-medium text-sm">Desejo de Localização</span>
                            <span className="font-bold">Interior / Litoral</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
