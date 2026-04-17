'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginAction } from '@/app/actions';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const res = await loginAction(email);

        setIsLoading(false);

        if (res.success) {
            router.push('/dashboard/governanca');
        } else {
            setError(res.error || 'Falha na autenticação.');
        }
    };

    return (
        <div className="min-h-screen bg-secondary-50 font-sans text-foreground flex flex-col">
            <PublicHeader />

            <main className="flex-1 flex items-center justify-center py-16 px-6">
                <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-secondary-100 w-full max-w-md">
                    <div className="text-center mb-10">
                        <img src="/logo.png" alt="Studio Be" className="h-16 w-auto mx-auto mb-6 scale-125" />
                        <h1 className="text-3xl font-bold text-primary-900 tracking-tight">Plataforma Studio Be</h1>
                        <p className="text-gray-500 mt-2">Faça login para acessar sua comunidade.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-700 p-4 border border-red-200 rounded-xl text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <Input
                                label="E-mail"
                                type="email"
                                placeholder="Seu e-mail cadastrado"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Input
                                label="Senha"
                                id="password"
                                name="password"
                                autoComplete="current-password"
                                type="password"
                                placeholder="Sua senha secreta"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" variant="secondary" size="lg" fullWidth disabled={isLoading} className="text-lg rounded-xl shadow-md h-14">
                            {isLoading ? 'Autenticando...' : 'Entrar na Plataforma'}
                        </Button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-gray-600">Ainda não tem acesso?</p>
                        <Link href="/registro" className="text-secondary-600 font-bold hover:text-secondary-800 transition-colors mt-2 inline-block">
                            Criar minha conta agora
                        </Link>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
