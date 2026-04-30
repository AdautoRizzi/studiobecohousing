import React from 'react';
import { getLeadById, getAllLeads } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { updateLeadStatusAction } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function LeadProfilePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const lead = getLeadById(params.id);
    
    if (!lead) {
        redirect('/admin/crm');
    }

    const allLeads = getAllLeads().filter(l => l.id !== lead.id);

    // Algoritmo de Match Simples
    const calculateMatch = (otherLead: any) => {
        let score = 0;
        let maxScore = lead.interesses.length + lead.valores.length + lead.empreender.length;
        if (maxScore === 0) maxScore = 1; // avoid division by zero

        let matches = [];

        lead.interesses.forEach(i => { if (otherLead.interesses.includes(i)) { score++; matches.push(i); } });
        lead.valores.forEach(v => { if (otherLead.valores.includes(v)) { score++; matches.push(v); } });
        lead.empreender.forEach(e => { if (otherLead.empreender.includes(e)) { score++; matches.push(e); } });

        // Bonus for same region and typoloy
        if (lead.ondeMorar === otherLead.ondeMorar) score += 2;
        if (lead.tipologia === otherLead.tipologia) score += 1;
        maxScore += 3;

        return {
            otherLead,
            percentage: Math.round((score / maxScore) * 100),
            matches
        };
    };

    const matches = allLeads.map(calculateMatch).sort((a, b) => b.percentage - a.percentage).slice(0, 3);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/crm" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{lead.nome}</h1>
                        <p className="text-gray-500 mt-1">Cadastrado em {new Date(lead.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
                <div className="bg-primary-50 px-4 py-2 rounded-xl text-primary-800 font-bold border border-primary-200">
                    Status: {lead.status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna 1: Dados do Cliente */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Ficha do Cliente</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Contato</span>
                                <p className="font-medium text-gray-900">{lead.email}</p>
                                <p className="font-medium text-gray-900">{lead.telefone || 'Não informado'}</p>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Perfil</span>
                                <p className="font-medium text-gray-900">{lead.idade} • {lead.genero}</p>
                                <p className="font-medium text-gray-900">{lead.profissao}</p>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Localização</span>
                                <p className="font-medium text-gray-900">Mora: {lead.moradiaAtual}</p>
                                <p className="font-medium text-primary-600">Busca: {lead.ondeMorar}</p>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Configuração</span>
                                <p className="font-medium text-gray-900">{lead.comQuem}</p>
                                <p className="font-medium text-gray-900">{lead.tipologia} • {lead.areaResidencia}</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-6">
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Interesses & Atividades</span>
                                <div className="flex flex-wrap gap-2">
                                    {lead.interesses.map(i => <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{i}</span>)}
                                </div>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Valores do Cohousing</span>
                                <div className="flex flex-wrap gap-2">
                                    {lead.valores.map(v => <span key={v} className="px-3 py-1 bg-secondary-50 text-secondary-700 border border-secondary-100 rounded-full text-sm">{v}</span>)}
                                </div>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Interesse em Empreender</span>
                                <div className="flex flex-wrap gap-2">
                                    {lead.empreender.map(e => <span key={e} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm">{e}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Algoritmo de Match */}
                    <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-8 rounded-3xl shadow-sm text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h2 className="text-xl font-bold">Análise de Match de Afinidade</h2>
                        </div>
                        
                        {matches.length === 0 ? (
                            <p className="text-primary-200">Não há outros leads no banco para comparar ainda.</p>
                        ) : (
                            <div className="space-y-4">
                                {matches.map((m, idx) => (
                                    <div key={idx} className="bg-white/10 border border-white/20 p-4 rounded-2xl flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg">{m.otherLead.nome}</h3>
                                            <p className="text-sm text-primary-200">{m.otherLead.idade} • {m.otherLead.ondeMorar}</p>
                                            <div className="text-xs mt-2 text-primary-100 truncate max-w-sm">
                                                Afinidades: {m.matches.join(', ')}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-extrabold text-secondary-400">{m.percentage}%</div>
                                            <Link href={`/admin/crm/lead/${m.otherLead.id}`} className="text-xs text-white underline hover:text-primary-200 mt-1 inline-block">Ver Perfil</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Coluna 2: Ações */}
                <div className="space-y-6">
                    <form action={updateLeadStatusAction} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4">Atualizar Lead</h3>
                        <input type="hidden" name="leadId" value={lead.id} />
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700">Mudar Status</label>
                                <select name="status" defaultValue={lead.status} className="w-full h-10 px-3 rounded-lg border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                                    <option value="Novo">Novo</option>
                                    <option value="Contatado">Contatado</option>
                                    <option value="Qualificado">Qualificado</option>
                                    <option value="Turma Atribuída">Turma Atribuída</option>
                                    <option value="Descartado">Descartado</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700">Notas do CRM</label>
                                <textarea name="notasCrm" defaultValue={lead.notasCrm} rows={4} className="w-full p-3 rounded-lg border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Adicione observações de ligações, reuniões..."></textarea>
                            </div>
                            <button type="submit" className="w-full bg-primary-600 text-white font-bold h-10 rounded-lg hover:bg-primary-700 transition-colors">
                                Salvar Alterações
                            </button>
                        </div>
                    </form>

                    <div className="bg-green-50 p-6 rounded-3xl shadow-sm border border-green-200">
                        <h3 className="font-bold text-green-900 mb-2">Contato Rápido</h3>
                        <p className="text-sm text-green-800 mb-4">Chame este lead diretamente no WhatsApp Web.</p>
                        <a href={`https://wa.me/55${lead.telefone?.replace(/\D/g, '')}?text=Olá ${lead.nome}, recebemos seu interesse no Studio Be!`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-bold h-10 rounded-lg hover:bg-green-600 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/></svg>
                            Abrir WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
