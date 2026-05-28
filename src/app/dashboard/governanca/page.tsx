import { getGovData } from '@/lib/govStore';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function GovDashboard() {
    const data = getGovData();
    // Simulando o Líder (u1) ou Delegado (u2) logado
    const currentUser = { id: 'u2', name: 'Maria Santos' }; 
    
    // Obter papéis do usuário
    const userRoles = data.roles.filter((r: any) => r.userId === currentUser.id);
    const userRoleIds = userRoles.map((r: any) => r.id);
    const userCircleIds = userRoles.map((r: any) => r.circleId);

    // Filtrar notificações para o usuário
    const myNotifications = data.notifications.filter((n: any) => n.userId === currentUser.id);

    // Filtrar tensões
    // Tensões que são de círculos onde sou Líder (top-down) ou onde sou Delegado escalando (bottom-up)
    const myTensions = data.tensions.filter((t: any) => 
        userCircleIds.includes(t.circleId) || userRoleIds.includes(t.assignedToRole)
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-primary-900">Minhas Tensões e Alertas</h1>
            <p className="text-gray-600">Acompanhe responsabilidades de Double Linking escaladas para os seus Círculos.</p>
            
            {myNotifications.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold text-orange-800 mb-2">🔔 Alertas Recentes</h3>
                    <ul className="space-y-2">
                        {myNotifications.map((n: any) => (
                            <li key={n.id} className="text-sm text-orange-900 flex justify-between items-center">
                                <span><strong>{n.title}:</strong> {n.message}</span>
                                {!n.read && <span className="bg-orange-200 text-orange-800 px-2 py-1 text-xs rounded-full">Novo</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                    <div className="p-4 bg-primary-50 border-b border-primary-100 font-bold text-primary-900">
                        Tensões no meu Domínio (Pautas)
                    </div>
                    <div className="p-4 space-y-4">
                        {myTensions.length === 0 ? <p className="text-sm text-gray-500">Nenhuma tensão pendente.</p> : null}
                        {myTensions.map((t: any) => {
                            const circle = data.circles.find((c: any) => c.id === t.circleId);
                            const assignedToMe = userRoleIds.includes(t.assignedToRole);
                            return (
                                <div key={t.id} className="border border-secondary-100 p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900">{t.title}</h4>
                                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-bold">Pendente</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{t.content}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>Círculo: {circle?.name}</span>
                                        {assignedToMe && <span className="text-blue-600 font-bold">🙋‍♀️ Sua responsabilidade escalar</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}