'use client';

import React, { useState, useRef, useEffect } from 'react';

type Message = {
    role: 'user' | 'assistant';
    content: string;
    agent?: string;
};

export default function FloatingAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Olá! Sou o Orquestrador da Comunidade. Como posso ajudar com sua jornada no StudioBe hoje?', agent: 'Orquestrador' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat-agentes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await res.json();
            
            if (data.reply) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply, agent: data.agent }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, tive um problema ao processar sua solicitação.' }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Erro de conexão com o servidor.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-[350px] sm:w-[400px] h-[500px] mb-4 flex flex-col border border-slate-200 overflow-hidden transform transition-all duration-300">
                    <div className="bg-primary-900 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Assistente StudioBe</h3>
                                <p className="text-xs text-primary-200">Online</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-primary-200 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                {m.role === 'assistant' && m.agent && (
                                    <span className="text-[10px] text-slate-500 mb-1 ml-1 font-semibold">{m.agent}</span>
                                )}
                                <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start">
                                <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-500 rounded-bl-none shadow-sm flex gap-1">
                                    <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 bg-white border-t border-slate-200">
                        <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value={input} 
                                onChange={e => setInput(e.target.value)} 
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder="Digite sua mensagem..." 
                                className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700"
                            />
                            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white rounded-full p-2 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`${isOpen ? 'bg-slate-700' : 'bg-primary-600'} text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95`}
                style={{ marginBottom: '80px' }} 
            >
                {isOpen ? (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    
                    <div className="relative flex items-center justify-center w-full h-full">
                        <div className="absolute right-[60px] bg-white px-3 py-1 rounded-lg shadow-md whitespace-nowrap text-sm font-bold text-primary-700 animate-pulse pointer-events-none before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:-right-2 before:border-t-[6px] before:border-t-transparent before:border-b-[6px] before:border-b-transparent before:border-l-[8px] before:border-l-white">✨ Fale com a Inteligência Artificial</div>
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    </div>

                )}
            </button>
        </div>
    );
}
