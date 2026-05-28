import Link from 'next/link';

export default function GovernancaLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4 flex gap-4 overflow-x-auto">
                <Link href="/dashboard/governanca" className="px-4 py-2 bg-primary-50 text-primary-900 rounded-lg font-medium whitespace-nowrap hover:bg-primary-100 transition-colors">Início (Alertas)</Link>
                <Link href="/dashboard/governanca/circulos" className="px-4 py-2 bg-primary-50 text-primary-900 rounded-lg font-medium whitespace-nowrap hover:bg-primary-100 transition-colors">Círculos (Topologia)</Link>
                <Link href="/dashboard/governanca/propostas" className="px-4 py-2 bg-primary-50 text-primary-900 rounded-lg font-medium whitespace-nowrap hover:bg-primary-100 transition-colors">Decisão por Consentimento</Link>
                <Link href="/dashboard/governanca/eleicoes" className="px-4 py-2 bg-primary-50 text-primary-900 rounded-lg font-medium whitespace-nowrap hover:bg-primary-100 transition-colors">Eleições Sociocráticas</Link>
                <Link href="/dashboard/governanca/logbook" className="px-4 py-2 bg-primary-50 text-primary-900 rounded-lg font-medium whitespace-nowrap hover:bg-primary-100 transition-colors">Logbook (Histórico)</Link>
            </div>
            {children}
        </div>
    );
}