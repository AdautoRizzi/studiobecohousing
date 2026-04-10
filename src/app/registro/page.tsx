'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { registerAction } from '@/app/actions';

export default function RegistroPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const res = await registerAction(email, name, phone);
        setIsLoading(false);

        if (res.success) {
            setIsSuccess(true);
        } else {
            setError(res.error || 'Erro ao criar conta.');
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-secondary-50 font-sans text-foreground flex flex-col">
                <PublicHeader />
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-white p-10 rounded-[2rem] shadow-xl max-w-lg border border-secondary-100">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                        <h2 className="text-3xl font-bold text-primary-900 mb-4">Cadastro Completo!</h2>
                        <p className="text-gray-600 mb-6 text-lg">
                            Seu acesso foi registrado, mas está <strong className="text-secondary-600">Pendente de Aprovação</strong>. Para solicitar sua entrada, clique abaixo e envie a mensagem pré-pronta para a gerência da Studio Be.
                        </p>

                        <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm font-semibold mb-8 border border-orange-100 text-center">
                            A liberação do seu acesso pode acontecer em até 24 horas.
                        </div>

                        <a
                            href={`https://wa.me/5511934898990?text=Ol%C3%A1%20StudioBe%21%20Acabei%20de%20registrar%20meu%20acesso%20de%20morador%20no%20portal%20com%20o%20e-mail%20${email}.%20Podem%20me%20liberar%3F`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-3 w-full justify-center mb-4"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.927 3.151.927 3.181 0 5.767-2.586 5.767-5.766 0-3.18-2.586-5.769-5.769-5.769zM12.031 15.939c-1.127 0-1.924-.343-2.613-.75l-.187-.111-1.29.339.345-1.259-.122-.194c-.45-.718-.737-1.503-.736-2.432 0-2.316 1.885-4.201 4.203-4.201 2.316 0 4.201 1.885 4.201 4.201 0 2.315-1.885 4.207-4.201 4.207z" />
                                <path d="M14.498 12.871c-.135-.068-.801-.395-.925-.44-.124-.045-.214-.068-.305.068-.09.135-.35.44-.429.53-.079.09-.158.101-.293.033-.135-.068-.571-.21-1.087-.671-.401-.358-.673-.801-.752-.936-.079-.135-.008-.209.059-.276.063-.063.135-.158.203-.236.068-.079.09-.135.135-.225.045-.09.023-.169-.011-.236-.034-.068-.304-.734-.416-1.006-.11-.264-.221-.228-.305-.232-.079-.004-.169-.004-.26-.004s-.236.034-.36.169c-.124.135-.473.462-.473 1.127 0 .664.484 1.307.552 1.398.068.09 1.137 1.8 2.75 2.454.673.272 1.198.435 1.609.557.676.2 1.291.171 1.777.104.542-.075 1.666-.681 1.897-1.338.231-.658.231-1.222.163-1.338-.068-.117-.248-.184-.383-.252z" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.745.448 3.385 1.228 4.821L2 22l5.356-1.168A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.423c-1.488 0-2.894-.383-4.129-1.045l-.296-.159-3.078.672.684-2.951-.174-.301A8.428 8.428 0 013.577 12c0-4.646 3.777-8.423 8.423-8.423 4.646 0 8.423 3.777 8.423 8.423 0 4.646-3.777 8.423-8.423 8.423z" />
                            </svg>
                            Notificar Administração
                        </a>

                        <Link href="/login" className="text-primary-600 font-bold hover:underline">
                            Já avisei, quero ir para o Login
                        </Link>
                    </div>
                </main>
                <PublicFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-50 font-sans text-foreground flex flex-col">
            <PublicHeader />

            <main className="flex-1 flex items-center justify-center py-16 px-6">
                <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-secondary-100 w-full max-w-lg">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary-900 tracking-tight">Criar Acesso</h1>
                        <p className="text-gray-500 mt-2">Cadastre-se para acessar o painel do morador.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-700 p-4 border border-red-200 rounded-xl text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <Input label="Nome Completo" placeholder="Ex: Maria Silva" value={name} onChange={(e) => setName(e.target.value)} required />
                            <Input label="Telefone / WhatsApp" placeholder="(11) 90000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            <Input label="E-mail" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <Input label="Criar Senha" id="password" name="password" type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        <Button type="submit" variant="secondary" size="lg" fullWidth disabled={isLoading} className="text-lg rounded-xl shadow-md h-14 mt-6">
                            {isLoading ? 'Registrando...' : 'Registrar Acesso'}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-600">Já possui uma conta?</p>
                        <Link href="/login" className="text-primary-600 font-bold hover:text-primary-800 transition-colors mt-2 inline-block">
                            Fazer login
                        </Link>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
