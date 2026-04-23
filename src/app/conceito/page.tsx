"use client";

import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

// Ícones minimalistas reutilizados da Home
const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 11a9 9 0 019 9v0a9 9 0 01-9-9v0zm0 0a9 9 0 019-9v0a9 9 0 019 9v0M4 11l4 4" />
    </svg>
);
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);
const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const pillars = [
    {
        icon: <LeafIcon />,
        title: 'Sustentabilidade Integral',
        description: 'Projetos carbono-neutro, com foco em economia circular, design biofílico e infraestrutura de baixo impacto ambiental.',
    },
    {
        icon: <UsersIcon />,
        title: 'Colaboração Real',
        description: 'Governança democrática onde cada membro tem voz. As decisões são tomadas de forma participativa e transparente.',
    },
    {
        icon: <HeartIcon />,
        title: 'Acolhimento Humano',
        description: 'Programas de mentoria e integração que garantem um ambiente acolhedor, onde todos se sentem parte da comunidade desde o início.',
    },
    {
        icon: <ShieldIcon />,
        title: 'Segurança Proativa',
        description: 'Monitoramento 24/7 discreto e uma cultura de "guardiões de vizinhança", promovendo segurança e apoio mútuo.',
    },
];

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

                    {/* Pilares */}
                    <div className="text-center bg-secondary-50 rounded-[3rem] p-12 lg:p-20 shadow-sm border border-secondary-100">
                        <span className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-4 block">Fundação Sólida</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-16">
                            A Solução Studio Be
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                            {pillars.map((pillar, index) => (
                                <div key={index} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 text-left border border-white hover:border-primary-100 group">
                                    <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary-100 transition-colors">
                                        {pillar.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{pillar.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{pillar.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Unificado Público */}
            <PublicFooter />
        </div>
    );
}
