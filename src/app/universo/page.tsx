import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import OportunidadeCard from '@/components/OportunidadeCard';

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
            titulo: 'Retrofit Urbano: de hotel a Cohousing',
            descricao: 'Oportunidade exclusiva de transformar um hotel tradicional em uma comunidade urbana vibrante, de frente para o mar. A infraestrutura base já está pronta, os quartos serão ampliados para se transformarem nas unidades habitacionais. Um lindo projeto do arquiteto Roberto Kubota, aguardando um grupo com propósito para tornar esse sonho uma realidade.',
            status: 'Estudo de Viabilidade',
            tipo: 'Retrofit',
            imagem_url: '/retrofit/retrofit-1.jpg',
            destaque: true,
            linkInteresse: '/#cadastro',
            media: [
                {
                    type: 'image' as const,
                    url: '/retrofit/retrofit-1.jpg',
                    thumbUrl: '/retrofit/retrofit-1.jpg',
                    title: 'Piscina, Deck e Sacadas das Unidades Habitacionais'
                },
                {
                    type: 'image' as const,
                    url: '/retrofit/retrofit-2.jpg',
                    thumbUrl: '/retrofit/retrofit-2.jpg',
                    title: 'Vista Externa e Fachada Urbana de Frente para o Mar'
                },
                {
                    type: 'video' as const,
                    url: '/retrofit/retrofit-video.mp4',
                    thumbUrl: '/retrofit/video-thumb.jpg',
                    title: 'Tour Virtual 3D — Projeto Arquitetônico de Roberto Kubota'
                }
            ]
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
                            {oportunidades.map((op) => (
                                <OportunidadeCard key={op.id} {...op} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
