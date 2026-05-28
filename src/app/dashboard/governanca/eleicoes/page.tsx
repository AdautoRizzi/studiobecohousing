import { getGovData } from '@/lib/govStore';

export const dynamic = 'force-dynamic';

export default function EleicoesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-primary-900">Eleições Sociocráticas</h1>
            <p className="text-gray-600">Neste módulo, nós preenchemos os papéis da comunidade através de indicações abertas e justificadas, buscando a pessoa certa para o contexto atual (sem candidatos prévios).</p>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-secondary-200 text-center">
                <div className="text-4xl mb-4">🗳️</div>
                <h3 className="text-xl font-bold text-gray-900">Nenhuma eleição aberta no momento</h3>
                <p className="text-gray-500 mt-2">As eleições são disparadas automaticamente quando o tempo de um mandato termina ou quando um novo papel é criado no Círculo.</p>
                <button className="mt-6 bg-primary-600 text-white px-6 py-2 rounded-lg font-medium">Forçar Abertura de Vaga</button>
            </div>
        </div>
    );
}