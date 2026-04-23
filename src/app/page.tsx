"use client";

import React from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import CohousingForm from '@/components/CohousingForm';
import { Button } from '@/components/ui/Button';

// Ícones SVG minimalistas que substituem os do zip original
const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 11a9 9 0 019 9v0a9 9 0 01-9-9v0zm0 0a9 9 0 019-9v0a9 9 0 019 9v0M4 11l4 4" />
  </svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const differentiators = [
  { icon: <LeafIcon />, title: 'Sustentável', description: 'Projetos com baixo impacto ambiental e design biofílico.' },
  { icon: <UsersIcon />, title: 'Colaborativo', description: 'Governança participativa e economia compartilhada.' },
  { icon: <HeartIcon />, title: 'Acolhedor', description: 'Curadoria afetiva e programas de mentoria para integração.' },
  { icon: <ShieldIcon />, title: 'Seguro', description: 'Monitoramento discreto e redes de apoio mútuo.' },
  { icon: <SparklesIcon />, title: 'Transformador', description: 'Desenvolvimento pessoal e geração de propósito.' },
];

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

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <PublicHeader />

      <main>
        {/* Imagem de Capa (Banner Seco) sem máscara preta */}
        <section className="w-full h-[60vh] md:h-[70vh] bg-secondary-900 overflow-hidden">
          <img
            src="/Capa1.png"
            alt="Grupo de Cohousing no Jantar"
            className="w-full h-full object-cover object-center animate-in zoom-in duration-1000"
          />
        </section>

        {/* Hero Text Section (Separado da Imagem) */}
        <section className="py-20 md:py-28 bg-white border-b border-primary-50 relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600"></div>
          <div className="container mx-auto px-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row gap-12 items-center justify-between">

              <div className="md:w-3/5">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 text-secondary-900 text-sm font-semibold mb-6 shadow-sm border border-secondary-100">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary-600"></span>
                  </span>
                  Novidade: Formação de Turmas 2026/2027
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4 text-primary-900 tracking-tight">
                  Construímos os lugares onde você viverá as suas melhores <span className="text-secondary-600">histórias.</span>
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary-800 tracking-tight">
                  Curadoria para Comunidades Intencionais
                </h2>
                <p className="text-lg md:text-xl mb-8 text-gray-600 font-medium leading-relaxed tracking-wide max-w-2xl">
                  Conectamos pessoas em busca de qualidade de vida, pertencimento e propósito.
                  <span className="block mt-4 italic font-bold text-primary-800">StudioBe: onde o pertencer é o novo morar.</span>
                </p>
              </div>



            </div>
          </div>
        </section>

        {/* Differentiators Section (Nosso DNA) */}
        <section className="py-24 bg-white border-b border-primary-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-900 mb-6 tracking-tight">Nosso DNA</h2>
            <div className="w-24 h-1.5 bg-primary-500 mx-auto mb-16 rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {differentiators.map((item, index) => (
                <div key={index} className="flex flex-col items-center p-8 bg-secondary-50/50 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-secondary-100 hover:border-primary-200">
                  <div className="text-primary-600 mb-6 transform scale-110 p-4 bg-white rounded-2xl shadow-sm">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem & Solution Section (A Solução Turnkey) */}
        <section id="solucao" className="py-24 bg-secondary-50 scroll-mt-28">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute -top-8 -left-8 w-40 h-40 bg-primary-200/50 rounded-full blur-3xl"></div>
                  <img
                    src="/nova-forma.jpg"
                    alt="Viver em comunidade no Studio Be"
                    className="rounded-3xl shadow-2xl relative z-10 border-8 border-white"
                  />
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary-200/50 rounded-full blur-xl"></div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-5xl font-bold text-primary-900 mb-8 tracking-tight leading-tight">Uma nova forma de morar e viver</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  O Studio Be é um Ecossistema de Transição de Estilo de Vida que utiliza o prisma da diferenciação para escapar do "rebanho competitivo" imobiliário. Nossa proposta une curadoria humana e modelos de negócios inovadores em uma solução única:
                </p>
                <ol className="text-lg text-gray-600 mb-6 space-y-3 list-decimal list-outside pl-5">
                  <li><strong>Posicionamento Inverso:</strong> Subtraímos a transação imobiliária fria e adicionamos o extraordinário: uma curadoria humana e psicológica que foca na interioridade do ser, transformando o "morar" em uma travessia de vida.</li>
                  <li><strong>Ruptura de Categoria:</strong> Rejeitamos o rótulo de "moradia sênior" para criar um Ecossistema de Transição de Estilo de Vida. Aqui, o cliente deixa de ser um usuário passivo para ser o herói protagonista de sua própria jornada.</li>
                  <li><strong>Fuga da Mesmice:</strong> Criamos lugares para viver as melhores histórias com pertencimento e propósito e rompemos com a lógica do mercado voltada a especulação imobiliária. Criamos um nicho de separação onde a conexão real e o legado são os maiores valores.</li>
                </ol>
                <p className="text-xl text-primary-800 font-medium mb-10 leading-relaxed italic">
                  Não entregamos paredes; entregamos o suporte para o seu florescimento.
                </p>
                <Link href="/quem-somos" className="inline-flex items-center justify-center bg-secondary-600 text-white hover:bg-secondary-700 h-14 px-10 text-lg rounded-full font-medium shadow-sm">
                  Conheça Nosso Papel Exclusivo
                </Link>
              </div>
            </div>

            {/* Nova Seção de Pilares Transferida */}
            <div className="mt-24 pt-16 border-t border-secondary-200/30">
              <div className="text-center mb-16">
                <span className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-4 block">Fundação Sólida</span>
                <h3 className="text-3xl md:text-5xl font-bold text-primary-900 tracking-tight">
                  Os 4 Pilares do Nosso Modelo
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {pillars.map((pillar, index) => (
                  <div key={index} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 text-left border border-secondary-100 hover:border-primary-100 group">
                    <div className="bg-primary-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors text-primary-600">
                      {pillar.icon}
                    </div>
                    <h4 className="text-lg font-bold text-primary-900 mb-3">{pillar.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cadastro Section */}
        <section id="cadastro" className="px-6 lg:px-12 py-24 lg:py-32 bg-white scroll-mt-28">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
                Encontre a sua <br />
                <span className="text-primary-900">próxima comunidade.</span>
              </h2>
              <ul className="space-y-6 text-lg text-gray-600 mb-8">
                <li className="flex gap-4">
                  <span className="text-primary-500 font-bold">1.</span>
                  <span>Preencha o formulário para entendermos seu perfil (região, orçamento, etc).</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-primary-500 font-bold">2.</span>
                  <span>Nosso sistema irá cruzar os dados sugerindo os melhores grupos.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-primary-500 font-bold">3.</span>
                  <span>Participe das reuniões do "Fórum de Governança" dentro da nossa área exclusiva.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-primary-500 font-bold">4.</span>
                  <span>Inicie o planejamento do projeto sem burocracia e com assessoria completa.</span>
                </li>
              </ul>
            </div>
            <div className="w-full">
              <CohousingForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer Unificado Público */}
      <PublicFooter />
    </div>
  );
}
