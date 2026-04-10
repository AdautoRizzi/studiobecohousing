'use client';

import React, { useEffect, useState } from 'react';
import { getPendingUsersAction, approveUserAction } from '@/app/actions';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AdminPage() {
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [abaAtiva, setAbaAtiva] = useState<'moradores' | 'parceiros'>('moradores');
    const [alerta, setAlerta] = useState('');

    const [parceirosData, setParceirosData] = useState<any[]>([
        { id: 1, nome: 'Carlos Eletricista', empresa: 'Luz & Cia', categoria: 'Manutenção & Construção', telefone: '(11) 91111-2222', dataSolicitacao: '05/03/2026', status: 'Pendente' },
        { id: 2, nome: 'Dra. Ana Paula', empresa: 'Fisio HomeCare', categoria: 'Saúde & Cuidadores', telefone: '(11) 93333-4444', dataSolicitacao: '04/03/2026', status: 'Pendente' }
    ]);

    const loadUsers = async () => {
        setLoading(true);
        const users = await getPendingUsersAction();
        setPendingUsers(users);
        setLoading(false);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleApprove = async (email: string) => {
        await approveUserAction(email);
        setAlerta(`Usuário ${email} aprovado com sucesso!`);
        setTimeout(() => setAlerta(''), 5000);
        loadUsers();
    };

    const handleAcaoParceiro = (id: number, acao: 'Aprovado' | 'Recusado') => {
        setParceirosData(prev => prev.map(p => p.id === id ? { ...p, status: acao } : p));
        setAlerta(`Parceiro ${acao.toLowerCase()}! Seu contato ${acao === 'Aprovado' ? 'será listado no Mural de Serviços' : 'foi removido'}.`);
        setTimeout(() => setAlerta(''), 5000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 md:p-16">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-10 text-center">
                    <img src="/logo.png" alt="Studio Be" className="h-16 w-auto object-contain" />
                    <Link href="/" className="text-primary-600 font-semibold hover:underline">Sair do Admin</Link>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-200">
                    <h1 className="text-3xl font-bold text-primary-900 mb-2">Painel de Administração</h1>
                    <p className="text-gray-500 mb-10 pb-6 border-b border-gray-100">Gerencie e aprove os acessos de novos moradores ao portal Studio Be.</p>

                    <div className="mb-8 border-b border-gray-200">
                        <nav className="flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setAbaAtiva('moradores')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${abaAtiva === 'moradores' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                Aprovação de Moradores
                                <span className={`ml-3 rounded-full py-0.5 px-2.5 text-xs font-medium ${abaAtiva === 'moradores' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-900'}`}>
                                    {pendingUsers.length}
                                </span>
                            </button>
                            <button
                                onClick={() => setAbaAtiva('parceiros')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${abaAtiva === 'parceiros' ? 'border-secondary-500 text-secondary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                Moderação de Parceiros
                                <span className={`ml-3 rounded-full py-0.5 px-2.5 text-xs font-medium ${abaAtiva === 'parceiros' ? 'bg-secondary-100 text-secondary-600' : 'bg-gray-100 text-gray-900'}`}>
                                    {parceirosData.filter(p => p.status === 'Pendente').length}
                                </span>
                            </button>
                        </nav>
                    </div>

                    {alerta && (
                        <div className="mb-6 bg-green-50 text-green-800 border border-green-200 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4">
                            <span className="font-semibold">{alerta}</span>
                        </div>
                    )}

                    {abaAtiva === 'moradores' && (
                        <>
                            {loading ? (
                                <p className="text-center text-gray-500 py-10">Carregando usuários...</p>
                            ) : pendingUsers.length === 0 ? (
                                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                                    <h3 className="text-lg font-bold text-gray-600">Nenhum morador pendente no momento!</h3>
                                    <p className="text-sm text-gray-400 mt-2">As novas solicitações de acesso aparecerão aqui.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingUsers.map(user => (
                                        <div key={user.email} className="flex flex-col md:flex-row justify-between items-center bg-white border border-secondary-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow gap-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-primary-900">{user.name}</h3>
                                                <p className="text-gray-500 text-sm mb-1">E-mail: {user.email}</p>
                                                <p className="text-gray-500 text-sm">WhatsApp: {user.phone}</p>
                                                <p className="text-xs text-secondary-600 font-semibold mt-2 bg-secondary-50 inline-block px-2 py-1 rounded">Acesso Pendente</p>
                                            </div>
                                            <Button onClick={() => handleApprove(user.email)} className="bg-green-600 hover:bg-green-700 text-white font-bold w-full md:w-auto h-12 rounded-xl">
                                                Libertar Acesso
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {abaAtiva === 'parceiros' && (
                        <div className="space-y-4 animate-in slide-in-from-right-8 duration-500">
                            {parceirosData.map((parceiro) => (
                                <div key={parceiro.id} className={`flex flex-col lg:flex-row items-center justify-between p-5 rounded-2xl border transition-all ${parceiro.status === 'Pendente' ? 'bg-white border-primary-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                                    <div className="flex items-center gap-5 w-full lg:w-auto">
                                        <div className="w-12 h-12 rounded-full bg-secondary-50 text-secondary-600 flex items-center justify-center font-bold text-lg shrink-0">
                                            🛠️
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-900 text-lg">{parceiro.nome}</h3>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${parceiro.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                                                        parceiro.status === 'Aprovado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {parceiro.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                                                <span>💼 <strong>{parceiro.empresa}</strong> / {parceiro.categoria}</span>
                                                <span>📱 {parceiro.telefone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 lg:mt-0 flex gap-2 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                                        {parceiro.status === 'Pendente' ? (
                                            <>
                                                <button onClick={() => handleAcaoParceiro(parceiro.id, 'Recusado')} className="flex-1 lg:flex-none px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors">
                                                    Recusar
                                                </button>
                                                <button onClick={() => handleAcaoParceiro(parceiro.id, 'Aprovado')} className="flex-1 lg:flex-none px-4 py-2 bg-secondary-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-secondary-700 transition-colors">
                                                    Liberar Vitrine
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-sm font-semibold text-gray-400 capitalize px-4 py-2">Ficha {parceiro.status.toLowerCase()}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
