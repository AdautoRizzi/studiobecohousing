'use client';

import React from 'react';
import Link from 'next/link';

export default function ComunidadePage() {
    const moradores = [
        { id: 1, nome: 'Maria Silva', cota: '12', interesses: ['Horta Orgânica', 'Yoga'], avatar: 'MS', role: 'Moradora' },
        { id: 2, nome: 'João Pedro', cota: '05', interesses: ['Marcenaria', 'Vinhos'], avatar: 'JP', role: 'Síndico Temporário' },
        { id: 3, nome: 'Ana e Carlos', cota: '08', interesses: ['Culinária', 'Pets'], avatar: 'AC', role: 'Moradores' },
        { id: 4, nome: 'Dr. Roberto', cota: '15', interesses: ['Leitura', 'Música Clássica'], avatar: 'RO', role: 'Morador' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary-900">Sua Comunidade</h1>
                    <p className="text-gray-600 mt-2">Conheça seus futuros vizinhos da Vila Botânica.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/em-construcao" className="bg-white border border-secondary-100 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 transition-colors">
                        Mural de Recados
                    </Link>
                    <Link href="/em-construcao" className="bg-primary-800 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-primary-900 transition-colors">
                        Grupos de Trabalho
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {moradores.map((perfil) => (
                    <div key={perfil.id} className="bg-white p-6 rounded-xl border border-secondary-100 shadow-sm flex flex-col items-center text-center hover:border-primary-200 hover:shadow-md transition-all">
                        <div className="h-20 w-20 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-2xl font-bold mb-4">
                            {perfil.avatar}
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">{perfil.nome}</h3>
                        <p className="text-sm text-gray-500 mb-3">Fração/Cota: {perfil.cota}</p>

                        {perfil.role !== 'Moradora' && perfil.role !== 'Morador' && perfil.role !== 'Moradores' && (
                            <span className="mb-4 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                {perfil.role}
                            </span>
                        )}

                        <div className="mt-auto w-full pt-4 border-t border-secondary-50">
                            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Interesses</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {perfil.interesses.map((int, i) => (
                                    <span key={i} className="px-2 py-1 bg-secondary-50 text-gray-700 text-xs rounded-md border border-secondary-100">
                                        {int}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Card Convidar */}
                <div className="bg-secondary-50 p-6 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center hover:bg-secondary-100/50 transition-colors min-h-[300px] cursor-pointer">
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-gray-400 text-3xl mb-4 shadow-sm">
                        +
                    </div>
                    <h3 className="font-semibold text-gray-700">Convidar Amigo</h3>
                    <p className="text-sm text-gray-500 mt-2">Indique alguém com o perfil da Vila Botânica.</p>
                </div>
            </div>
        </div>
    );
}
