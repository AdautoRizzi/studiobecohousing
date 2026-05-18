import React from 'react';
import { getMessageTemplates } from '@/lib/db';
import TemplateManagerClient from './TemplateManagerClient';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
    const templates = await getMessageTemplates();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Templates de Mensagens</h1>
                    <p className="text-gray-500 mt-1">Crie mensagens padrão para agilizar o contato via WhatsApp.</p>
                </div>
            </div>

            <TemplateManagerClient initialTemplates={templates} />
        </div>
    );
}
