'use client';

import React from 'react';
import Link from 'next/link';
import FloatingAssistant from '@/components/chat/FloatingAssistant';
import { usePathname } from 'next/navigation';
import { ClientTierProvider, useClientTier, Tiers } from './ClientTierContext';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { tier, setTier } = useClientTier();

    const allNav = [
        { name: 'Minha Jornada', href: '/dashboard', icon: '🗺️', minTier: 0, exact: true },
        { name: 'Meu Perfil', href: '/dashboard/perfil', icon: '👤', minTier: 0 },
        { name: 'Treinamentos', href: '/dashboard/cursos', icon: '🎓', minTier: 0 },
        { name: 'Comunidade & Vizinhos', href: '/dashboard/comunidade', icon: '🏘️', minTier: 3 },
        { name: 'Governança & Fórum', href: '/dashboard/governanca', icon: '⚖️', minTier: 4 },
        { name: 'Eventos da Vila', href: '/dashboard/eventos', icon: '🎉', minTier: 4 },
        { name: 'Finanças & Boletos', href: '/dashboard/financas', icon: '💸', minTier: 7 },
        { name: 'Serviços & Manutenção', href: '/dashboard/servicos', icon: '🛠️', minTier: 9 },
        { name: 'Sustentabilidade', href: '/dashboard/sustentabilidade', icon: '♻️', minTier: 9 },
        { name: 'Horta Comunitária', href: '/dashboard/horta', icon: '🍅', minTier: 9 },
    ];

    const visibleNav = allNav.filter(item => tier >= item.minTier);

    return (
        <div className="flex h-screen bg-secondary-50 font-sans">
            <aside className="w-64 bg-secondary-900 text-white flex flex-col hidden md:flex overflow-y-auto">
                <div className="p-4 flex items-center bg-white mx-4 mt-6 mb-2 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <Link href="/dashboard">
                        <img src="/logo.png" alt="Studio Be" className="h-16 w-auto object-contain mx-auto" />
                    </Link>
                </div>

                <div className="px-6 py-4 border-b border-secondary-800 text-sm">
                    <p className="text-secondary-100 font-medium">Jornada do Cliente</p>
                    <p className="text-secondary-200 text-xs mt-1">Status: Nível {tier}</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {visibleNav.map((item) => {
                        const isActive = (item as any).exact ? pathname === item.href : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                    ${isActive ? 'bg-secondary-800 text-white shadow-sm' : 'text-secondary-100 hover:bg-secondary-800/50 hover:text-white'}
                                `}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden bg-secondary-50 relative">
                <header className="h-16 border-b border-secondary-100 bg-white flex items-center justify-between px-8">
                    <span className="text-lg font-bold text-primary-900 md:hidden">Studio Be</span>
                    <div className="hidden md:flex flex-1"></div>
                    
                    <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 shadow-sm">
                        <span className="text-sm font-semibold text-blue-900">🛠️ Admin Simulador:</span>
                        <select 
                            className="text-sm border border-blue-200 rounded p-1.5 bg-white text-blue-900 font-medium cursor-pointer"
                            value={tier}
                            onChange={(e) => setTier(Number(e.target.value))}
                        >
                            {Tiers.map(t => (
                                <option key={t.level} value={t.level}>
                                    {t.level} - {t.name.substring(0, 20)}{t.name.length > 20 ? '...' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-4 md:p-8 lg:p-12">
                    {children}
                </div>
                <FloatingAssistant />
            </main>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClientTierProvider>
            <DashboardContent>{children}</DashboardContent>
        </ClientTierProvider>
    );
}
