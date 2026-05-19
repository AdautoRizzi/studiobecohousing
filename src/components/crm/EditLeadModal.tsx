'use client';

import React, { useState } from 'react';
import { updateLeadDetailsAction } from '@/app/actions';

interface EditLeadModalProps {
    lead: {
        id: string;
        nome: string;
        email: string;
        telefone: string;
    };
    onClose: () => void;
}

export default function EditLeadModal({ lead, onClose }: EditLeadModalProps) {
    const [nome, setNome] = useState(lead.nome);
    const [email, setEmail] = useState(lead.email);
    const [telefone, setTelefone] = useState(lead.telefone);
    const [loading, setLoading] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateLeadDetailsAction(lead.id, nome, email, telefone);
            if (res.success) {
                onClose();
            } else {
                alert('Erro ao atualizar: ' + res.error);
            }
        } catch (error: any) {
            alert('Erro inesperado: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
                
                <h3 className="text-xl font-bold text-gray-900 mb-6">Editar Contato</h3>
                
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Nome</label>
                        <input 
                            type="text" 
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500" 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">E-mail</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500" 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Telefone</label>
                        <input 
                            type="text" 
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500" 
                        />
                    </div>
                    
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-full text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-6 py-2.5 bg-primary-600 text-white rounded-full font-bold shadow-md hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
