'use client';

import React from 'react';
import Link from 'next/link';

export default function EventosPage() {
    const iniciativas = [
        { title: 'Coworking / Hub Criativo', status: 'Em planejamento', participants: 4, type: 'Empreendedorismo' },
        { title: 'Horta Farm-to-Table', status: 'Grupo Fechado', participants: 8, type: 'Comunitário' },
        { title: 'Oficina de Marcenaria', status: 'Aberto p/ Ideias', participants: 2, type: 'Hobby Compartilhado' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary-900">Eventos & Empreendedorismo</h1>
                <p className="text-gray-600 mt-2">Espaço para fomentar negócios locais, atividades e economia circular.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Painel de Negócios / Empreendedorismo */}
                <div className="bg-white rounded-xl border border-secondary-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-secondary-100 bg-secondary-50">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            💡 Iniciativas dos Moradores
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Ideias de negócios para funcionar nos espaços comuns</p>
                    </div>
                    <div className="p-6 flex-1">
                        <div className="space-y-4">
                            {iniciativas.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border border-secondary-100 rounded-lg hover:border-primary-200 transition-colors cursor-pointer">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1">Tipo: {item.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded mb-1 inline-block">
                                            {item.status}
                                        </span>
                                        <p className="text-xs text-gray-500">🤝 {item.participants} interessados</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 border-t border-secondary-100 bg-gray-50 text-center">
                        <Link href="/em-construcao" className="text-primary-800 font-medium text-sm hover:underline block w-full">
                            + Propor Novo Negócio/Iniciativa
                        </Link>
                    </div>
                </div>

                {/* Calendário de Eventos */}
                <div className="bg-white rounded-xl border border-secondary-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-secondary-100">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            📅 Próximos Eventos
                        </h2>
                    </div>
                    <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="text-6xl mb-4">🎪</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Visita ao Terreno da Vila</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-sm">
                            Sábado, 15 de Novembro às 09:00.<br />
                            Teremos um café da manhã coletivo para conversarmos sobre a topografia do local com o engenheiro.
                        </p>
                        <Link href="/em-construcao" className="inline-flex items-center justify-center bg-primary-800 text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-primary-900 transition-colors w-full sm:w-auto">
                            Confirmar Presença (RSVP)
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
