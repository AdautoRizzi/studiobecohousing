import React from 'react';
import { getLeadById, getAllLeads, getInteractionsByLead, getMessageTemplates } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { updateLeadStatusAction } from '@/app/actions';
import { MessageSender } from '@/components/crm/MessageSender';
import EmailSender from '@/components/crm/EmailSender';
import LogInteractionForm from '@/components/LogInteractionForm';
import DeleteLeadButton from '@/components/crm/DeleteLeadButton';

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
        
        const myInteresses = lead.interesses || [];
        const myValores = lead.valores || [];
        const myEmpreender = lead.empreender || [];
        
        const otherInteresses = otherLead.interesses || [];
        const otherValores = otherLead.valores || [];
        const otherEmpreender = otherLead.empreender || [];

        let maxScore = myInteresses.length + myValores.length + myEmpreender.length;
        if (maxScore === 0) maxScore = 1;

        let matches: string[] = [];

        myInteresses.forEach(i => { if (otherInteresses.includes(i)) { score++; matches.push(i); } });
        myValores.forEach(v => { if (otherValores.includes(v)) { score++; matches.push(v); } });
        myEmpreender.forEach(e => { if (otherEmpreender.includes(e)) { score++; matches.push(e); } });

        if (lead.ondeMorar && lead.ondeMorar === otherLead.ondeMorar) score += 2;
        if (lead.tipologia && lead.tipologia === otherLead.tipologia) score += 1;
        maxScore += 3;

        return {
            otherLead,
            percentage: Math.round((score / maxScore) * 100),
            matches
        };
    };

    const matches = allLeads.map(calculateMatch).sort((a, b) => b.percentage - a.percentage).slice(0, 10);

    const sameRegionLeads = allLeads.filter(l => 
        l.ondeMorar && 
        lead.ondeMorar && 
        l.ondeMorar.toLowerCase().trim() === lead.ondeMorar.toLowerCase().trim()
    );

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
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                        <DeleteLeadButton leadId={lead.id} leadName={lead.nome} />
                        <div className="bg-primary-50 px-4 py-2 rounded-xl text-primary-800 font-bold border border-primary-200">
                            Status: {lead.status}
                        </div>
                    </div>
                    {lead.proximoContato && (
                        <div className="bg-orange-50 px-3 py-1 rounded-lg text-orange-700 text-xs font-bold border border-orange-200 flex items-center gap-1.5 animate-pulse">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Agendado para: {new Date(lead.proximoContato).toLocaleDateString('pt-BR')}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna 1: Dados do Cliente */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Dossiê do Candidato</h2>
                                <p className="text-sm text-gray-500 mt-1">Todas as respostas coletadas no questionário de afinidade.</p>
                            </div>
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
                                if (missing.length === 0) return <span className="text-xs font-bold bg-green-100 text-green-700 px-4 py-2 rounded-full border border-green-200">Perfil 100% Completo</span>;
                                return <span className="text-xs font-bold bg-orange-100 text-orange-700 px-4 py-2 rounded-full border border-orange-200">Pendente: {missing.length} itens</span>;
                            })()}
                        </div>

                        <div className="space-y-10">
                            {/* Grupo 1: Identificação */}
                            <section>
                                <h3 className="text-xs font-bold text-secondary-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-secondary-500 rounded-full"></span>
                                    1. Identificação e Perfil
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Nome Completo</label>
                                        <p className="font-bold text-gray-900">{lead.nome}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">E-mail</label>
                                        <p className="font-medium text-gray-900">{lead.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">WhatsApp / Telefone</label>
                                        <p className={`font-bold ${!lead.telefone ? 'text-red-500 italic' : 'text-gray-900'}`}>{lead.telefone || 'Não informado'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Idade</label>
                                        <p className="font-medium text-gray-900">{lead.idade || 'Não informado'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Gênero</label>
                                        <p className="font-medium text-gray-900">{lead.genero || 'Não informado'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Profissão</label>
                                        <p className={`font-medium ${!lead.profissao ? 'text-red-500 italic' : 'text-gray-900'}`}>{lead.profissao || 'Não informado'}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Grupo 2: Momento de Vida */}
                            <section>
                                <h3 className="text-xs font-bold text-secondary-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-secondary-500 rounded-full"></span>
                                    2. Moradia e Localização
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Onde mora atualmente?</label>
                                        <p className="font-medium text-gray-900">{lead.moradiaAtual || 'Não informado'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Onde deseja morar?</label>
                                        <p className={`font-bold ${!lead.ondeMorar ? 'text-red-500 italic' : 'text-primary-700'}`}>{lead.ondeMorar || 'Não informado'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Preferência de Ambiente</label>
                                        <p className="font-medium text-gray-900">{lead.tipoCohousing || 'Não informado'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Tipologia Desejada</label>
                                        <p className="font-medium text-gray-900">{lead.tipologia || 'Não informado'}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Grupo 3: Estrutura Familiar */}
                            <section>
                                <h3 className="text-xs font-bold text-secondary-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-secondary-500 rounded-full"></span>
                                    3. Configuração da Residência
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Com quem irá morar?</label>
                                        <p className="font-medium text-gray-900">{lead.comQuem || 'Não informado'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Total de Pessoas</label>
                                        <p className="font-bold text-gray-900">{lead.totalPessoas || '1'} pessoa(s)</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Área Estimada</label>
                                        <p className="font-medium text-gray-900">{lead.areaResidencia || 'Não informado'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Quartos</label>
                                        <p className="font-medium text-gray-900">{lead.dormitorios || '0'} dormitório(s)</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Suítes</label>
                                        <p className="font-medium text-gray-900">{lead.suites || '0'} suíte(s)</p>
                                    </div>
                                </div>
                            </section>

                            {/* Grupo 4: Afinidades (Tags) */}
                            <section className="space-y-6">
                                <h3 className="text-xs font-bold text-secondary-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-secondary-500 rounded-full"></span>
                                    4. Interesses e Propósitos
                                </h3>
                                
                                <div className="space-y-6 px-2">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-3">Interesses & Atividades Coletivas</label>
                                        <div className="flex flex-wrap gap-2">
                                            {(lead.interesses || []).length > 0 ? (
                                                lead.interesses.map(i => <span key={i} className="px-3 py-1.5 bg-primary-50 text-primary-700 font-medium rounded-lg text-sm border border-primary-100">{i}</span>)
                                            ) : (
                                                <span className="text-sm text-red-400 italic bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">Nenhum interesse selecionado</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-3">Valores Fundamentais no Cohousing</label>
                                        <div className="flex flex-wrap gap-2">
                                            {(lead.valores || []).length > 0 ? (
                                                lead.valores.map(v => <span key={v} className="px-3 py-1.5 bg-secondary-50 text-secondary-700 font-medium border border-secondary-100 rounded-lg text-sm">{v}</span>)
                                            ) : (
                                                <span className="text-sm text-red-400 italic bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">Nenhum valor selecionado</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-3">Disponibilidade para Empreender</label>
                                        <div className="flex flex-wrap gap-2">
                                            {(lead.empreender || []).length > 0 ? (
                                                lead.empreender.map(e => <span key={e} className="px-3 py-1.5 bg-blue-50 text-blue-700 font-medium border border-blue-100 rounded-lg text-sm">{e}</span>)
                                            ) : (
                                                <span className="text-sm text-red-400 italic bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">Interesse em empreender não selecionado</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Grupo 5: Observações */}
                            <section>
                                <h3 className="text-xs font-bold text-secondary-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-secondary-500 rounded-full"></span>
                                    5. Considerações do Cliente
                                </h3>
                                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    {lead.observacoes ? (
                                        <p className="text-sm text-gray-700 italic leading-relaxed">
                                            &quot;{lead.observacoes}&quot;
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">
                                            Nenhuma observação informada.
                                        </p>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Registro de Atividade Manual */}
                    <LogInteractionForm leadId={lead.id} />

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
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-primary-600 uppercase">
                                                        {it.type === 'Ligação' && '📞 '}
                                                        {it.type === 'Reunião' && '👥 '}
                                                        {it.type === 'WhatsApp' && '📱 '}
                                                        {it.type === 'E-mail' && '✉️ '}
                                                        {it.type || 'Sistema'}
                                                    </span>
                                                </div>
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

                    {/* Componente de Envio de E-mail */}
                    <EmailSender lead={lead} />

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
                                <label className="text-xs font-bold text-gray-500 uppercase">Agendar Próximo Contato</label>
                                <input 
                                    type="date" 
                                    name="proximoContato" 
                                    defaultValue={lead.proximoContato || ''} 
                                    className="w-full h-10 px-3 rounded-lg border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500"
                                />
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
                            Top 10 Matches
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

                    {/* Mesma Região */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Mesma Região ({lead.ondeMorar || 'N/A'})
                        </h3>
                        {sameRegionLeads.length === 0 ? (
                            <p className="text-xs text-gray-500">Nenhum outro lead encontado para esta região.</p>
                        ) : (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {sameRegionLeads.map(l => (
                                    <div key={l.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col gap-1">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-sm text-gray-900 truncate mr-2">{l.nome}</span>
                                            <span className="text-[10px] font-bold px-2 py-1 bg-gray-200 text-gray-700 rounded-md truncate max-w-[80px]" title={l.tipologia}>{l.tipologia || 'Indefinida'}</span>
                                        </div>
                                        <Link href={`/admin/crm/lead/${l.id}`} className="text-[10px] uppercase font-bold text-primary-600 hover:text-primary-800 underline">Ver Perfil</Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
