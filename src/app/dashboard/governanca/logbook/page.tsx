import { getGovData } from '@/lib/govStore';

export const dynamic = 'force-dynamic';

export default function LogbookPage() {
    const data = getGovData();
    const logbook = data.logbook;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">Logbook</h1>
                    <p className="text-gray-600 mt-1">Registro imutável das políticas, acordos e decisões ativas ("Seguro o suficiente para tentar").</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                <div className="p-6 border-b border-secondary-100 flex gap-4">
                    <input type="text" placeholder="Buscar no logbook..." className="flex-1 border border-secondary-200 rounded-lg px-4 py-2 outline-none focus:border-primary-500" />
                </div>
                {logbook.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="text-4xl mb-3">📖</div>
                        <p>O Logbook está vazio. Nenhuma política foi aprovada recentemente.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-secondary-100">
                        {logbook.map((l: any) => {
                            const circle = data.circles.find((c: any) => c.id === l.circleId);
                            return (
                                <div key={l.id} className="p-6 hover:bg-secondary-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{l.title}</h3>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200 font-medium">Revisar em: {new Date(l.reviewDate).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-3">{l.content}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-1 rounded">Origem: {circle?.name}</span>
                                        <span className="text-xs text-gray-400">Aprovado em: {new Date(l.createdAt).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
