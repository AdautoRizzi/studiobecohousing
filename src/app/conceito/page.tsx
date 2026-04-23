"use client";

import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';



export default function ConceitoPage() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
            <PublicHeader />

            <main className="flex-1 bg-white">
                <div className="container mx-auto px-6 py-20 lg:py-32">
                    {/* Header da Página */}
                    <div className="text-center mb-24 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 text-primary-800 text-sm font-semibold mb-6 border border-secondary-100">
                            O Movimento
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-secondary-600 tracking-tight leading-tight mb-8">
                            Cohousing: Viver com Propósito
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mt-4 leading-relaxed font-light">
                            Desmistificando o conceito e apresentando um novo modelo de moradia que une autonomia, comunidade e significado.
                        </p>
                    </div>

                    {/* O que é Cohousing? */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6 tracking-tight">O Modelo Tradicional: A Moradia Colaborativa</h2>
                            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                                O cohousing tradicional é um modelo de vida que equilibra a privacidade do lar individual com a força da convivência comunitária. São vizinhanças planejadas onde os moradores compartilham espaços — como cozinhas e jardins — para combater o isolamento social e promover a sustentabilidade. É uma solução habitacional prática que vem ganhando espaço no Brasil, especialmente entre o público 50+ que busca apoio mútuo.
                            </p>

                            <div className="mt-8 flex items-center gap-4 text-primary-800 font-medium italic">
                                "Menos muros, mais pontes"
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 relative group">
                            <div className="absolute inset-0 bg-primary-200 rounded-3xl transform rotate-3 transition-transform group-hover:rotate-6"></div>
                            <img
                                src="/predio3.png"
                                alt="Arquitetura de cohousing"
                                className="rounded-3xl shadow-xl w-full h-[400px] object-cover relative z-10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2"
                            />
                        </div>
                    </div>

                    {/* Para Quem é? */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-secondary-200 rounded-3xl transform -rotate-3 transition-transform group-hover:-rotate-6"></div>
                            <img
                                src="/cohousing-geral.jpg"
                                alt="Grupo de pessoas felizes"
                                className="rounded-3xl shadow-xl w-full h-[400px] object-cover relative z-10 transition-transform duration-500 group-hover:translate-y-2 group-hover:translate-x-2"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6 tracking-tight">Para Quem é?</h2>
                            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                                Destina-se especialmente a <span className="font-semibold text-primary-700">pessoas e famílias maduras</span> que buscam uma vida com mais significado, simplicidade e conexão. É para quem deseja continuar ativo, produtivo e empreendedor, mas em um ritmo mais leve e com uma forte rede de apoio.
                            </p>
                            <div className="bg-secondary-50 border-l-4 border-primary-500 p-6 rounded-r-2xl my-8">
                                <p className="text-gray-800 text-lg font-medium italic">
                                    "É a escolha ideal para quem valoriza a privacidade, mas não abre mão da convivência, da troca de experiências e do sentimento de pertencimento."
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer Unificado Público */}
            <PublicFooter />
        </div>
    );
}
