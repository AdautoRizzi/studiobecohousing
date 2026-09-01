import React from 'react';
import Link from 'next/link';

export default function DescobridorPage() {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <Link href="/dashboard" className="text-primary-600 hover:underline mb-4 inline-block">
                    &larr; Voltar para Jornada
                </Link>
                <h1 className="text-3xl font-serif font-bold text-primary-900">O Descobridor</h1>
                <p className="text-gray-600 mt-2">Descubra sua Afinidade e Momento de Vida. Suas respostas aqui determinam o seu primeiro Perfil de Futuro.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-8">
                <div className="space-y-8">
                    <div className="p-4 bg-secondary-50 rounded-lg text-sm text-secondary-800">
                        <strong>Nota Técnica (Protótipo):</strong> Esta tela receberá as 9 perguntas da Parte 1 da sua metodologia, focadas em <em>Quando pretende mudar?</em> e <em>O que motiva a busca?</em>. O banco de dados já está projetado para receber estas respostas na tabela <code>match_answers_discovery</code>.
                    </div>

                    {/* Exemplo de Pergunta */}
                    <div className="space-y-3">
                        <label className="font-semibold text-gray-800 text-lg">1. Quando pretende mudar?</label>
                        <div className="space-y-2">
                            {['Em 1 ano', 'Entre 1 e 2 anos', 'Entre 2 e 5 anos', 'Mais de 5 anos', 'Ainda não sei, estou apenas pesquisando'].map((opt, i) => (
                                <label key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                                    <input type="radio" name="q1" className="w-5 h-5 text-primary-600" />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="font-semibold text-gray-800 text-lg">2. O que mais motiva sua busca por uma nova moradia? (Mudez 3 respostas)</label>
                        <div className="space-y-2">
                            {['Ter mais qualidade de vida', 'Viver em comunidade, criando rede de apoio', 'Combater a solidão', 'Envelhecer com autonomia', 'Ter mais sustentabilidade'].map((opt, i) => (
                                <label key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <button className="bg-primary-600 text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-primary-700 transition-colors">
                            Salvar Perfil Descobridor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
