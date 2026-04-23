'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

const noticias = [
    {
        id: 1,
        veiculo: 'Jornal A Tribuna',
        data: 'Recentemente',
        titulo: 'Studio Be na A Tribuna: O futuro do morar baseado na convivência e pertencimento',
        resumo: 'Em entrevista, nossa fundadora Claudia compartilha o olhar do Studio Be sobre o cohousing — uma forma de morar que valoriza o convívio e uma vida mais consciente. Uma visão que une privacidade e comunidade em equilíbrio.',
        link: 'https://www.atribuna.com.br/galeria/comportamento/cohousing-em-santos-prop-e-nova-forma-de-moradia-baseada-na-convivencia-1.508467'
    },
    {
        id: 2,
        veiculo: 'Jornal O Estado',
        data: '02 de Dezembro, 2025',
        titulo: 'Economia Prateada: Senior Cohousing vira a grande aposta imobiliária',
        resumo: 'Famílias maduras estão trocando grandes apartamentos ociosos por residências inteligentes com ampla vida social e manutenção diluída.',
        link: '/em-construcao'
    },
    {
        id: 3,
        veiculo: 'Portal Vida Simples',
        data: '18 de Novembro, 2025',
        titulo: 'A "Vizinhança Intencional" como remédio contra a solidão',
        resumo: 'Estudo do Studio Be mostra que 80% dos interessados buscam um Cohousing para resgatar o senso de pertencimento e curar o isolamento social urbano.',
        link: '/em-construcao'
    }
];

export default function MidiasPage() {
    const [alerta, setAlerta] = useState('');

    const handleLerMateria = (titulo: string) => {
        setAlerta(`Em breve: A matéria completa "${titulo}" estará disponível no lançamento oficial!`);
        setTimeout(() => setAlerta(''), 4000);
    };

    return (
        <div className="min-h-screen bg-background font-sans text-foreground flex flex-col relative">
            <PublicHeader />

            {/* Alerta Flutuante */}
            {alerta && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-secondary-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <svg className="w-5 h-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-semibold text-sm">{alerta}</span>
                </div>
            )}

            <main className="flex-1 bg-white">
                <div className="container mx-auto px-6 py-20 lg:py-32">

                    <div className="text-center mb-24 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 text-primary-800 text-sm font-bold mb-6 border border-secondary-100 uppercase tracking-widest">
                            Na Imprensa
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-green-600 tracking-tight leading-tight mb-8">
                            O Mundo fala sobre o <span className="text-secondary-600">Cohousing</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mt-4 leading-relaxed font-light">
                            Acompanhe os estudos, reportagens e tendências do mercado imobiliário voltados para as Comunidades Intencionais.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
                        {noticias.map(noticia => (
                            <div key={noticia.id} className="bg-white border text-left border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                                <span className="text-primary-600 font-bold text-sm tracking-wider uppercase">{noticia.veiculo}</span>
                                <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-4 leading-snug group-hover:text-primary-800 transition-colors">
                                    {noticia.titulo}
                                </h3>
                                <p className="text-gray-600 text-base leading-relaxed mb-8">
                                    {noticia.resumo}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                    <span className="text-gray-400 text-sm font-medium">{noticia.data}</span>
                                    <Link href={noticia.link} target="_blank" rel="noopener noreferrer" className="text-secondary-600 font-bold hover:text-secondary-800 flex items-center gap-2 transition-colors outline-none">
                                        → Ler matéria completa
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Destaque de Assessoria */}
                    <div className="bg-primary-50 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 border border-primary-100 shadow-inner">
                        <div className="md:w-2/3">
                            <h2 className="text-3xl font-bold text-primary-900 mb-4 tracking-tight">Contato para Imprensa</h2>
                            <p className="text-primary-700 text-lg leading-relaxed">
                                Você é jornalista ou lidera um veículo de mídia e quer entender como os novos conceitos do morar revolucionam o estilo de vida ? Agende uma entrevista com nossos especialistas.
                            </p>
                        </div>
                        <a href="mailto:contato@studiobe-cohousing.com?subject=Contato de Assessoria de Imprensa do Portal StudioBe" className="bg-primary-900 text-white hover:bg-primary-800 px-10 py-5 rounded-full font-bold shadow-xl transition-transform hover:scale-105 w-full md:w-auto text-lg whitespace-nowrap inline-block text-center mt-6 md:mt-0">
                            Falar com a Assessoria
                        </a>
                    </div>

                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
