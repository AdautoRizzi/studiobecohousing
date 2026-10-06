import React from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

export const dynamic = 'force-dynamic';

export default async function UniversoPage() {
    const modelos = [
        {
            id: 'urbano',
            icon: '🏙️',
            title: 'Cohousing Urbano',
            desc: 'Otimização de espaço e conveniência.',
            details: 'Ideal para quem busca proximidade aos serviços da cidade, mas não abre mão de uma vida em comunidade. Geralmente envolve o retrofit de prédios ou vilas.',
            profile: 'Jovens profissionais, famílias urbanas, pessoas idosas independentes.'
        },
        {
            id: 'rural',
            icon: '🌳',
            title: 'Cohousing Rural',
            desc: 'Contato direto com a natureza e tranquilidade.',
            details: 'Espaços amplos, distanciamento do caos da cidade. Focado em integração com a paisagem, hortas comunitárias e ritmo de vida mais calmo.',
            profile: 'Famílias buscando qualidade de vida, nômades digitais, aposentados.'
        },
        {
            id: 'litoral',
            icon: '🏖️',
            title: 'Cohousing no Litoral',
            desc: 'Qualidade de vida, clima praiano e lazer.',
            details: 'Voltado para atividades ao ar livre, esportes aquáticos e um estilo de vida focado no bem-estar físico e mental.',
            profile: 'Amantes do mar, famílias, aposentados buscando clima quente.'
        },
        {
            id: 'montanha',
            icon: '⛰️',
            title: 'Cohousing na Montanha',
            desc: 'Refúgio, clima ameno e arquitetura orgânica.',
            details: 'Para quem busca introspecção, ar puro e conexão profunda com os ciclos da natureza. Arquitetura integrada ao relevo.',
            profile: 'Escritores, artistas, amantes de trilhas e esportes de inverno.'
        },
        {
            id: 'ecovila',
            icon: '♻️',
            title: 'Ecovila',
            desc: 'Foco total em sustentabilidade e impacto zero.',
            details: 'Permacultura, bioconstrução, energias renováveis e tratamento ecológico de resíduos. Um compromisso profundo com a regeneração ambiental.',
            profile: 'Ativistas ambientais, praticantes de permacultura.'
        },
        {
            id: 'agrovila',
            icon: '🧑‍🌾',
            title: 'Agrovila',
            desc: 'Soberania alimentar e economia circular.',
            details: 'Comunidades centradas na produção de alimentos orgânicos, cooperativismo agrícola e agroflorestas.',
            profile: 'Agricultores urbanos em transição, famílias buscando autossuficiência.'
        }
    ];

    // Oportunidades fixas para MVP
    const oportunidades = [
        {
            id: '1',
            titulo: 'Retrofit Urbano: De Hotel Clássico a Cohousing',
            descricao: 'Oportunidade exclusiva de transformar um hotel tradicional em uma comunidade urbana vibrante. A infraestrutura base já está pronta (quartos, áreas comuns, cozinha industrial), aguardando um grupo com propósito para retrofitar o espaço.',
            status: 'Estudo de Viabilidade',
            tipo: 'Retrofit',
            imagem_url: 'https://images.unsplash.com/photo-1551882547-ff40c0d13c05?q=80&w=2089',
            destaque: true
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col text-gray-900">
            <PublicHeader />

            <main className="flex-1 py-16 lg:py-24">
                {/* Header / Hero */}
                <div className="container mx-auto px-6 text-center mb-20 max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-primary-900 tracking-tight mb-6">
                        Universo Cohousing
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                        Descubra os diferentes modelos de moradia intencional e encontre a comunidade e oportunidade que mais ressoa com o seu propósito de vida.
                    </p>
                </div>

                {/* Showcase Interativo */}
                <section className="container mx-auto px-6 mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {modelos.map((modelo) => (
                            <div key={modelo.id} className="group bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col cursor-default relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                
                                <span className="text-5xl mb-6 block transform group-hover:scale-110 transition-transform origin-left">{modelo.icon}</span>
                                <h3 className="text-2xl font-bold text-primary-900 mb-3">{modelo.title}</h3>
                                <p className="text-gray-600 mb-6 font-medium min-h-[3rem]">{modelo.desc}</p>
                                
                                <div className="space-y-4 pt-6 border-t border-gray-100 flex-1 flex flex-col">
                                    <div>
                                        <h4 className="text-xs uppercase font-bold text-primary-600 mb-1 tracking-wider">Como Funciona</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{modelo.details}</p>
                                    </div>
                                    <div className="mt-auto pt-4">
                                        <h4 className="text-xs uppercase font-bold text-secondary-600 mb-1 tracking-wider">Perfil Ideal</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{modelo.profile}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mural de Oportunidades */}
                <section className="bg-white py-24 border-y border-gray-200">
                    <div className="container mx-auto px-6">
                        <div className="mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-primary-900 mb-6 flex items-center gap-4">
                                <span className="text-yellow-500">⚡</span> Mural de Oportunidades
                            </h2>
                            <p className="text-gray-600 max-w-2xl text-lg">
                                Projetos reais em fase de captação, estudo ou formação de grupos. Transforme o sonho em realidade conectando-se a uma destas áreas.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-10">
                            {oportunidades.map((op: any) => (
                                <div key={op.id} className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden flex flex-col md:flex-row shadow-lg hover:shadow-2xl transition-shadow duration-500">
                                    <div className="w-full md:w-2/5 lg:w-1/2 bg-gray-100 relative min-h-[300px] md:min-h-full">
                                        {op.imagem_url ? (
                                            <img src={op.imagem_url} alt={op.titulo} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                                        )}
                                        {op.destaque && (
                                            <div className="absolute top-6 left-6">
                                                <span className="inline-block px-4 py-2 bg-yellow-400 text-yellow-900 text-xs font-black uppercase tracking-widest rounded-full shadow-md">
                                                    Oportunidade em Destaque
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 md:p-12 flex-1 flex flex-col justify-center w-full md:w-3/5 lg:w-1/2">
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            <span className="px-4 py-1.5 bg-primary-50 text-primary-700 text-xs uppercase font-bold tracking-wider rounded-full border border-primary-100">
                                                {op.tipo}
                                            </span>
                                            <span className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs uppercase font-bold tracking-wider rounded-full border border-gray-200">
                                                Status: {op.status}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-6 leading-tight">{op.titulo}</h3>
                                        <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                                            {op.descricao}
                                        </p>
                                        
                                        <div className="mt-auto">
                                            <Link href="/registro" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-1 text-lg w-full md:w-auto">
                                                Tenho interesse neste projeto
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}