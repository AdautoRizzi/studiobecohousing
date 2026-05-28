import { getGovData } from '@/lib/govStore';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PropostaDetail({ params }: { params: { id: string } }) {
    const { id } = await params;
    const data = getGovData();
    const currentUser = { id: 'u2', name: 'Maria Santos' }; // Simulando usurio logado (membro do c2)
    const userCircles = data.roles.filter((r: any) => r.userId === currentUser.id).map((r: any) => r.circleId);

    const p = data.proposals.find((x: any) => x.id === id);
    const interactions = data.interactions.filter((x: any) => x.proposalId === id);

    if (!p || !userCircles.includes(p.circleId)) return <div className="p-8 text-red-500 font-bold">Acesso Negado: Voc no  membro deste crculo.</div>;
    if (!p) return <div>Proposta não encontrada</div>;

    const phases = ['Clarification', 'Reaction', 'Objection', 'Approved'];
    const currentPhaseIdx = phases.indexOf(p.status);

    return (
        <div className="space-y-6">
            <Link href="/dashboard/governanca/propostas" className="text-sm text-primary-600 hover:underline">&larr; Voltar para Propostas</Link>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-secondary-200">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{p.title}</h1>
                        <p className="text-gray-500 mt-2">Proposto por {p.authorName} &bull; Crculo ID: {p.circleId}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-sm px-4 py-1.5 rounded-full font-bold uppercase tracking-wide">
                        Fase: {p.status}
                    </span>
                </div>

                <div className="space-y-6">
                    <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-100">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Motivador (Driver)</h3>
                        <p className="text-gray-700">{p.driver}</p>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">A Proposta</h3>
                        <div className="prose max-w-none text-gray-800">
                            {p.content}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stepper do Processo Sociocrtico */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-200">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Fluxo de Decisão por Consentimento</h2>
                
                <div className="flex justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary-100 -z-10 -translate-y-1/2"></div>
                    {phases.map((phase, idx) => (
                        <div key={phase} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx <= currentPhaseIdx ? 'bg-primary-600 text-white' : 'bg-secondary-200 text-gray-500'}`}>
                                {idx + 1}
                            </div>
                            <span className="text-xs font-medium text-gray-600 mt-2">{phase}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fórum da Fase Atual */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Interações da Fase: {p.status}</h3>
                <div className="space-y-4 mb-6">
                    {interactions.length === 0 ? (
                        <p className="text-gray-500 italic">Nenhuma interação registrada ainda.</p>
                    ) : (
                        interactions.map((i: any) => (
                            <div key={i.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-sm">{i.userName}</span>
                                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">{i.type}</span>
                                </div>
                                <p className="text-gray-700">{i.content}</p>
                            </div>
                        ))
                    )}
                </div>

                {p.status !== 'Approved' && p.status !== 'Rejected' && (
                    <div className="border-t border-secondary-100 pt-6">
                        <textarea className="w-full border border-secondary-200 rounded-lg p-3 outline-none focus:border-primary-500" rows={3} placeholder={
                            p.status === 'Clarification' ? 'Faça perguntas apenas para entender a proposta (sem opiniões)...' :
                            p.status === 'Reaction' ? 'O que você achou? Compartilhe reações rápidas...' :
                            'Você tem alguma objeção baseada em risco? A proposta não é segura o suficiente para tentar?'
                        }></textarea>
                        <div className="mt-3 flex justify-end gap-3">
                            {p.status === 'Objection' && (
                                <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">Consentir (Sem Objeções)</button>
                            )}
                            <button className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium">Enviar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}