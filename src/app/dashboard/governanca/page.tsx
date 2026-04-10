import React from 'react';

export default function GovernancaPage() {
    const reunioes = [
        { id: 1, titulo: 'Votação: Escolha do Construtor Sustentável', data: '24/10/2026', status: 'Aberta' },
        { id: 2, titulo: 'Apresentação do Projeto Hidráulico (Água de Reúso)', data: '10/10/2026', status: 'Concluída' },
        { id: 3, titulo: 'Definição das Regras do Coworking', data: '05/11/2026', status: 'Agendada' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary-900">Fórum de Governança</h1>
                <p className="text-gray-600 mt-2">Participe das decisões da Vila Botânica de forma transparente.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-secondary-100 shadow-sm flex flex-col items-center text-center">
                    <div className="text-3xl mb-2">🗳️</div>
                    <h3 className="font-semibold text-lg text-primary-900">Votações Abertas</h3>
                    <p className="text-3xl font-bold text-primary-500 mt-2">1</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-secondary-100 shadow-sm flex flex-col items-center text-center">
                    <div className="text-3xl mb-2">📄</div>
                    <h3 className="font-semibold text-lg text-primary-900">Estatuto Aprovado</h3>
                    <p className="text-sm font-medium text-green-600 mt-2 bg-green-50 px-3 py-1 rounded-full">Versão 2.1 Final</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-secondary-100 shadow-sm flex flex-col items-center text-center">
                    <div className="text-3xl mb-2">🤝</div>
                    <h3 className="font-semibold text-lg text-primary-900">Nível de Consenso</h3>
                    <p className="text-3xl font-bold text-primary-500 mt-2">94%</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-secondary-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-secondary-100">
                    <h2 className="text-xl font-bold text-primary-900">Pautas e Assembleias</h2>
                </div>
                <div className="divide-y divide-secondary-100">
                    {reunioes.map((reuniao) => (
                        <div key={reuniao.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h4 className="text-lg font-medium text-gray-900">{reuniao.titulo}</h4>
                                <p className="text-sm text-gray-500 mt-1">Data: {reuniao.data}</p>
                            </div>
                            <div>
                                <span className={`
                  px-3 py-1 text-xs font-semibold rounded-full
                  ${reuniao.status === 'Aberta' ? 'bg-blue-100 text-blue-800' : ''}
                  ${reuniao.status === 'Concluída' ? 'bg-green-100 text-green-800' : ''}
                  ${reuniao.status === 'Agendada' ? 'bg-yellow-100 text-yellow-800' : ''}
                `}>
                                    {reuniao.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
