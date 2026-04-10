'use client';

import React from 'react';
import Link from 'next/link';

export default function FinancasPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary-900">Gestão Financeira</h1>
                    <p className="text-gray-600 mt-2">Transparência total no modelo de obra a preço de custo.</p>
                </div>
                <div>
                    <Link href="/em-construcao" className="inline-block bg-primary-800 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-primary-900 transition-colors">
                        Baixar Relatório Mensal
                    </Link>
                </div>
            </div>

            {/* Resumo Financeiro */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-primary-900 text-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-primary-100 font-medium mb-1">Custo Estimado da Fração (Cota)</h3>
                    <p className="text-3xl font-bold">R$ 480.000</p>
                    <div className="mt-4 pt-4 border-t border-primary-800 flex justify-between text-sm">
                        <span className="text-primary-200">Pago até agora:</span>
                        <span className="font-semibold text-primary-50">R$ 120.000</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-secondary-100 shadow-sm lg:col-span-2 flex items-center">
                    <div className="w-full">
                        <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-700">Progresso Financeiro Global da Obra</span>
                            <span className="font-bold text-primary-800">25%</span>
                        </div>
                        <div className="w-full bg-secondary-100 rounded-full h-3">
                            <div className="bg-primary-500 h-3 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">R$ 3.5M arrecadados de R$ 14M (Total da Vila Botânica)</p>
                    </div>
                </div>
            </div>

            {/* Detalhamento */}
            <div className="bg-white rounded-xl border border-secondary-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-secondary-100">
                    <h2 className="text-xl font-bold text-primary-900">Extrato de Pagamentos (Sua Fração)</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary-50 text-gray-600 border-b border-secondary-100">
                            <tr>
                                <th className="px-6 py-4 font-medium">Data</th>
                                <th className="px-6 py-4 font-medium">Fase</th>
                                <th className="px-6 py-4 font-medium">Valor</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4">05/10/2026</td>
                                <td className="px-6 py-4 text-gray-900 font-medium">Sinal - Compra Terreno</td>
                                <td className="px-6 py-4">R$ 50.000,00</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-md">Pago</span>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4">05/11/2026</td>
                                <td className="px-6 py-4 text-gray-900 font-medium">Parcela 1 - Projetos Executivos</td>
                                <td className="px-6 py-4">R$ 15.000,00</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-md">Pago</span>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4">05/12/2026</td>
                                <td className="px-6 py-4 text-gray-900 font-medium">Parcela 2 - Projetos Executivos</td>
                                <td className="px-6 py-4">R$ 15.000,00</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-md">A Vencer</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
