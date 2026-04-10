'use client';

import React, { useState } from 'react';

const categorias = [
    {
        id: 'mobilidade',
        titulo: 'Mobilidade & Transporte',
        icone: '🚲',
        cor: 'bg-emerald-100 text-emerald-700',
        itens: [
            { id: 1, nome: 'Bicicleta Urbana (Aro 29)', dono: 'Carlos M.', status: 'Disponível' },
            { id: 2, nome: 'Vaga de Carona (Centro)', dono: 'Ana Lúcia', status: 'Hoje às 18h' },
            { id: 3, nome: 'Carro Compartilhado', dono: 'Comunidade', status: 'Em Uso' },
        ]
    },
    {
        id: 'ferramentas',
        titulo: 'Oficina & Ferramentas',
        icone: '🛠️',
        cor: 'bg-orange-100 text-orange-700',
        itens: [
            { id: 4, nome: 'Furadeira de Impacto', dono: 'Roberto F.', status: 'Disponível' },
            { id: 5, nome: 'Caixa de Ferramentas Completa', dono: 'Studio Be', status: 'Disponível' },
            { id: 6, nome: 'Escada de Alumínio (3m)', dono: 'Sílvia C.', status: 'Em Uso' },
        ]
    },
    {
        id: 'utilidades',
        titulo: 'Utilidades Domésticas',
        icone: '🔌',
        cor: 'bg-blue-100 text-blue-700',
        itens: [
            { id: 7, nome: 'Aspirador de Pó (Água e Pó)', dono: 'Juliana P.', status: 'Disponível' },
            { id: 8, nome: 'Máquina de Lavar Alta-Pressão', dono: 'Studio Be', status: 'Em Uso' },
            { id: 9, nome: 'Máquina de Costura', dono: 'Camila T.', status: 'Disponível' },
        ]
    },
    {
        id: 'lazer',
        titulo: 'Lazer & Cultura',
        icone: '📚',
        cor: 'bg-purple-100 text-purple-700',
        itens: [
            { id: 10, nome: 'Projetor de Vídeo HD', dono: 'Marcos R.', status: 'Reservado' },
            { id: 11, 'nome': 'Jogos de Tabuleiro Modernos', dono: 'Biblioteca', status: 'Disponível' },
            { id: 12, nome: 'Tenda para Eventos (3x3)', dono: 'Studio Be', status: 'Disponível' },
        ]
    }
];

export default function SustentabilidadePage() {
    const [alerta, setAlerta] = useState('');

    const handleSolicitar = (nomeItem: string) => {
        setAlerta(`Sua solicitação para usar "${nomeItem}" foi enviada ao proprietário! Aguarde a confirmação.`);
        setTimeout(() => setAlerta(''), 5000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header da Página */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
                        Economia Circular
                    </div>
                    <h1 className="text-3xl font-bold text-primary-900 tracking-tight">Projetos Sustentáveis</h1>
                    <p className="text-gray-500 mt-2 max-w-2xl">
                        Compartilhe recursos, reduza custos e fortaleça os laços da comunidade. Solicite itens emprestados ou ofereça algo que você tem.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setAlerta('A funcionalidade de cadastrar novos itens será liberada na próxima atualização da plataforma.');
                        setTimeout(() => setAlerta(''), 5000);
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Compartilhar Item
                </button>
            </div>

            {/* Alerta Temporal */}
            {alerta && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4">
                    <svg className="w-6 h-6 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="font-semibold">{alerta}</span>
                </div>
            )}

            {/* Grid de Compartilhamento */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {categorias.map(cat => (
                    <div key={cat.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-50">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${cat.cor}`}>
                                {cat.icone}
                            </div>
                            <h2 className="text-xl font-bold text-primary-900">{cat.titulo}</h2>
                        </div>

                        <div className="space-y-4">
                            {cat.itens.map(item => (
                                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all gap-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{item.nome}</h3>
                                        <p className="text-sm text-gray-500 mt-1">Proprietário: {item.dono}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${item.status === 'Disponível' ? 'bg-green-100 text-green-700' : item.status === 'Em Uso' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {item.status}
                                        </span>
                                        <button
                                            onClick={() => handleSolicitar(item.nome)}
                                            disabled={item.status === 'Em Uso'}
                                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${item.status === 'Em Uso' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white border border-primary-200 hover:border-primary-600'}`}
                                        >
                                            {item.status === 'Em Uso' ? 'Indisponível' : 'Solicitar'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
