'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { submitCohousingFormAction } from '@/app/actions';
import { useRouter } from 'next/navigation';

// Sincronizado exatamente com CohousingForm.tsx
const FAIXAS_ETARIAS = ['menos de 40 anos', '40 a 45 anos', '46 a 50 anos', '51 a 55 anos', '56 a 60 anos', '61 a 65 anos', '66 a 70 anos', '70 a 80 anos', 'mais de 80 anos'];
const GENEROS = ['feminino', 'masculino', 'não binário', 'outro', 'prefiro não informar'];
const TIPOS_COHOUSING = ['Urbano em grandes metrópoles', 'Urbano em cidades do interior', 'Rural - próximo ao centro da cidade', 'Litoral', 'Indiferente'];
const TIPOLOGIAS = ['Casas', 'Apartamentos', 'Loft', 'Indiferente'];
const AREAS_RESIDENCIA = ['Até 50 m2', 'de 50 m2 a 80 m2', 'de 80 m2 a 120 m2', 'acima de 120 m2'];
const COM_QUEM = ['sozinha/o', 'com cônjuge ou companheira/o', 'com amigos e/ou familiares'];
const TOT_PESSOAS = ['1 pessoa', '2 pessoas', '3 pessoas', '4 pessoas'];
const QTD_DORMITORIOS = [
    { label: '1 dormitório', value: '1' },
    { label: '2 dormitórios', value: '2' },
    { label: '3 dormitórios', value: '3' },
    { label: 'Mais de 3', value: '4' }
];
const QTD_SUITES = [
    { label: '1 suíte', value: '1' },
    { label: '2 suítes', value: '2' },
    { label: '3 suítes', value: '3' },
    { label: 'Mais de 3', value: '4' }
];
const INTERESSES = ['Atividades culturais e artísticas', 'Alimentação compartilhada e gastronomia', 'Horta e jardinagem', 'Atividades físicas, esporte e lazer', 'Atividades de meditação ou contemplativas', 'Wellness (saúde e bem-estar)'];
const EMPREENDER = ['Não tenho interesse', 'Coworking', 'Dark kitchen (cozinha compartilhada)', 'Serviços na área de terapias, saúde e bem-estar', 'Cafeteria / restaurante', 'Prestação de serviços diversos', 'Conveniência / drogaria', 'Lavanderia auto-serviço', 'Espaço de eventos (artístico e cultural)'];
const VALORES = ['Rede de apoio para combater a solidão', 'Segurança e suporte integrados', 'Manutenção da autonomia e independência', 'Redução de custos de manutenção', 'Sustentabilidade', 'Contato com a natureza', 'Proximidade a serviços e comércio', 'Rede de serviços de manutenção das unidades'];

const CATEGORIAS = ['Lead Site', 'Pesquisa Antiga', 'Investidor', 'Proprietário de Área', 'Parceiro', 'Outro'];

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
        totalPessoas: '',
        areaResidencia: '',
        dormitorios: '',
        suites: '',
        interesses: [] as string[],
        empreender: [] as string[],
        valores: [] as string[],
        observacoes: '',
        origem: 'Admin CRM',
        categoria: 'Lead Site'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (field: 'interesses' | 'valores' | 'empreender', value: string) => {
        setFormData(prev => {
            const currentArray = prev[field];

            // Especial: Se marcar "não tenho interesse", limpa os outros (só para empreender)
            if (field === 'empreender' && value === 'Não tenho interesse') {
                return { ...prev, [field]: currentArray.includes(value) ? [] : [value] };
            }

            if (currentArray.includes(value)) {
                return { ...prev, [field]: currentArray.filter(i => i !== value) };
            } else {
                let newArray = field === 'empreender' ? currentArray.filter(i => i !== 'Não tenho interesse') : [...currentArray];
                newArray.push(value);
                return { ...prev, [field]: newArray };
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
            } else {
                alert('Erro: ' + res.error);
            }
        } catch (error) {
            console.error(error);
            alert('Erro crítico ao cadastrar lead.');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-10 pb-24">
            {/* 1. Dados Pessoais */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-primary-900 mb-8 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm">1</span>
                    Identificação e Perfil
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="md:col-span-2 lg:col-span-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categoria / Tipo</label>
                        <select name="categoria" value={formData.categoria} onChange={handleChange} required className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nome Completo</label>
                        <input name="nome" value={formData.nome} onChange={handleChange} required className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-mail</label>
                        <input name="email" value={formData.email} onChange={handleChange} required className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Telefone / WhatsApp</label>
                        <input name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" required className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Moradia Atual (Cidade/UF)</label>
                        <input name="moradiaAtual" value={formData.moradiaAtual} onChange={handleChange} required className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profissão Principal</label>
                        <input name="profissao" value={formData.profissao} onChange={handleChange} required className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Faixa Etária</label>
                        <select name="idade" value={formData.idade} onChange={handleChange} required className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Selecione...</option>
                            {FAIXAS_ETARIAS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gênero</label>
                        <select name="genero" value={formData.genero} onChange={handleChange} required className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Selecione...</option>
                            {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* 2. Preferências */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-primary-900 mb-8 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm">2</span>
                    A Casa e Localização
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Onde deseja morar?</label>
                        <input name="ondeMorar" value={formData.ondeMorar} onChange={handleChange} placeholder="Ex: Interior de SP" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo de Cohousing</label>
                        <select name="tipoCohousing" value={formData.tipoCohousing} onChange={handleChange} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Selecione...</option>
                            {TIPOS_COHOUSING.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipologia</label>
                        <select name="tipologia" value={formData.tipologia} onChange={handleChange} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Selecione...</option>
                            {TIPOLOGIAS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Área Residência</label>
                        <select name="areaResidencia" value={formData.areaResidencia} onChange={handleChange} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Selecione...</option>
                            {AREAS_RESIDENCIA.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Com quem irá morar?</label>
                        <select name="comQuem" value={formData.comQuem} onChange={handleChange} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Selecione...</option>
                            {COM_QUEM.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total de Pessoas</label>
                        <select name="totalPessoas" value={formData.totalPessoas} onChange={handleChange} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Selecione...</option>
                            {TOT_PESSOAS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dormitórios</label>
                        <select name="dormitorios" value={formData.dormitorios} onChange={handleChange} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Selecione...</option>
                            {QTD_DORMITORIOS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Suítes</label>
                        <select name="suites" value={formData.suites} onChange={handleChange} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Selecione...</option>
                            {QTD_SUITES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* 3. Afinidade */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-primary-900 mb-8 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm">3</span>
                    Afinidades e Valores
                </h3>
                
                <div className="space-y-8">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-4">Interesses Coletivos</label>
                        <div className="flex flex-wrap gap-2">
                            {INTERESSES.map(i => (
                                <button key={i} type="button" onClick={() => handleCheckboxChange('interesses', i)} className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${formData.interesses.includes(i) ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-primary-200'}`}>
                                    {i}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-4">Disponibilidade para Empreender</label>
                        <div className="flex flex-wrap gap-2">
                            {EMPREENDER.map(e => (
                                <button key={e} type="button" onClick={() => handleCheckboxChange('empreender', e)} className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${formData.empreender.includes(e) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-blue-200'}`}>
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-4">Valores Motivacionais</label>
                        <div className="flex flex-wrap gap-2">
                            {VALORES.map(v => (
                                <button key={v} type="button" onClick={() => handleCheckboxChange('valores', v)} className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${formData.valores.includes(v) ? 'bg-secondary-600 text-white border-secondary-600 shadow-md' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-secondary-200'}`}>
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-primary-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm">4</span>
                    Observações e Considerações
                </h3>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-3">Observações Adicionais</label>
                    <textarea 
                        name="observacoes"
                        value={formData.observacoes}
                        onChange={handleChange as any}
                        placeholder="Observações importantes sobre o lead..."
                        className="w-full h-32 bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 mt-1 outline-none focus:ring-2 focus:ring-primary-500 resize-none font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button type="submit" disabled={loading} className="flex-1 h-16 rounded-[1.5rem] text-lg font-bold shadow-lg shadow-primary-900/10 active:scale-[0.98]">
                    {loading ? 'Processando Cadastro...' : 'Salvar no CRM'}
                </Button>
                <button type="button" onClick={() => router.back()} className="px-10 h-16 rounded-[1.5rem] border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-colors">Cancelar</button>
            </div>
        </form>
    );
}

