'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { submitCohousingFormAction } from '@/app/actions';
import { useRouter } from 'next/navigation';

// Constantes sincronizadas com o CohousingForm.tsx
const FAIXAS_ETARIAS = ['menos de 40 anos', '40 a 45 anos', '46 a 50 anos', '51 a 55 anos', '56 a 60 anos', '61 a 65 anos', '66 a 70 anos', '70 a 80 anos', 'mais de 80 anos'];
const GENEROS = ['Feminino', 'Masculino', 'Não Binário', 'Prefiro não dizer'];
const TIPOS_COHOUSING = ['Cohousing Sênior (50+ anos)', 'Cohousing Intergeracional (Todas as idades)', 'Não tenho preferência'];
const TIPOLOGIAS = ['Studio', 'Casa/Apto 1 Dormitório', 'Casa/Apto 2 Dormitórios', 'Casa/Apto 3+ Dormitórios'];
const AREAS_RESIDENCIA = ['Até 50m²', '50 a 75m²', '75 a 100m²', 'Acima de 100m²'];
const COM_QUEM = ['Sozinho(a)', 'Com companheiro(a)', 'Com filhos', 'Com amigos/outros'];

const INTERESSES = ['Horta e Jardinagem', 'Cozinha Comunitária', 'Atividades Físicas', 'Artes e Oficinas', 'Cinema e Cultura', 'Coworking / Trabalho', 'Meditação / Yoga', 'Festas e Eventos'];
const VALORES = ['Privacidade', 'Ajuda Mútua', 'Sustentabilidade', 'Segurança', 'Economia Compartilhada', 'Redução de Solidão', 'Gestão Participativa'];
const EMPREENDER = ['Sou investidor', 'Quero apenas morar', 'Posso ajudar na gestão', 'Tenho terreno/parceria', 'Quero co-criar o projeto'];

export default function ManualLeadForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        moradiaAtual: '',
        idade: '',
        profissao: '',
        genero: '',
        ondeMorar: '',
        tipoCohousing: '',
        tipologia: '',
        comQuem: '',
        totalPessoas: '1',
        areaResidencia: '',
        dormitorios: '1',
        suites: '0',
        interesses: [] as string[],
        empreender: [] as string[],
        valores: [] as string[]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: 'interesses' | 'empreender' | 'valores', value: string) => {
        setFormData(prev => {
            const current = prev[name];
            if (current.includes(value)) {
                return { ...prev, [name]: current.filter(i => i !== value) };
            } else {
                return { ...prev, [name]: [...current, value] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await submitCohousingFormAction(formData);
            if (res.success) {
                router.push(`/admin/crm/lead/${res.leadId}`);
            }
        } catch (error) {
            alert('Erro ao cadastrar lead.');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">1. Dados Básicos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                        <input name="nome" type="text" onChange={handleChange} required className="w-full h-12 px-4 rounded-xl border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">E-mail</label>
                        <input name="email" type="email" onChange={handleChange} required className="w-full h-12 px-4 rounded-xl border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Telefone / WhatsApp</label>
                        <input name="telefone" type="text" onChange={handleChange} placeholder="(00) 00000-0000" required className="w-full h-12 px-4 rounded-xl border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Idade</label>
                        <select name="idade" onChange={handleChange} required className="w-full h-12 px-4 rounded-xl border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Selecione...</option>
                            {FAIXAS_ETARIAS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Gênero</label>
                        <select name="genero" onChange={handleChange} required className="w-full h-12 px-4 rounded-xl border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Selecione...</option>
                            {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">2. Preferências de Moradia</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Onde deseja morar?</label>
                        <input name="ondeMorar" type="text" onChange={handleChange} placeholder="Ex: Interior de SP" className="w-full h-12 px-4 rounded-xl border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Com quem vai morar?</label>
                        <select name="comQuem" onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Selecione...</option>
                            {COM_QUEM.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Tipologia</label>
                        <select name="tipologia" onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Selecione...</option>
                            {TIPOLOGIAS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Área Pretendida</label>
                        <select name="areaResidencia" onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Selecione...</option>
                            {AREAS_RESIDENCIA.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">3. Perfil e Interesses</h2>
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-3">Interesses Coletivos</label>
                        <div className="flex flex-wrap gap-2">
                            {INTERESSES.map(i => (
                                <button key={i} type="button" onClick={() => handleCheckboxChange('interesses', i)} className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${formData.interesses.includes(i) ? 'bg-primary-600 text-white border-primary-600' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                    {i}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-3">Valores</label>
                        <div className="flex flex-wrap gap-2">
                            {VALORES.map(v => (
                                <button key={v} type="button" onClick={() => handleCheckboxChange('valores', v)} className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${formData.valores.includes(v) ? 'bg-secondary-600 text-white border-secondary-600' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button type="submit" disabled={loading} className="flex-1 h-14 rounded-2xl text-lg">
                    {loading ? 'Cadastrando...' : 'Cadastrar Manualmente'}
                </Button>
                <button type="button" onClick={() => router.back()} className="px-8 h-14 rounded-2xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50">Cancelar</button>
            </div>
        </form>
    );
}
