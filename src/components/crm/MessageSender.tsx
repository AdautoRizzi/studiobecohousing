'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { queueMessageAction } from '@/app/actions';

interface Template {
    id: number;
    title: string;
    content: string;
}

export function MessageSender({ leadId, leadNome, templates }: { leadId: string, leadNome: string, templates: Template[] }) {
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ success?: boolean, error?: string }>({});

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = e.target.value;
        setSelectedTemplate(templateId);
        
        const template = templates.find(t => t.id.toString() === templateId);
        if (template) {
            // Personaliza com o nome do lead
            const personalized = template.content.replace(/{nome}/g, leadNome);
            setMessage(personalized);
        } else {
            setMessage('');
        }
    };

    const handleSend = async () => {
        if (!message) return;
        setLoading(true);
        setStatus({});

        const res = await queueMessageAction(leadId, message);
        
        if (res.success) {
            setStatus({ success: true });
            setMessage('');
            setSelectedTemplate('');
        } else {
            setStatus({ error: res.error });
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/></svg>
                Enviar WhatsApp via Robô
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Escolher Template</label>
                    <select 
                        value={selectedTemplate} 
                        onChange={handleTemplateChange}
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">-- Mensagem Personalizada --</option>
                        {templates.map(t => (
                            <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Mensagem</label>
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4} 
                        className="w-full p-3 rounded-lg border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                        placeholder="Escreva sua mensagem aqui..."
                    ></textarea>
                </div>

                {status.success && <div className="text-sm text-green-600 font-bold bg-green-50 p-2 rounded-lg">✅ Enviada para a fila do robô!</div>}
                {status.error && <div className="text-sm text-red-600 font-bold bg-red-50 p-2 rounded-lg">❌ Erro: {status.error}</div>}

                <Button 
                    onClick={handleSend} 
                    disabled={loading || !message}
                    className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700"
                >
                    {loading ? 'Enviando...' : 'Adicionar à Fila de Disparo'}
                </Button>
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest mt-2">
                    O Robô no seu PC enviará esta mensagem em instantes.
                </p>
            </div>
        </div>
    );
}
