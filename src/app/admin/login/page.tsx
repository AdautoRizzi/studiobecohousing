'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLoginAction } from '@/app/actions';
import { Button } from '@/components/ui/Button';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const res = await adminLoginAction(email, password);
        if (res.success) {
            router.push('/admin/crm');
        } else {
            setError(res.error || 'Credenciais inválidas.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md text-center">
                <img src="/logo.png" alt="Studio Be" className="h-16 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-primary-900 mb-2">Acesso Administrativo</h1>
                <p className="text-gray-500 mb-8 text-sm">Faça login para acessar o CRM e moderação.</p>
                
                {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-xl text-sm font-semibold">{error}</div>}
                
                <form onSubmit={handleLogin} className="space-y-4 text-left">
                    <div>
                        <label className="text-sm font-bold text-gray-700">E-mail</label>
                        <input 
                            type="email" 
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 mt-1 focus:ring-2 focus:ring-primary-500 outline-none" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700">Senha</label>
                        <input 
                            type="password" 
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 mt-1 focus:ring-2 focus:ring-primary-500 outline-none" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <Button type="submit" className="w-full h-12 rounded-xl mt-4">Entrar no Painel</Button>
                </form>
            </div>
        </div>
    );
}
