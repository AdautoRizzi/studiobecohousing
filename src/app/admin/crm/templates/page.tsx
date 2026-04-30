import React from 'react';
import { getMessageTemplates } from '@/lib/db';
import { createTemplateAction } from '@/app/actions';
import { Button } from '@/components/ui/Button';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
    const templates = await getMessageTemplates();

    async function handleSubmit(formData: FormData) {
        'use server';
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        await createTemplateAction(title, content);
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Templates de Mensagens</h1>
                    <p className="text-gray-500 mt-1">Crie mensagens padrão para agilizar o contato via WhatsApp.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Criar Novo Template */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 sticky top-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Novo Template</h2>
                        <form action={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Título</label>
                                <input name="title" type="text" placeholder="Ex: Boas-vindas" className="w-full h-10 px-3 rounded-lg border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500" required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Mensagem</label>
                                <textarea name="content" rows={6} placeholder="Use {nome} para personalizar automaticamente." className="w-full p-3 rounded-lg border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm" required></textarea>
                            </div>
                            <Button type="submit" className="w-full h-10 rounded-lg">Salvar Template</Button>
                        </form>
                    </div>
                </div>

                {/* Lista de Templates */}
                <div className="lg:col-span-2 space-y-4">
                    {templates.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-gray-300 text-gray-500">
                            Nenhum template cadastrado ainda.
                        </div>
                    ) : (
                        templates.map(t => (
                            <div key={t.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-primary-200 transition-colors">
                                <h3 className="font-bold text-gray-900 mb-2">{t.title}</h3>
                                <p className="text-gray-600 text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                                    "{t.content}"
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
