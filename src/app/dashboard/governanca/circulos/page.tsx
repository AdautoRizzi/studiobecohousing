import { getGovData } from '@/lib/govStore';

export const dynamic = 'force-dynamic';

export default function CirculosPage() {
    const data = getGovData();
    const currentUser = { id: 'u2', name: 'Maria Santos' }; // Simulando usurio logado (membro do c2)
    const userCircles = data.roles.filter((r: any) => r.userId === currentUser.id).map((r: any) => r.circleId);

    const circles = data.circles.filter((c: any) => userCircles.includes(c.id));
    const roles = data.roles;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary-900">Crculos e Domnios</h1>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Novo Crculo</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {circles.map((c: any) => (
                    <div key={c.id} className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm relative">
                        <div className="absolute top-4 right-4 bg-secondary-100 text-secondary-800 text-xs px-2 py-1 rounded-full font-bold">
                            {c.parentCircleId ? 'Sub-crculo' : 'Crculo Geral'}
                        </div>
                        <h2 className="text-xl font-bold text-primary-900">{c.name}</h2>
                        <div className="mt-4 space-y-2">
                            <p className="text-sm text-gray-700"><strong>Domnio (Autoridade):</strong> {c.domain}</p>
                            <p className="text-sm text-gray-700"><strong>Propsito (Aim):</strong> {c.aim}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-secondary-100">
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Double Linking (Links)</h3>
                            <div className="space-y-1">
                                {roles.filter((r: any) => r.circleId === c.id).map((r: any) => (
                                    <div key={r.id} className="flex justify-between text-sm">
                                        <span className="text-gray-500">{r.roleType}</span>
                                        <span className="font-medium">{r.userName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}