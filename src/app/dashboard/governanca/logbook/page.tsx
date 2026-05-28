import { getGovData } from '@/lib/govStore';

export const dynamic = 'force-dynamic';

export default function LogbookPage() {
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
                <div className="p-12 text-center text-gray-500">
                    <div className="text-4xl mb-3">📖</div>
                    <p>O Logbook está vazio. Nenhuma política foi aprovada recentemente.</p>
                </div>
            </div>
        </div>
    );
}