import React from 'react';
import Link from 'next/link';

export default function AlinhamentoProfundoPage() {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <Link href="/dashboard" className="text-primary-600 hover:underline mb-4 inline-block">
                    &larr; Voltar para Jornada
                </Link>
                <h1 className="text-3xl font-serif font-bold text-primary-900">Alinhamento Profundo</h1>
                <p className="text-gray-600 mt-2">Filtro de Compatibilidade e Prontidão para admissão na comunidade. Fatores como Governança têm alto peso eliminatório.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-8">
                <div className="space-y-8">
                    <div className="p-4 bg-primary-50 rounded-lg text-sm text-primary-800 border border-primary-100">
                        <strong>Nota Técnica (Protótipo):</strong> Esta tela terá as perguntas decisivas de convivência. As respostas alimentarão a tabela <code>match_answers_deep</code> para calcular o percentual de compatibilidade matemática.
                    </div>

                    <div className="space-y-3">
                        <label className="font-semibold text-gray-800 text-lg">
                            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded uppercase tracking-wide mr-2 font-bold mb-2">Peso 4 (Eliminatório)</span>
                            <br/>
                            8. Como você gostaria que as decisões da comunidade fossem tomadas?
                        </label>
                        <div className="space-y-2">
                            {['Votação por maioria simples (metade + 1)', 'Consenso (todos precisam concordar 100%)', 'Consentimento (sociocracia - buscar objeções válidas)'].map((opt, i) => (
                                <label key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                                    <input type="radio" name="gov" className="w-5 h-5 text-primary-600" />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <button className="bg-primary-600 text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-primary-700 transition-colors">
                            Submeter para Análise de Turma
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
