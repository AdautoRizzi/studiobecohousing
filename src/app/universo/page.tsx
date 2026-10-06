import React from 'react';
import Link from 'next/link';

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

    // Oportunidades fixas para MVP (Até construirmos o painel no Supabase)
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
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
            {/* Header / Hero */}
            <header className="pt-24 pb-16 px-6 max-w-7xl mx-auto text-center">
                <Link href="/" className="inline-flex items-center text-primary-500 hover:text-primary-400 font-bold mb-8 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Voltar para Início
                </Link>
                <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500 mb-6 tracking-tight">
                    Universo Cohousing
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                    Descubra os diferentes modelos de moradia intencional e encontre a comunidade e oportunidade que mais ressoa com o seu propósito de vida.
                </p>
            </header>

            {/* Showcase Interativo */}
            <section className="px-6 pb-24 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modelos.map((modelo) => (
                        <div key={modelo.id} className="group relative bg-[#0f172a] rounded-3xl border border-slate-800 p-8 hover:border-primary-500/50 transition-all duration-500 overflow-hidden cursor-default">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="relative z-10">
                                <span className="text-5xl mb-6 block transform group-hover:scale-110 transition-transform origin-left">{modelo.icon}</span>
                                <h3 className="text-2xl font-bold text-slate-50 mb-3">{modelo.title}</h3>
                                <p className="text-slate-400 mb-6 min-h-[3rem]">{modelo.desc}</p>
                                
                                <div className="space-y-4 pt-6 border-t border-slate-800 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <div>
                                        <h4 className="text-xs uppercase font-bold text-primary-500 mb-1">Como Funciona</h4>
                                        <p className="text-sm text-slate-300 leading-relaxed">{modelo.details}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs uppercase font-bold text-secondary-500 mb-1">Perfil Ideal</h4>
                                        <p className="text-sm text-slate-300 leading-relaxed">{modelo.profile}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mural de Oportunidades */}
            <section className="bg-slate-900 py-24 border-t border-slate-800">
                <div className="px-6 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4 flex items-center gap-3">
                                <span className="text-yellow-500">⚡</span> Mural de Oportunidades
                            </h2>
                            <p className="text-slate-400 max-w-2xl text-lg">
                                Projetos reais em fase de captação, estudo ou formação de grupos. Transforme o sonho em realidade conectando-se a uma destas áreas.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {oportunidades.map((op: any) => (
                            <div key={op.id} className="bg-[#0f172a] rounded-3xl border border-slate-800 overflow-hidden flex flex-col md:flex-row shadow-2xl">
                                <div className="w-full md:w-2/5 lg:w-1/2 bg-slate-800 relative min-h-[300px]">
                                    {op.imagem_url ? (
                                        <img src={op.imagem_url} alt={op.titulo} className="w-full h-full object-cover opacity-80" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-slate-800 to-slate-900" />
                                    )}
                                    {op.destaque && (
                                        <div className="absolute top-6 left-6">
                                            <span className="inline-block px-4 py-2 bg-yellow-500 text-slate-900 text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                                                Oportunidade em Destaque
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 md:p-12 flex-1 flex flex-col justify-center w-full md:w-3/5 lg:w-1/2">
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <span className="px-3 py-1.5 bg-primary-500/20 text-primary-400 text-sm font-bold rounded-lg border border-primary-500/30">
                                            {op.tipo}
                                        </span>
                                        <span className="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm font-bold rounded-lg border border-slate-700">
                                            Status: {op.status}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-3xl lg:text-4xl font-bold text-slate-50 mb-4">{op.titulo}</h3>
                                    <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                                        {op.descricao}
                                    </p>
                                    
                                    <div className="mt-auto">
                                        <Link href="/registro" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 text-lg w-full md:w-auto">
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
        </div>
    );
}
