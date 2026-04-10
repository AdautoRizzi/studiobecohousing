'use client';

import React, { useState } from 'react';

// Tabela de Meses (Booleans determinam se há bolinha verde ou não)
const calendarioEspecies = [
    { id: 1, nome: 'Tomate Cereja', categoria: 'Hortaliça', local: 'Horta Comunitária (Ca...', icone: '🍅', meses: [true, true, true, true, false, false, false, false, true, true, true, true] },
    { id: 2, nome: 'Limão Siciliano', categoria: 'Fruta', local: 'Pomar Central', icone: '🍋', meses: [true, true, true, true, true, true, true, true, true, true, true, true] },
    { id: 3, nome: 'Manjericão', categoria: 'Erva/Tempero', local: 'Horta Alta (Perto da Co...', icone: '🌿', meses: [true, true, true, false, false, false, false, false, true, true, true, true] },
    { id: 4, nome: 'Morango', categoria: 'Fruta', local: 'Estufa Comunitária', icone: '🍓', meses: [false, false, false, false, false, false, true, true, true, true, true, false] },
    { id: 5, nome: 'Alface Crespa', categoria: 'Hortaliça', local: 'Horta Comunitária (Ca...', icone: '🥬', meses: [false, false, false, true, true, true, true, true, true, false, false, false] },
    { id: 6, nome: 'Ora-pro-nóbis', categoria: 'PANC', local: 'Cerca Viva Sul', icone: '🌿', meses: [true, true, true, true, true, true, true, true, true, true, true, true] },
    { id: 7, nome: 'Alecrim', categoria: 'Erva/Tempero', local: 'Horta Alta', icone: '🌿', meses: [true, true, true, true, true, true, true, true, true, true, true, true] }
];

const mesesAbrev = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const agendaRega = [
    { dia: 'Segunda-feira', reponsavel: 'Família Souza', horario: '07:00 / 18:00' },
    { dia: 'Terça-feira', reponsavel: 'Adauto Rizzi', horario: '07:00 / 18:00' },
    { dia: 'Quarta-feira', reponsavel: 'Cláudia Bertucci', horario: '07:00 / 18:00' }
];

export default function HortaPage() {
    const [alerta, setAlerta] = useState('');
    const [filtro, setFiltro] = useState('Todas'); // Todas, Hortaliça, Fruta, Erva/Tempero, PANC

    const handleAcao = (acao: string) => {
        setAlerta(`✔️ "${acao}" cadastrado com sucesso! A moderação foi notificada.`);
        setTimeout(() => setAlerta(''), 5000);
    };

    const especiesFiltradas = filtro === 'Todas' ? calendarioEspecies : calendarioEspecies.filter(e => e.categoria === filtro);

    return (
        <div className="space-y-10 animate-in fade-in duration-500 overflow-x-hidden">
            {/* Header / Titulo */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                <div className="flex items-start gap-4">
                    <span className="text-5xl mt-1">🌱</span>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Calendário da Horta & Jardim</h1>
                        <p className="text-gray-500 mt-2 max-w-2xl text-sm leading-relaxed">
                            Acompanhe as épocas ideais de plantio, colheita e os ciclos das espécies cultivadas nas áreas comuns da nossa comunidade.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => handleAcao('Interesse em Oficinas de Plantio')}
                    className="bg-green-600/10 text-green-700 hover:bg-green-600 hover:text-white px-6 py-3 rounded-full font-bold shadow-sm transition-all flex items-center gap-2 whitespace-nowrap border border-green-200"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Sugerir Plantio
                </button>
            </div>

            {/* Painéis Superiores */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-2xl p-5 border border-green-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🥬</span>
                        <div>
                            <span className="text-xs font-bold text-green-700 uppercase">Hortaliças</span>
                            <div className="text-2xl font-bold text-green-900">3</div>
                        </div>
                    </div>
                </div>

                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🍊</span>
                        <div>
                            <span className="text-xs font-bold text-orange-700 uppercase">Frutas</span>
                            <div className="text-2xl font-bold text-orange-900">3</div>
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🌿</span>
                        <div>
                            <span className="text-xs font-bold text-emerald-700 uppercase">Ervas & Temperos</span>
                            <div className="text-2xl font-bold text-emerald-900">2</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleAcao('Mutirão de Sábado aceito')}>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🐝</span>
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Próximo Mutirão</span>
                            <div className="text-sm font-bold text-gray-900 mt-1">Sáb, 15/05 09h</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
                {['Todas', 'Hortaliça', 'Fruta', 'Erva/Tempero', 'PANC'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFiltro(f)}
                        className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${f === filtro ? 'bg-primary-800 text-white border-primary-800' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Alerta */}
            {alerta && (
                <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4">
                    <span className="font-semibold text-sm">{alerta}</span>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

                {/* Calendário Analítico (3 Colunas no Desktop) */}
                <div className="xl:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-500 text-xs text-center font-bold tracking-wider">
                                    <th className="py-4 px-6 text-left w-1/4">Espécie / Local</th>
                                    {mesesAbrev.map(mes => (
                                        <th key={mes} className="py-4 border-l border-gray-50 w-[6%]">{mes}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {especiesFiltradas.map((especie) => (
                                    <tr key={especie.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">{especie.icone}</div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm">{especie.nome}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${especie.categoria === 'Hortaliça' ? 'bg-green-100 text-green-700' :
                                                                especie.categoria === 'Fruta' ? 'bg-orange-100 text-orange-700' :
                                                                    especie.categoria === 'PANC' ? 'bg-teal-100 text-teal-700' :
                                                                        'bg-emerald-100 text-emerald-700'
                                                            }`}>
                                                            {especie.categoria}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-medium truncate max-w-[120px]">📍 {especie.local}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {especie.meses.map((temBolota, idx) => (
                                            <td key={idx} className="py-4 border-l border-gray-50 text-center">
                                                {temBolota && (
                                                    <div className="w-5 h-5 rounded-full bg-primary-600/90 shadow-sm border-[3px] border-primary-100/50 mx-auto"></div>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Coluna Lateral: Mural e Ideias Novas */}
                <div className="space-y-6">
                    {/* Agenda de Rega */}
                    <div className="bg-primary-900 rounded-3xl p-6 shadow-xl text-white">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            Escalas da Semana
                        </h2>

                        <div className="space-y-4">
                            {agendaRega.map((dia, idx) => (
                                <div key={idx} className="bg-primary-800/50 backdrop-blur-sm p-3 rounded-xl border border-primary-700/50">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-primary-200 font-bold text-xs uppercase tracking-wider">{dia.dia}</span>
                                        <span className="text-xs font-mono text-primary-300">{dia.horario}</span>
                                    </div>
                                    <div className="text-white text-sm font-medium">{dia.reponsavel}</div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handleAcao('Assumir um turno de Rega')}
                            className="w-full mt-6 bg-white text-primary-900 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Quero me Voluntariar
                        </button>
                    </div>

                    {/* Mural da Colheita & Sementes */}
                    <div className="bg-yellow-50 rounded-3xl p-6 border border-yellow-100">
                        <h3 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Mural da Colheita
                        </h3>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200 relative">
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">NOVO</span>
                            <p className="text-sm text-gray-700 font-medium">
                                "Temos mudas de <span className="text-green-700 font-bold">Tomate Cereja</span> prontas para doação no Banco de Sementes hoje à tarde!"
                            </p>
                            <span className="text-xs text-gray-400 mt-2 block">- Dna. Maria (Casa 12)</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
