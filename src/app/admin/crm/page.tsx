import React from 'react';
import { getAllLeads } from '@/lib/db';
import Link from 'next/link';
import DeleteLeadButton from '@/components/crm/DeleteLeadButton';

export const dynamic = 'force-dynamic';

export default async function CRMPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const params = await searchParams;
    const leads = await getAllLeads();
    const currentTab = params.tab || 'leads';

    // Reverse leads to show newest first
    const sortedLeads = [...leads].reverse();

    // Limpa aspas caso o valor padrão no Supabase tenha sido criado com aspas simples/duplas
    const getCleanCategory = (cat: string | null | undefined) => {
        if (!cat) return 'Lead Site';
        return cat.replace(/['"]/g, '').trim();
    };

    // Filtra com base na aba
    const filteredLeads = sortedLeads.filter(lead => {
        const cat = getCleanCategory(lead.categoria);
        if (currentTab === 'leads') return cat === 'Lead Site';
        if (currentTab === 'pesquisa') return cat === 'Pesquisa Antiga';
        if (currentTab === 'stakeholders') return cat !== 'Lead Site' && cat !== 'Pesquisa Antiga';
        return true;
    });

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Novo': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Contatado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Qualificado': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Turma Atribuída': return 'bg-green-100 text-green-800 border-green-200';
            case 'Descartado': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestão de Leads</h1>
                    <div className="flex gap-4 mt-2">
                        <p className="text-gray-500">Acompanhe todos os interessados no projeto Studio Be.</p>
                        <Link href="/admin/crm/agenda" className="text-orange-600 font-bold text-sm hover:underline flex items-center gap-1">
                            📅 Ver Agenda de Contatos
                        </Link>
                    </div>
                </div>
                <div className="flex gap-4 items-end">
                    <Link href="/admin/crm/importar" className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all flex items-center gap-2 border border-gray-200">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        Importar Dados
                    </Link>
                    <Link href="/admin/crm/new" className="bg-primary-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-800 transition-all shadow-lg shadow-primary-900/20 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Novo Manual
                    </Link>
                </div>
            </div>

            {/* Abas de Navegação */}
            <div className="flex space-x-2 mb-6 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                <a href="/admin/crm?tab=leads" className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${currentTab === 'leads' ? 'bg-secondary-50 text-secondary-600 shadow-sm border border-secondary-100' : 'text-gray-500 hover:bg-gray-50'}`}>
                    🚀 Leads Site ({sortedLeads.filter(l => getCleanCategory(l.categoria) === 'Lead Site').length})
                </a>
                <a href="/admin/crm?tab=pesquisa" className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${currentTab === 'pesquisa' ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-100' : 'text-gray-500 hover:bg-gray-50'}`}>
                    📊 Pesquisa Antiga ({sortedLeads.filter(l => getCleanCategory(l.categoria) === 'Pesquisa Antiga').length})
                </a>
                <a href="/admin/crm?tab=stakeholders" className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${currentTab === 'stakeholders' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                    🤝 Stakeholders ({sortedLeads.filter(l => {
                        const cat = getCleanCategory(l.categoria);
                        return cat !== 'Lead Site' && cat !== 'Pesquisa Antiga';
                    }).length})
                </a>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contato</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Idade / Perfil</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Local / Desejo</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cadastro</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLeads.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    Nenhum registro encontrado nesta categoria.
                                </td>
                            </tr>
                        ) : (
                            filteredLeads.map(lead => (
                                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{lead.nome}</div>
                                        <div className="text-sm text-gray-500">{lead.email}</div>
                                        <div className="text-sm text-gray-500">{lead.telefone || 'Sem telefone'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{lead.idade}</div>
                                        <div className="text-sm text-gray-500">{lead.profissao}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">Mora em: {lead.moradiaAtual}</div>
                                        <div className="text-sm text-primary-600 font-medium">Busca: {lead.ondeMorar}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {(() => {
                                            const fields = [lead.telefone, lead.profissao, lead.ondeMorar, lead.tipoCohousing, lead.areaResidencia];
                                            const missing = fields.filter(f => !f).length;
                                            const interessesLen = (lead.interesses || []).length;
                                            const valoresLen = (lead.valores || []).length;
                                            const empreenderLen = (lead.empreender || []).length;
                                            const arraysMissing = [interessesLen, valoresLen, empreenderLen].filter(l => l === 0).length;
                                            const totalMissing = missing + arraysMissing;
                                            
                                            if (totalMissing === 0) return <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-1 rounded border border-green-100 uppercase">100% Completo</span>;
                                            return <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-2 py-1 rounded border border-orange-100 uppercase">Incompleto (-{totalMissing})</span>;
                                        })()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(lead.status)}`}>
                                            {lead.status}
                                        </span>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2 flex items-center justify-end">
                                        <Link href={`/admin/crm/lead/${lead.id}`} className="text-gray-600 hover:text-gray-900 font-bold bg-gray-100 px-3 py-2 rounded-lg transition-colors text-xs">
                                            Analisar Match
                                        </Link>
                                        <Link href={`/admin/crm/lead/${lead.id}`} className="text-primary-600 hover:text-primary-900 font-bold bg-primary-50 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors text-xs border border-primary-100">
                                            Ver Dossiê
                                        </Link>
                                        <DeleteLeadButton leadId={lead.id} leadName={lead.nome} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
