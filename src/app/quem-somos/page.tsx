'use client';

import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

export default function QuemSomosPage() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
            <PublicHeader />

            <main className="flex-1 bg-white">
                <div className="container mx-auto px-6 py-20 lg:py-32">

                    <div className="text-center mb-24 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 text-primary-800 text-sm font-bold mb-6 border border-secondary-100 uppercase tracking-widest">
                            Conheça Nossa História
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-8">
                            <span className="text-secondary-600">Nós somos o</span> <span className="text-green-600">Studio Be</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mt-4 leading-relaxed font-light">
                            Pioneiros na implementação de comunidades intencionais autênticas no Brasil. Desenhando o futuro do pertencer.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-6 tracking-tight">O Fim da Solidão</h2>
                            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                                A Studio Be nasceu de uma inquietação profunda com o modelo tradicional de envelhecimento e isolamento nas grandes cidades. Nossa missão é clara: <span className="font-semibold text-primary-700">Construir os lugares onde você viverá as suas melhores histórias.</span>
                            </p>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Somos um estúdio multidisciplinar que une arquitetura inovadora, gestão ágil e facilitação de grupos para desenhar "o novo jeito de morar e viver". Nossos projetos não são condomínios, são ecossistemas vivos onde vizinhos operam como uma rede de apoio mútuo.
                            </p>

                            <div className="mt-8 flex items-center gap-4 text-primary-800 font-bold bg-primary-50 p-6 rounded-2xl">
                                Queremos mudar como o Brasil enxerga a convivência coletiva.
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 relative group">
                            <div className="absolute inset-0 bg-secondary-200 rounded-3xl transform rotate-3 transition-transform group-hover:rotate-6"></div>
                            <img
                                src="/equipe multidisciplinar2.png"
                                alt="Equipe discutindo projetos"
                                className="rounded-3xl shadow-xl w-full h-[450px] object-cover relative z-10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2"
                            />
                        </div>
                    </div>

                    <div className="bg-primary-900 text-white rounded-[3rem] p-12 lg:p-20 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-20 -ml-20 -mb-20"></div>

                        <div className="relative z-10 text-center max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">Nosso Papel Exclusivo</h2>
                            <p className="text-xl text-primary-100 font-light leading-relaxed mb-12 max-w-4xl mx-auto">
                                O Studio Be assume o papel exclusivo de Orquestrador da Transição para um Novo Estilo de Vida, transcendendo a lógica tradicional do mercado imobiliário para oferecer um ecossistema completo de florescimento humano. Nossa entrega centraliza-se nos seguintes pilares:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 text-left">
                                <div className="lg:col-span-2 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <img src="/CURADORIA HUMANA E SOCIAL - ICONE.png" className="w-12 h-12 mb-4 object-contain" alt="Curadoria" />
                                    <h3 className="text-xl font-bold mb-3 text-white">Curadoria Humana e Social</h3>
                                    <p className="text-sm text-primary-100 leading-relaxed">Atuamos como facilitadores na formação de comunidades, unindo indivíduos com valores e propósitos compartilhados para garantir uma rede de apoio genuína e duradoura.</p>
                                </div>
                                <div className="lg:col-span-2 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <img src="/SOLUÇÃO INTEGRADA - ICONE.png" className="w-12 h-12 mb-4 object-contain" alt="Solução Integrada" />
                                    <h3 className="text-xl font-bold mb-3 text-white">Solução integrada para a longevidade</h3>
                                    <p className="text-sm text-primary-100 leading-relaxed">Unimos em uma única jornada: arquitetura, psicologia e questões associadas a gerontologia social com aspectos técnicos e jurídicos. Cuidamos desde o despertar do desejo à viabilização jurídica e construtiva, além do suporte na gestão da convivência.</p>
                                </div>
                                <div className="lg:col-span-2 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <img src="/LAMPADA - ICONE.png" className="w-12 h-12 mb-4 object-contain" alt="Modelos" />
                                    <h3 className="text-xl font-bold mb-3 text-white">Modelos de Negócio Inteligentes</h3>
                                    <p className="text-sm text-primary-100 leading-relaxed">Oferecemos segurança e acessibilidade por meio de propriedade fracionada e construção a preço de custo, reduzindo barreiras financeiras e otimizando o patrimônio do cliente.</p>
                                </div>
                                <div className="md:col-span-1 lg:col-span-2 lg:col-start-2 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <div className="text-4xl mb-4">📱</div>
                                    <h3 className="text-xl font-bold mb-3 text-white">Plataforma de Governança Digital</h3>
                                    <p className="text-sm text-primary-100 leading-relaxed">Entregamos uma infraestrutura tecnológica exclusiva para a gestão comunitária, facilitando decisões coletivas, serviços add-on de bem-estar e o dia a dia da comunidade.</p>
                                </div>
                                <div className="md:col-span-1 lg:col-span-2 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <div className="text-4xl mb-4">🏡</div>
                                    <h3 className="text-xl font-bold mb-3 text-white">Ambientes Seguros e Inteligentes</h3>
                                    <p className="text-sm text-primary-100 leading-relaxed">Projetamos espaços que aliam tecnologia e design biofílico para garantir autonomia, segurança e uma vida conectada ao ritmo urbano contemporâneo.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção Equipe */}
                <div className="bg-secondary-50 py-24 mt-12">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="flex flex-col md:flex-row justify-center items-center mb-16 gap-8">
                            <h2 className="text-5xl font-bold text-primary-900 tracking-tight text-center">A Equipe</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                            {/* Cláudia */}
                            <div className="flex flex-col text-left group">
                                <h3 className="text-xl font-bold text-primary-800 uppercase tracking-widest mb-3">Cláudia Bertucci</h3>
                                <p className="text-primary-600 mb-8 min-h-[60px]">Arquiteta e Urbanista com especialização em Psicologia Transpessoal</p>
                                <div className="rounded-full overflow-hidden aspect-square relative border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                                    <img src="/equipe_claudia.png" alt="Cláudia Bertucci" className="object-cover w-full h-full" />
                                </div>
                            </div>

                            {/* Adauto */}
                            <div className="flex flex-col text-left group">
                                <h3 className="text-xl font-bold text-primary-800 uppercase tracking-widest mb-3">Adauto Rizzi</h3>
                                <p className="text-primary-600 mb-8 min-h-[60px]">Consultor e Administrador de empresas focado em Negócios Socioambientais</p>
                                <div className="rounded-full overflow-hidden aspect-square relative border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                                    <img src="/equipe_adauto.png" alt="Adauto Rizzi" className="object-cover w-full h-full" />
                                </div>
                            </div>

                            {/* Paulo Cesar */}
                            <div className="flex flex-col text-left group">
                                <h3 className="text-xl font-bold text-primary-800 uppercase tracking-widest mb-3">Paulo Cesar Togniazzolo</h3>
                                <p className="text-primary-600 mb-8 min-h-[60px]">Engenheiro e Administrador especializado em Desenvolvimento Imobiliário</p>
                                <div className="rounded-full overflow-hidden aspect-square relative border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                                    <img src="/equipe_paulo.png" alt="Paulo Cesar Togniazzolo" className="object-cover w-full h-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
