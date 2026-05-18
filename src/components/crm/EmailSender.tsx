'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Lead, MessageTemplate } from '@/lib/db';
import { sendEmailAction } from '@/app/actions';

interface Props {
    lead: Lead;
    templates: MessageTemplate[];
}

export default function EmailSender({ lead, templates }: Props) {
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSend = async () => {
        if (!lead.email) {
            setErrorMsg('Este contato não possui um e-mail cadastrado.');
            return;
        }
        if (!subject.trim() || !content.trim()) {
            setErrorMsg('Por favor, preencha o assunto e a mensagem.');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setSuccess(false);

        // Preenche as variáveis automaticamente
        const finalSubject = subject.replace(/{nome}/g, lead.nome.split(' ')[0]);
        const finalContent = content.replace(/{nome}/g, lead.nome.split(' ')[0]);

        const res = await sendEmailAction(lead.id, lead.email, finalSubject, finalContent);
        if (res.success) {
            setSuccess(true);
            setSubject('');
            setContent('');
        } else {
            setErrorMsg(res.error || 'Erro ao enviar e-mail. Verifique as configurações (EMAIL_USER / EMAIL_PASS).');
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm">✉️</span>
                Enviar E-mail
            </h2>
            
            {!lead.email ? (
                <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm border border-orange-200 font-medium">
                    O e-mail deste contato não foi preenchido.
                </div>
            ) : (
                <div className="space-y-4">
                    {templates && templates.length > 0 && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Usar Template (Opcional)</label>
                            <select 
                                value={selectedTemplate}
                                onChange={(e) => {
                                    const tId = e.target.value;
                                    setSelectedTemplate(tId);
                                    if (tId) {
                                        const t = templates.find(x => x.id.toString() === tId);
                                        if (t) {
                                            setSubject(t.title);
                                            setContent(t.content);
                                        }
                                    }
                                }}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                            >
                                <option value="">Selecione um template rápido...</option>
                                {templates.map(t => (
                                    <option key={t.id} value={t.id}>{t.title}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Assunto</label>
                        <input 
                            type="text" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Assunto do E-mail..."
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Mensagem (Corpo do E-mail)</label>
                        <textarea 
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm" 
                            placeholder={`Escreva sua mensagem aqui...\n\nDica: Use {nome} para inserir o primeiro nome (${lead.nome.split(' ')[0]}) automaticamente.`}
                        ></textarea>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm border border-red-200 font-medium">
                            {errorMsg}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm border border-green-200 font-medium">
                            E-mail enviado e registrado no histórico com sucesso!
                        </div>
                    )}

                    <Button onClick={handleSend} disabled={loading} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold flex items-center justify-center gap-2">
                        {loading ? 'Enviando...' : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Enviar E-mail para {lead.email}
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
