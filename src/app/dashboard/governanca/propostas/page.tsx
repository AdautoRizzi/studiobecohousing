import { getGovData } from '@/lib/govStore';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function PropostasPage() {
    const data = getGovData();
    const currentUser = { id: 'u2', name: 'Maria Santos' }; // Simulando usuário logado (membro do c2)
    const userCircles = data.roles.filter((r: any) => r.userId === currentUser.id).map((r: any) => r.circleId);

    const proposals = data.proposals.filter((p: any) => userCircles.includes(p.circleId));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary-900">Tomada de Decisão por Consentimento</h1>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Nova Proposta</button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                <div className="divide-y divide-secondary-100">
                    {proposals.map((p: any) => (
                        <Link href={`/dashboard/governanca/propostas/${p.id}`} key={p.id} className="block p-6 hover:bg-secondary-50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{p.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Autor: {p.authorName} &bull; Em resposta a: "{p.driver}"</p>
                                </div>
                                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide">
                                    Fase: {p.status}
                                </span>
                            </div>
                        </Link>
                    ))}
                    {proposals.length === 0 && <div className="p-6 text-gray-500 text-center">Nenhuma proposta ativa no momento.</div>}
                </div>
            </div>
        </div>
    );
}