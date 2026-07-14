import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function CRMLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    if (!adminToken) {
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#0f172a] border-r border-slate-800 flex-shrink-0 flex flex-col">
                <div className="p-6 border-b border-slate-800 flex items-center justify-center">
                    <img src="/logo.png" alt="Studio Be CRM" className="h-12 w-auto object-contain" />
                </div>
                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4 px-3">Gestão</div>
                    <Link href="/admin/tasks" className="flex items-center gap-3 px-3 py-2 text-blue-400 bg-slate-800/50 hover:bg-slate-800 rounded-lg font-medium transition-colors border border-blue-500/20 mb-2">
                        <span className="text-xl">📋</span>
                        Tarefas Globais
                    </Link>
                    <Link href="/admin/sales" className="flex items-center gap-3 px-3 py-2 text-green-400 bg-slate-800/50 hover:bg-slate-800 rounded-lg font-medium transition-colors border border-green-500/20 mb-2">
                        <span className="text-xl">🚀</span>
                        Máquina de Vendas
                    </Link>
                    <Link href="/admin/crm" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-slate-800 rounded-lg font-medium transition-colors">
                        <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Leads & Contatos
                    </Link>
                    <Link href="/admin/crm/new" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-slate-800 rounded-lg font-medium transition-colors">
                        <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Novo Lead (Manual)
                    </Link>
                    <Link href="/admin/crm/templates" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-slate-800 rounded-lg font-medium transition-colors">
                        <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                        Templates de WhatsApp
                    </Link>
                    <Link href="/admin/marketing" className="flex items-center gap-3 px-3 py-2 text-primary-400 bg-slate-800/50 hover:bg-slate-800 rounded-lg font-medium transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                        Marketing (Ads & IA)
                    </Link>
                    <Link href="/admin/crm/kpis" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-slate-800 rounded-lg font-medium transition-colors">
                        <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        Métricas & KPIs
                    </Link>
                    
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-3">Antigo</div>
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-slate-800 rounded-lg font-medium transition-colors">
                        Aprovação Manual
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <p className="text-xs text-slate-400 font-medium truncate mb-3">Usuário: {adminToken.value}</p>
                    <Link href="/admin/login" className="flex items-center justify-center w-full py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">
                        Sair do CRM
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
