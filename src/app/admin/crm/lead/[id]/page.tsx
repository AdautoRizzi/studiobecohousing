import React from 'react';
import { getLeadById, getAllLeads, getInteractionsByLead, getMessageTemplates } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { updateLeadStatusAction } from '@/app/actions';
import { MessageSender } from '@/components/crm/MessageSender';

export const dynamic = 'force-dynamic';

export default async function LeadProfilePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const lead = await getLeadById(params.id);
    
    if (!lead) {
        redirect('/admin/crm');
    }

    const allLeads = (await getAllLeads()).filter(l => l.id !== lead.id);
    const interactions = await getInteractionsByLead(lead.id);
    const templates = await getMessageTemplates();

    // Algoritmo de Match Simples
    const calculateMatch = (otherLead: any) => {
        let score = 0;
        let maxScore = lead.interesses.length + lead.valores.length + lead.empreender.length;
        if (maxScore === 0) maxScore = 1;

        let matches: string[] = [];

        lead.interesses.forEach(i => { if (otherLead.interesses.includes(i)) { score++; matches.push(i); } });
        lead.valores.forEach(v => { if (otherLead.valores.includes(v)) { score++; matches.push(v); } });
        lead.empreender.forEach(e => { if (otherLead.empreender.includes(e)) { score++; matches.push(e); } });

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
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold text-gray-900">Ficha Completa do Questionário</h2>
                            {(() => {
                                const fields = [
                                    { label: 'Telefone', val: lead.telefone },
                                    { label: 'Profissão', val: lead.profissao },
                                    { label: 'Onde Morar', val: lead.ondeMorar },
                                    { label: 'Tipo Localização', val: lead.tipoCohousing },
                                    { label: 'Área Residência', val: lead.areaResidencia },
                                    { label: 'Interesses', val: (lead.interesses || []).length > 0 },
                                    { label: 'Valores', val: (lead.valores || []).length > 0 },
                                    { label: 'Empreender', val: (lead.empreender || []).length > 0 }
                                ];
                                const missing = fields.filter(f => !f.val).map(f => f.label);
                                if (missing.length === 0) return <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">Cadastro 100% Completo</span>;
                                return <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Faltam {missing.length} informações</span>;
                            })()}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Contato</span>
                                <p className="font-medium text-gray-900">{lead.email}</p>
                                <p className={`font-medium ${!lead.telefone ? 'text-red-400 italic text-sm' : 'text-gray-900'}`}>{lead.telefone || 'Telefone não informado'}</p>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Perfil</span>
                                <p className="font-medium text-gray-900">{lead.idade} • {lead.genero}</p>
                                <p className={`font-medium ${!lead.profissao ? 'text-red-400 italic text-sm' : 'text-gray-900'}`}>{lead.profissao || 'Profissão não informada'}</p>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Localização & Desejo</span>
                                <p className={`font-medium ${!lead.ondeMorar ? 'text-red-400 italic' : 'text-primary-600'}`}>{lead.ondeMorar || 'Não informou onde quer morar'}</p>
                                <p className="text-xs text-gray-500">Mora atualmente: {lead.moradiaAtual}</p>
                                <p className="text-xs text-gray-500 mt-1">Preferência: <span className="font-bold">{lead.tipoCohousing || 'Não informada'}</span></p>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Configuração da Moradia</span>
                                <p className="font-medium text-gray-900">{lead.comQuem} ({lead.totalPessoas} pessoas)</p>
                                <p className="font-medium text-gray-900">{lead.tipologia} • {lead.areaResidencia}</p>
                                <p className="text-xs text-gray-500">{lead.dormitorios} dormitórios / {lead.suites} suítes</p>
                            </div>
                        </div>

                        {/* Audit de Pendências */}
                        {(() => {
                            const fields = [
                                { label: 'Telefone', val: lead.telefone },
                                { label: 'Profissão', val: lead.profissao },
                                { label: 'Tipo de Localização', val: lead.tipoCohousing },
                                { label: 'Área da Residência', val: lead.areaResidencia },
                                { label: 'Interesses', val: (lead.interesses || []).length > 0 },
                                { label: 'Valores', val: (lead.valores || []).length > 0 },
                                { label: 'Empreendedorismo', val: (lead.empreender || []).length > 0 }
                            ];
                            const missing = fields.filter(f => !f.val);
                            if (missing.length > 0) {
                                return (
                                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                                        <h4 className="text-xs font-bold text-red-700 uppercase mb-2">Informações Ausentes:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {missing.map(f => <span key={f.label} className="text-xs bg-white text-red-600 px-2 py-1 rounded border border-red-200">{f.label}</span>)}
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        <div className="mt-8 space-y-6 border-t border-gray-50 pt-6">
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Interesses & Atividades Coletivas</span>
                                <div className="flex flex-wrap gap-2">
                                    {(lead.interesses || []).length > 0 ? (
                                        lead.interesses.map(i => <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{i}</span>)
                                    ) : (
                                        <span className="text-sm text-red-400 italic">Nenhum interesse selecionado</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Valores Fundamentais no Cohousing</span>
                                <div className="flex flex-wrap gap-2">
                                    {(lead.valores || []).length > 0 ? (
                                        lead.valores.map(v => <span key={v} className="px-3 py-1 bg-secondary-50 text-secondary-700 border border-secondary-100 rounded-full text-sm">{v}</span>)
                                    ) : (
                                        <span className="text-sm text-red-400 italic">Nenhum valor selecionado</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Disponibilidade para Empreender</span>
                                <div className="flex flex-wrap gap-2">
                                    {(lead.empreender || []).length > 0 ? (
                                        lead.empreender.map(e => <span key={e} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm">{e}</span>)
                                    ) : (
                                        <span className="text-sm text-red-400 italic">Interesse em empreender não selecionado</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Histórico de Mensagens */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Histórico de Relacionamento
                        </h2>
                        
                        {interactions.length === 0 ? (
                            <p className="text-gray-500 text-center py-10 border border-dashed border-gray-200 rounded-2xl">
                                Nenhuma mensagem enviada ainda via robô.
                            </p>
                        ) : (
                            <div className="space-y-6">
                                {interactions.map((it, idx) => (
                                    <div key={idx} className="flex gap-4 items-start border-l-2 border-primary-100 pl-4 relative">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary-500 rounded-full border-4 border-white"></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-primary-600 uppercase">WhatsApp Enviado</span>
                                                <span className="text-xs text-gray-400">{new Date(it.sent_at).toLocaleString('pt-BR')}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 whitespace-pre-wrap">{it.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Coluna 2: Ações */}
                <div className="space-y-6">
                    {/* Componente de Envio de Mensagem */}
                    <MessageSender leadId={lead.id} leadNome={lead.nome} templates={templates} />

                    <form action={updateLeadStatusAction} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4">Atualizar Lead</h3>
                        <input type="hidden" name="leadId" value={lead.id} />
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Status do Funil</label>
                                <select name="status" defaultValue={lead.status} className="w-full h-10 px-3 rounded-lg border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                                    <option value="Novo">Novo</option>
                                    <option value="Contatado">Contatado</option>
                                    <option value="Qualificado">Qualificado</option>
                                    <option value="Turma Atribuída">Turma Atribuída</option>
                                    <option value="Descartado">Descartado</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Notas Adicionais</label>
                                <textarea name="notasCrm" defaultValue={lead.notasCrm} rows={4} className="w-full p-3 rounded-lg border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm" placeholder="Anote reuniões, chamadas ou impressões gerais..."></textarea>
                            </div>
                            <button type="submit" className="w-full bg-primary-600 text-white font-bold h-10 rounded-lg hover:bg-primary-700 transition-colors">
                                Salvar Atualizações
                            </button>
                        </div>
                    </form>

                    {/* Afinidade */}
                    <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-6 rounded-3xl shadow-sm text-white">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Match de Afinidade
                        </h3>
                        <div className="space-y-3">
                            {matches.map((m, idx) => (
                                <div key={idx} className="bg-white/10 p-3 rounded-xl border border-white/10">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm truncate mr-2">{m.otherLead.nome}</span>
                                        <span className="text-secondary-400 font-extrabold">{m.percentage}%</span>
                                    </div>
                                    <Link href={`/admin/crm/lead/${m.otherLead.id}`} className="text-[10px] uppercase font-bold text-primary-200 hover:text-white underline">Ver Perfil</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
