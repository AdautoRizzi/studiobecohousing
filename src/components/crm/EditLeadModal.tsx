'use client';

import React, { useState } from 'react';
import { updateLeadDetailsAction } from '@/app/actions';

interface EditLeadModalProps {
    lead: any;
    onClose: () => void;
}

export default function EditLeadModal({ lead, onClose }: EditLeadModalProps) {
    const [formData, setFormData] = useState({
        nome: lead.nome || '',
        email: lead.email || '',
        telefone: lead.telefone || '',
        idade: lead.idade || '',
        profissao: lead.profissao || '',
        genero: lead.genero || '',
        moradiaAtual: lead.moradiaAtual || '',
        ondeMorar: lead.ondeMorar || '',
        tipologia: lead.tipologia || '',
        categoria: lead.categoria || '',
        observacoes: lead.observacoes || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateLeadDetailsAction(lead.id, formData);
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
            <div className="bg-[#0f172a] rounded-3xl p-6 md:p-8 w-full max-w-3xl shadow-2xl relative max-h-[95vh] flex flex-col">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 z-10"
                >
                    ✕
                </button>
                
                <h3 className="text-2xl font-bold text-slate-50 mb-6 flex-shrink-0">Editar Informações Gerais</h3>
                
                <div className="overflow-y-auto flex-1 pr-2 -mr-2">
                    <form onSubmit={handleSave} className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Nome Completo</label>
                            <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full h-12 bg-[#020617] rounded-xl px-4 border border-slate-800 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">E-mail</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-12 bg-[#020617] rounded-xl px-4 border border-slate-800 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Telefone / WhatsApp</label>
                            <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full h-12 bg-[#020617] rounded-xl px-4 border border-slate-800 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Categoria no CRM</label>
                            <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full h-12 bg-[#020617] rounded-xl px-4 border border-slate-800 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                                <option value="Lead Site">Lead Site</option>
                                <option value="Pesquisa Antiga">Pesquisa Antiga</option>
                                <option value="Stakeholder">Stakeholder</option>
                                <option value="Investidor">Investidor</option>
                                <option value="Proprietário de Área">Proprietário de Área</option>
                                <option value="Parceiro">Parceiro</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Idade</label>
                            <input type="text" name="idade" value={formData.idade} onChange={handleChange} className="w-full h-12 bg-[#020617] rounded-xl px-4 border border-slate-800 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Profissão</label>
                            <input type="text" name="profissao" value={formData.profissao} onChange={handleChange} className="w-full h-12 bg-[#020617] rounded-xl px-4 border border-slate-800 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Gênero</label>
                            <input type="text" name="genero" value={formData.genero} onChange={handleChange} className="w-full h-12 bg-[#020617] rounded-xl px-4 border border-slate-800 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Onde mora atualmente?</label>
                            <input type="text" name="moradiaAtual" value={formData.moradiaAtual} onChange={handleChange} className="w-full h-12 bg-[#020617] rounded-xl px-4 border border-slate-800 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Onde deseja morar?</label>
                            <input type="text" name="ondeMorar" value={formData.ondeMorar} onChange={handleChange} className="w-full h-12 bg-[#020617] rounded-xl px-4 border border-slate-800 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Tipologia Desejada</label>
                            <input type="text" name="tipologia" value={formData.tipologia} onChange={handleChange} className="w-full h-12 bg-[#020617] rounded-xl px-4 border border-slate-800 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Observações Adicionais</label>
                            <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} className="w-full h-32 bg-[#020617] rounded-xl p-4 border border-slate-800 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-full text-slate-300 font-bold hover:bg-slate-800 transition-colors"
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
        </div>
    );
}
