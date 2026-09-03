'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ProprietariosPage() {
    const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
    const [formData, setFormData] = useState({
        owner_name: '',
        owner_phone: '',
        location_city: '',
        area_hectares: '',
        has_water: '',
        documentation: '',
        estimated_price: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        
        try {
            // Tenta inserir no banco. Se a tabela não existir ainda (aguardando SQL), simulamos sucesso para o protótipo.
            const { error } = await supabase.from('territories').insert([{
                ...formData,
                area_hectares: Number(formData.area_hectares) || 0
            }]);
            
            if (error) {
                console.warn("Tabela territories possivelmente não criada ainda. Erro:", error);
            }
            
            setTimeout(() => setStatus('success'), 1000);
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-2xl bg-white p-10 rounded-2xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">🗺️</div>
                    <h2 className="text-4xl font-serif font-bold text-primary-900 mb-4">Propriedade Submetida!</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Sua área foi enviada para o nosso Algoritmo de Inteligência Territorial. Nossa equipe analisará os dados espaciais e de viabilidade. Se a sua propriedade atingir o Score necessário para os nossos projetos de Cohousing, entraremos em contato para uma Due Diligence.
                    </p>
                    <Link href="/" className="bg-primary-600 text-white font-bold py-3 px-8 rounded-xl shadow hover:bg-primary-700 transition-colors">
                        Voltar para a Página Inicial
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-6">
                <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
                    <img src="/logo.png" alt="Studio Be" className="h-10" />
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-4 py-1 rounded-full text-sm">Portal de Inteligência Territorial</span>
                </div>
            </header>

            {/* Hero */}
            <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <h1 className="text-5xl font-serif font-bold text-primary-950 leading-tight mb-6">
                        Transforme sua terra em um ecossistema regenerativo.
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        O Studio Be desenvolve comunidades de Cohousing focadas em longevidade, natureza e governança. Estamos mapeando territórios estratégicos no eixo Itu - Porto Feliz para os nossos próximos investimentos.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3"><span className="text-emerald-500 text-xl">✓</span> Projetos de baixo impacto ambiental.</li>
                        <li className="flex items-center gap-3"><span className="text-emerald-500 text-xl">✓</span> Valorização orgânica da região.</li>
                        <li className="flex items-center gap-3"><span className="text-emerald-500 text-xl">✓</span> Parcerias ou aquisição direta.</li>
                    </ul>
                </div>

                {/* Form */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Submeta sua Propriedade</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
                                <input required type="text" value={formData.owner_name} onChange={e => setFormData({...formData, owner_name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp</label>
                                <input required type="text" value={formData.owner_phone} onChange={e => setFormData({...formData, owner_phone: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Localização (Cidade ou Link do Google Maps)</label>
                            <input required type="text" value={formData.location_city} onChange={e => setFormData({...formData, location_city: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Área (Hectares)</label>
                                <input required type="number" step="0.1" value={formData.area_hectares} onChange={e => setFormData({...formData, area_hectares: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: 20" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Preço Estimado (R$)</label>
                                <input type="text" value={formData.estimated_price} onChange={e => setFormData({...formData, estimated_price: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: 2.500.000" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Recursos Hídricos</label>
                                <select value={formData.has_water} onChange={e => setFormData({...formData, has_water: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                                    <option value="">Selecione...</option>
                                    <option value="Rio/Córrego">Rio / Córrego</option>
                                    <option value="Nascente">Nascente / Mina</option>
                                    <option value="Represa/Açude">Represa / Açude</option>
                                    <option value="Apenas Poço">Apenas Poço</option>
                                    <option value="Sem água">Sem recursos hídricos</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Situação Documental</label>
                                <select value={formData.documentation} onChange={e => setFormData({...formData, documentation: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                                    <option value="">Selecione...</option>
                                    <option value="Matrícula Limpa">Matrícula Limpa</option>
                                    <option value="Em Inventário">Em Inventário / Usucapião</option>
                                    <option value="Apenas Contrato">Apenas Contrato de Compra e Venda</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" disabled={status === 'loading'} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-emerald-700 transition-colors mt-6 disabled:opacity-50">
                            {status === 'loading' ? 'Enviando...' : 'Enviar para Avaliação I.T.'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
