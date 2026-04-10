'use client';

import React from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { Button } from '@/components/ui/Button';

export default function EmConstrucaoPage() {
    return (
        <div className="min-h-screen bg-secondary-50 font-sans text-foreground flex flex-col">
            <PublicHeader />

            <main className="flex-1 flex items-center justify-center py-24 px-6 text-center animate-in fade-in duration-700">
                <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-secondary-100 w-full max-w-2xl">
                    <div className="w-24 h-24 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner animate-bounce">
                        🚧
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-900 tracking-tight mb-4">
                        Página em Construção
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
                        Esta funcionalidade será ativada nas próximas atualizações da plataforma Studio Be. Agradecemos a sua compreensão!
                    </p>
                    
                    <Link href="/">
                        <Button variant="secondary" size="lg" className="rounded-full shadow-md text-lg">
                            Voltar para o Início
                        </Button>
                    </Link>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
