import Link from 'next/link';

export default function GovernancaLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4 flex gap-4 overflow-x-auto">
                <Link href="/dashboard/governanca/circulos" className="px-4 py-2 bg-primary-50 text-primary-900 rounded-lg font-medium whitespace-nowrap hover:bg-primary-100 transition-colors">Crculos (Topologia)</Link>
                <Link href="/dashboard/governanca/propostas" className="px-4 py-2 bg-primary-50 text-primary-900 rounded-lg font-medium whitespace-nowrap hover:bg-primary-100 transition-colors">Deciso por Consentimento</Link>
                <Link href="/dashboard/governanca/eleicoes" className="px-4 py-2 bg-primary-50 text-primary-900 rounded-lg font-medium whitespace-nowrap hover:bg-primary-100 transition-colors">Eleies Sociocrticas</Link>
                <Link href="/dashboard/governanca/logbook" className="px-4 py-2 bg-primary-50 text-primary-900 rounded-lg font-medium whitespace-nowrap hover:bg-primary-100 transition-colors">Logbook (Histrico)</Link>
            </div>
            {children}
        </div>
    );
}