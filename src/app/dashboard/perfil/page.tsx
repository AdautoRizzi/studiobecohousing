'use client';

import React from 'react';

export default function PerfilPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 min-h-[80vh] flex flex-col items-center justify-center text-center px-4">

            <div className="bg-primary-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner relative overflow-hidden ring-4 ring-white border border-gray-100">
                <span className="text-4xl text-primary-300 font-bold">JD</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-primary-900 tracking-tight">Meu Perfil do Morador</h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mt-4 leading-relaxed font-medium">
                Personalize como seus vizinhos te veem na comunidade e gerencie as preferências da sua casa.
            </p>

            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm mt-8 max-w-3xl w-full">
                <h3 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-widest text-left">Nas próximas atualizações:</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-50 text-secondary-600 flex items-center justify-center font-bold text-xl shrink-0">👤</div>
                        <div>
                            <h4 className="font-bold text-gray-900">Dados Pessoais</h4>
                            <p className="text-sm text-gray-500 mt-1">Alterar nome, telefone do WhatsApp de emergência, e inserir fotos da família.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-50 text-secondary-600 flex items-center justify-center font-bold text-xl shrink-0">🏠</div>
                        <div>
                            <h4 className="font-bold text-gray-900">Unidade (Casa)</h4>
                            <p className="text-sm text-gray-500 mt-1">Inclusão de agregados, filhos e regras de visita do seu módulo privado.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-50 text-secondary-600 flex items-center justify-center font-bold text-xl shrink-0">🐕</div>
                        <div>
                            <h4 className="font-bold text-gray-900">Mascotes (Pets)</h4>
                            <p className="text-sm text-gray-500 mt-1">Cadastro fotográfico dos animais de estimação da sua moradia.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-50 text-secondary-600 flex items-center justify-center font-bold text-xl shrink-0">🔒</div>
                        <div>
                            <h4 className="font-bold text-gray-900">Segurança</h4>
                            <p className="text-sm text-gray-500 mt-1">Troca de senha de portaria e e-mails de recuperação.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-primary-500 font-bold bg-primary-50 px-6 py-3 rounded-full border border-primary-100">
                Página em Configuração... Em breve!
            </div>
        </div>
    );
}
