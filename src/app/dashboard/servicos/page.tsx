'use client';

import React, { useState } from 'react';

const servicosLocais = [
    {
        id: 1,
        nome: 'João Batista',
        profissao: 'Encanador & Manutenção Hidráulica',
        descricao: 'Resolvo vazamentos, instalo torneiras e faço manutenção em geral de caixas d\'água.',
        telefone: '11 99999-9999',
        foto: '👨🔧',
        categoria: 'Manutenção',
        estrelas: 4.8,
        avaliacoes: 12
    },
    {
        id: 2,
        nome: 'Maria Silva',
        profissao: 'Cuidadora de Idosos',
        descricao: 'Experiência de 10 anos. Especializada em companhia, passeios e administração de medicamentos leves.',
        telefone: '11 99999-8888',
        foto: '👩⚕️',
        categoria: 'Saúde & Bem-Estar',
        estrelas: 5.0,
        avaliacoes: 34
    },
    {
        id: 3,
        nome: 'Luiz Carlos',
        profissao: 'Eletricista Residencial',
        descricao: 'Instalação de tomadas, reparos em chuveiros, revisão de quadros elétricos e automação simples.',
        telefone: '11 99999-7777',
        foto: '⚡',
        categoria: 'Manutenção',
        estrelas: 4.5,
        avaliacoes: 8
    },
    {
        id: 4,
        nome: 'Ana Paula',
        profissao: 'Estação de Beleza (Manicure)',
        descricao: 'Atendimento a domicílio para unhas, sobrancelhas e pequenas produções.',
        telefone: '11 99999-6666',
        foto: '💅',
        categoria: 'Estética',
        estrelas: 4.9,
        avaliacoes: 22
    }
];

export default function ServicosPage() {
    const [alerta, setAlerta] = useState('');

    const handleWhatsApp = (nome: string, telefone: string) => {
        const text = encodeURIComponent(`Olá ${nome}! Sou morador da Studio Be e vi seu contato no nosso painel de Serviços Locais. Gostaria de um orçamento!`);
        window.open(`https://wa.me/55${telefone.replace(/\D/g, '')}?text=${text}`);
    };

    const handleAvaliar = (nome: string) => {
        setAlerta(`O painel de Avaliação de Estrelas para "${nome}" será ativado na próxima fase! Somente moradores que confirmarem a contratação poderão dar notas.`);
        setTimeout(() => setAlerta(''), 6000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
                        Economia Local
                    </div>
                    <h1 className="text-3xl font-bold text-primary-900 tracking-tight">Serviços Locais & Parceiros</h1>
                    <p className="text-gray-500 mt-2 max-w-2xl">
                        Contrate profissionais verificados e avaliados pela própria comunidade Studio Be.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setAlerta('Para indicar um novo fornecedor, peça para ele preencher o formulário no rodapé do nosso site público!');
                        setTimeout(() => setAlerta(''), 6000);
                    }}
                    className="bg-primary-900 hover:bg-primary-800 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-transform hover:scale-105 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Indicar Fornecedor
                </button>
            </div>

            {/* Alerta Temporal */}
            {alerta && (
                <div className="bg-primary-50 text-primary-800 border border-primary-200 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4">
                    <svg className="w-6 h-6 text-primary-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-semibold">{alerta}</span>
                </div>
            )}

            {/* Grid de Serviços */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {servicosLocais.map(servico => (
                    <div key={servico.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col h-full relative overflow-hidden group">

                        {/* Status Bar Topo */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary-400 to-secondary-600"></div>

                        <div className="flex gap-5 mt-2">
                            {/* Avatar/Ícone Rápido */}
                            <div className="w-20 h-20 bg-secondary-50 border border-secondary-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner shrink-0">
                                {servico.foto}
                            </div>

                            {/* Dados Iniciais */}
                            <div className="flex-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{servico.categoria}</span>
                                <h2 className="text-xl font-bold text-gray-900 mt-1">{servico.nome}</h2>
                                <h3 className="text-primary-700 font-medium text-sm">{servico.profissao}</h3>

                                {/* Estrelinhas Dinâmicas */}
                                <div className="flex items-center gap-1 mt-2">
                                    <div className="flex text-yellow-400 text-sm">
                                        {'★'.repeat(Math.floor(servico.estrelas))}
                                        {'☆'.repeat(5 - Math.floor(servico.estrelas))}
                                    </div>
                                    <span className="text-xs font-bold text-gray-700 ml-1">{servico.estrelas} <span className="text-gray-400 font-normal">({servico.avaliacoes} reviews)</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Descrição do Profissional */}
                        <div className="mt-6 flex-1">
                            <p className="text-gray-600 text-sm italic leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 border-l-4 border-l-secondary-400">
                                "{servico.descricao}"
                            </p>
                        </div>

                        {/* Botões de Ação */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                            <button
                                onClick={() => handleAvaliar(servico.nome)}
                                className="text-gray-500 hover:text-yellow-600 font-bold text-sm flex items-center gap-1 transition-colors outline-none"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                Avaliar Profissional
                            </button>
                            <button
                                onClick={() => handleWhatsApp(servico.nome, servico.telefone)}
                                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-transform hover:scale-105 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.927 3.151.927 3.181 0 5.767-2.586 5.767-5.766 0-3.18-2.586-5.769-5.769-5.769zM12.031 15.939c-1.127 0-1.924-.343-2.613-.75l-.187-.111-1.29.339.345-1.259-.122-.194c-.45-.718-.737-1.503-.736-2.432 0-2.316 1.885-4.201 4.203-4.201 2.316 0 4.201 1.885 4.201 4.201 0 2.315-1.885 4.207-4.201 4.207z" /><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.745.448 3.385 1.228 4.821L2 22l5.356-1.168A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.423c-1.488 0-2.894-.383-4.129-1.045l-.296-.159-3.078.672.684-2.951-.174-.301A8.428 8.428 0 013.577 12c0-4.646 3.777-8.423 8.423-8.423 4.646 0 8.423 3.777 8.423 8.423 0 4.646-3.777 8.423-8.423 8.423z" /></svg>
                                Contratar
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
