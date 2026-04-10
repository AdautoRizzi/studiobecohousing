'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ParceiroRegistroPage() {
    const [formData, setFormData] = useState({
        nome: '',
        empresa: '',
        telefone: '',
        categoria: '',
        descricao: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const texto = `*NOVO PEDIDO DE PARCERIA - STUDIO BE*
        
*Nome do Profissional:* ${formData.nome}
*Empresa/Marca:* ${formData.empresa || 'Autônomo'}
*Telefone de Contato:* ${formData.telefone}
*Categoria de Serviço:* ${formData.categoria}

*Micro-currículo/Apresentação:*
${formData.descricao}

Olá Studio Be! Gostaria de submeter meus serviços para avaliação do conselho de moradores e me tornar um Parceiro Certificado da comunidade.`;

        const encodedText = encodeURIComponent(texto);
        window.location.href = `https://wa.me/5511934898990?text=${encodedText}`;
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Background com sobreposição escura */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070" className="w-full h-full object-cover" alt="Background" />
                <div className="absolute inset-0 bg-primary-900/90 mix-blend-multiply"></div>
            </div>

            <div className="max-w-2xl w-full space-y-8 bg-white p-10 md:p-14 rounded-[2rem] shadow-2xl relative z-10 my-8">
                <div className="text-center">
                    <Link href="/">
                        <img src="/logo.png" alt="Studio Be" className="mx-auto h-24 w-auto mb-6 hover:scale-105 transition-transform" />
                    </Link>
                    <div className="inline-block px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
                        Portal de Fornecedores
                    </div>
                    <h2 className="text-3xl font-extrabold text-primary-900 tracking-tight">
                        Trabalhe com Nossa Comunidade
                    </h2>
                    <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                        Ao se tornar um Parceiro Studio Be, seu contato é divulgado diretamente para a rede de moradores, priorizando o fomento da economia local e confiança mútua.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Nome Completo *</label>
                            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="w-full h-14 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none transition-all font-medium" placeholder="João da Silva" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Nome da Empresa (Opcional)</label>
                            <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} className="w-full h-14 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none transition-all font-medium" placeholder="Ex: Silva Manutenções" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">WhatsApp de Contato *</label>
                            <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} required className="w-full h-14 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none transition-all font-medium" placeholder="(11) 90000-0000" />
                        </div>

                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Área de Atuação *</label>
                            <select name="categoria" value={formData.categoria} onChange={handleChange} required className="w-full h-14 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none transition-all font-medium text-sm">
                                <option value="">Selecione sua categoria de serviço...</option>
                                <option value="Manutenção & Reformas">Manutenção & Construção (Encanador, Pedreiro, Elétrica)</option>
                                <option value="Saúde & Cuidadores">Saúde & Bem-Estar (Cuidadores, Fisio, Massoterapia)</option>
                                <option value="Beleza & Estética">Beleza Home-Care (Manicure, Cabelereiro)</option>
                                <option value="Transporte & Mobilidade">Transporte & Mobilidade (Motorista, Entregas)</option>
                                <option value="Outros Serviços Gerais">Outros Serviços Locais</option>
                            </select>
                        </div>

                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Resumo da sua Experiência *</label>
                            <textarea name="descricao" value={formData.descricao} onChange={handleChange} required rows={4} className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-secondary-500 outline-none transition-all font-medium text-sm resize-none" placeholder="Conte-nos um pouco sobre o seu serviço, sua experiência e por que deseja atender à nossa comunidade..."></textarea>
                        </div>
                    </div>

                    <div className="pt-4 pb-2">
                        <Button type="submit" variant="secondary" className="w-full h-14 text-lg font-bold shadow-lg shadow-secondary-600/30">
                            Enviar Dados para Análise
                        </Button>
                    </div>
                </form>

                <div className="text-center">
                    <Link href="/" className="font-medium text-sm text-gray-500 hover:text-primary-600 transition-colors">
                        Voltar para o site principal
                    </Link>
                </div>
            </div>
        </div>
    );
}
