import React from 'react';
import Link from 'next/link';

export default function DashboardHomePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary-900">Bom dia, Maria.</h1>
                <p className="text-gray-600 mt-2">Bem-vinda à área restrita da Vila Botânica (Turma Piloto).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card Resumo do Projeto */}
                <div className="bg-primary-900 text-white p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-semibold text-lg">Resumo do Projeto</h3>
                            <p className="text-primary-200 text-sm mt-1">Status: Aquisição de Terreno</p>
                        </div>
                        <div className="text-3xl">🏠</div>
                    </div>
                    <div className="space-y-3 pt-6 border-t border-primary-800">
                        <div className="flex justify-between text-sm">
                            <span className="text-primary-100">Progresso Geral</span>
                            <span className="font-medium">25%</span>
                        </div>
                        <div className="w-full bg-primary-800 rounded-full h-2">
                            <div className="bg-primary-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Card Próximas Ações */}
                <div className="bg-white p-6 rounded-xl border border-secondary-100 shadow-sm">
                    <h3 className="font-semibold text-lg text-primary-900 mb-4">Sua Fila de Ações</h3>
                    <ul className="space-y-3">
                        <li className="flex gap-3 items-start">
                            <span className="text-yellow-500 mt-0.5">⚠️</span>
                            <div>
                                <Link href="/dashboard/governanca" className="text-sm font-medium text-gray-900 hover:text-primary-800 hover:underline">
                                    Votação Pendente: Construtora
                                </Link>
                                <p className="text-xs text-gray-500">Expira em 2 dias</p>
                            </div>
                        </li>
                        <li className="flex gap-3 items-start">
                            <span className="text-blue-500 mt-0.5">📄</span>
                            <div>
                                <Link href="/dashboard/financas" className="text-sm font-medium text-gray-900 hover:text-primary-800 hover:underline">
                                    Boleto (Parcela 2) Disponível
                                </Link>
                                <p className="text-xs text-gray-500">Vence em 05/12</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Atalhos Rápidos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <Link href="/dashboard/governanca" className="bg-white p-4 rounded-xl border border-secondary-100 text-center hover:border-primary-200 hover:shadow-sm transition-all">
                    <div className="text-2xl mb-2">🏛️</div>
                    <span className="text-sm font-semibold text-gray-700">Ir para o Fórum</span>
                </Link>
                <Link href="/dashboard/financas" className="bg-white p-4 rounded-xl border border-secondary-100 text-center hover:border-primary-200 hover:shadow-sm transition-all">
                    <div className="text-2xl mb-2">📊</div>
                    <span className="text-sm font-semibold text-gray-700">Ver Finanças</span>
                </Link>
                <Link href="/dashboard/comunidade" className="bg-white p-4 rounded-xl border border-secondary-100 text-center hover:border-primary-200 hover:shadow-sm transition-all">
                    <div className="text-2xl mb-2">👥</div>
                    <span className="text-sm font-semibold text-gray-700">Meus Vizinhos</span>
                </Link>
                <Link href="/dashboard/eventos" className="bg-white p-4 rounded-xl border border-secondary-100 text-center hover:border-primary-200 hover:shadow-sm transition-all">
                    <div className="text-2xl mb-2">📅</div>
                    <span className="text-sm font-semibold text-gray-700">Eventos da Vila</span>
                </Link>
            </div>
        </div>
    );
}
