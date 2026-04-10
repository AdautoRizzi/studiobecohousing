'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ParceiroDashboard() {
    const [alerta, setAlerta] = useState('');

    const parceiroInfo = {
        nome: "João Batista",
        empresa: "Autônomo",
        categoria: "Manutenção & Construção",
        status: "Ativo",
        filiacao: "Parceiro desde Ago/25",
        rating: 4.8,
        reviewsCount: 12
    };

    const handleAcao = (mensagem: string) => {
        setAlerta(mensagem);
        setTimeout(() => setAlerta(''), 6000);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col md:flex-row">

            {/* Sidebar Parceiro */}
            <aside className="w-full md:w-72 bg-white border-r border-gray-100 flex-shrink-0">
                <div className="p-8 pb-4">
                    <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                        <img src="/logo.png" alt="Studio Be" className="h-14 w-auto object-contain" />
                    </Link>
                    <div className="mt-8 flex flex-col items-center">
                        <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-[3px] border-white ring-2 ring-secondary-50">
                            👨🔧
                        </div>
                        <h2 className="mt-4 font-bold text-gray-900 text-lg">{parceiroInfo.nome}</h2>
                        <span className="text-secondary-600 text-sm font-semibold">{parceiroInfo.categoria}</span>
                    </div>
                </div>

                <nav className="mt-8 px-4 space-y-1">
                    <Link href="/parceiro" className="flex items-center gap-3 px-4 py-3 bg-secondary-50 text-secondary-800 rounded-xl font-bold transition-colors hover:bg-secondary-100">
                        <svg className="w-5 h-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Meu Painel
                    </Link>
                    <button onClick={() => handleAcao('Para editar dados, acesse as "Configurações" na próxima fase.')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Ficha Técnica
                    </button>
                    <button onClick={() => handleAcao('O extrato financeiro (integração de cobrança) dependerá de APIs bancárias futuras.')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Cobranças & Ofertas
                    </button>

                    <div className="pt-8 mt-8 border-t border-gray-100">
                        <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Sair da Conta
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content Parceiro */}
            <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto space-y-8">

                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-primary-900 tracking-tight">Painel do Parceiro</h1>
                            <p className="text-gray-500 mt-1">Sua vitrine profissional dentro da Comunidade Studio Be.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-bold text-gray-700">Status: {parceiroInfo.status}</span>
                        </div>
                    </div>

                    {/* Alerta Temporal */}
                    {alerta && (
                        <div className="bg-secondary-50 text-secondary-800 border border-secondary-200 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4 shadow-sm">
                            <span className="font-semibold text-sm">{alerta}</span>
                        </div>
                    )}

                    {/* Resumo / Métricas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <svg className="w-16 h-16 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs">Sua Avaliação Média</h3>
                                <div className="mt-2 text-4xl font-extrabold text-gray-900 flex items-center gap-2">
                                    {parceiroInfo.rating} <span className="text-yellow-400 text-3xl">★</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-4 font-medium">Baseado em {parceiroInfo.reviewsCount} serviços prestados aos moradores.</p>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs">Portfólio Studio Be</h3>
                            <div className="mt-2 text-4xl font-extrabold text-primary-900">12</div>
                            <p className="text-sm text-gray-500 mt-4 font-medium">Trabalhos executados reportados via aplicativo.</p>
                        </div>

                        <div className="bg-gradient-to-br from-primary-800 to-primary-900 p-6 rounded-3xl shadow-sm border border-primary-700 text-white">
                            <h3 className="text-primary-200 font-bold uppercase tracking-wider text-xs">Visibilidade na Vila</h3>
                            <div className="mt-2 text-4xl font-extrabold flex items-center gap-2">Top 5</div>
                            <p className="text-sm text-primary-100 mt-4 leading-relaxed font-medium">Seu contato está fixado na primeira página de recomendações da aba Serviços Locais.</p>
                        </div>
                    </div>

                    {/* Aba de Feedbacks */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mt-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Últimas Recomendações (Reviews)</h2>
                            <span className="text-sm font-bold text-secondary-600 bg-secondary-50 px-3 py-1 rounded-full cursor-pointer hover:bg-secondary-100 transition-colors">Ver Todas</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Avaliação Mock 1 */}
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-sm">FC</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">Família Costa (Casa 4)</h4>
                                            <div className="flex text-yellow-400 text-xs mt-0.5">★★★★★</div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">Há 2 dias</span>
                                </div>
                                <p className="text-gray-600 mt-4 text-sm italic leading-relaxed">"O João consertou o encanamento do banheiro super rápido. Deixou tudo limpo e cobrou um preço muito justo! Super recomendo para a vila."</p>
                            </div>

                            {/* Avaliação Mock 2 */}
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">MS</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">Marta Silva (Casa 12)</h4>
                                            <div className="flex text-yellow-400 text-xs mt-0.5">★★★★☆</div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">15/04/2026</span>
                                </div>
                                <p className="text-gray-600 mt-4 text-sm italic leading-relaxed">"Ótimo serviço na ligação da máquina de lavar. Atratou uns minutinhos por causa da portaria, mas recompensou na gentileza."</p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
