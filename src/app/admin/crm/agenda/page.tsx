import React from 'react';
import { getAllLeads } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CRMAgendaPage() {
    const leads = await getAllLeads();
    
    // Filtrar leads que possuem contato agendado e ordenar por data
    const agenda = leads
        .filter(l => l.proximoContato)
        .sort((a, b) => new Date(a.proximoContato!).getTime() - new Date(b.proximoContato!).getTime());

    const isToday = (dateStr: string) => {
        const today = new Date().toISOString().split('T')[0];
        return dateStr === today;
    };

    const isPast = (dateStr: string) => {
        const today = new Date().toISOString().split('T')[0];
        return dateStr < today;
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Agenda de Contatos</h1>
                    <p className="text-gray-500 mt-1">Acompanhe seus próximos compromissos e follow-ups.</p>
                </div>
                <Link href="/admin/crm" className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                    Voltar para Leads
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Coluna: Atrasados */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                        Atrasados
                    </h3>
                    <div className="space-y-3">
                        {agenda.filter(l => isPast(l.proximoContato!)).length === 0 ? (
                            <p className="text-xs text-gray-400 italic">Nenhum contato atrasado.</p>
                        ) : (
                            agenda.filter(l => isPast(l.proximoContato!)).map(lead => (
                                <Link href={`/admin/crm/lead/${lead.id}`} key={lead.id} className="block bg-white p-4 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-red-500">
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-gray-900 text-sm">{lead.nome}</span>
                                        <span className="text-[10px] font-bold text-red-600">{new Date(lead.proximoContato!).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 truncate">{lead.notasCrm || 'Sem observações.'}</p>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Coluna: Hoje */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                        Hoje
                    </h3>
                    <div className="space-y-3">
                        {agenda.filter(l => isToday(l.proximoContato!)).length === 0 ? (
                            <p className="text-xs text-gray-400 italic">Nenhum contato para hoje.</p>
                        ) : (
                            agenda.filter(l => isToday(l.proximoContato!)).map(lead => (
                                <Link href={`/admin/crm/lead/${lead.id}`} key={lead.id} className="block bg-white p-4 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-orange-500">
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-gray-900 text-sm">{lead.nome}</span>
                                        <span className="text-[10px] font-bold text-orange-600">HOJE</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 truncate">{lead.notasCrm || 'Sem observações.'}</p>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Coluna: Próximos */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-primary-600 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                        Próximos Dias
                    </h3>
                    <div className="space-y-3">
                        {agenda.filter(l => !isToday(l.proximoContato!) && !isPast(l.proximoContato!)).length === 0 ? (
                            <p className="text-xs text-gray-400 italic">Sem agendamentos futuros.</p>
                        ) : (
                            agenda.filter(l => !isToday(l.proximoContato!) && !isPast(l.proximoContato!)).map(lead => (
                                <Link href={`/admin/crm/lead/${lead.id}`} key={lead.id} className="block bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-primary-500">
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-gray-900 text-sm">{lead.nome}</span>
                                        <span className="text-[10px] font-bold text-gray-400">{new Date(lead.proximoContato!).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 truncate">{lead.notasCrm || 'Sem observações.'}</p>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
