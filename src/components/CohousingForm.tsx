'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { submitCohousingFormAction } from '@/app/actions';

// Opções das 15 questões estruturadas
const FAIXAS_ETARIAS = ['menos de 40 anos', '40 a 45 anos', '46 a 50 anos', '51 a 55 anos', '56 a 60 anos', '61 a 65 anos', '66 a 70 anos', '70 a 80 anos', 'mais de 80 anos'];
const GENEROS = ['feminino', 'masculino', 'não binário', 'outro', 'prefiro não informar'];
const TIPOS_COHOUSING = ['Urbano em grandes metrópoles', 'Urbano em cidades do interior', 'Rural - próximo ao centro da cidade', 'Litoral', 'Indiferente'];
const TIPOLOGIAS = ['Casas', 'Apartamentos', 'Loft', 'Indiferente'];
const AREAS_RESIDENCIA = ['Até 50 m2', 'de 50 m2 a 80 m2', 'de 80 m2 a 120 m2', 'acima de 120 m2'];
const COM_QUEM = ['sozinha/o', 'com cônjuge ou companheira/o', 'com amigos e/ou familiares'];
const TOT_PESSOAS = ['1 pessoa', '2 pessoas', '3 pessoas', '4 pessoas', 'mais de 4 pessoas'];
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

interface Props {
    isModal?: boolean;
    onClose?: () => void;
}

export default function CohousingForm({ isModal, onClose }: Props) {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [utms, setUtms] = useState({ source: '', medium: '', campaign: '', term: '' });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setUtms({
            source: params.get('utm_source') || '',
            medium: params.get('utm_medium') || '',
            campaign: params.get('utm_campaign') || '',
            term: params.get('utm_term') || ''
        });
    }, []);
    const formRef = useRef<HTMLDivElement>(null);

    // Estado do Mega Formulário
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
        participouApresentacao: '',
        observacoes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxArray = (field: 'interesses' | 'valores' | 'empreender', value: string, max: number = 99) => {
        setFormData(prev => {
            const currentArray = prev[field];
            if (field === 'empreender' && value === 'Não tenho interesse') {
                return { ...prev, [field]: currentArray.includes(value) ? [] : [value] };
            }
            if (currentArray.includes(value)) {
                return { ...prev, [field]: currentArray.filter(i => i !== value) };
            } else {
                let newArray = field === 'empreender' ? currentArray.filter(i => i !== 'Não tenho interesse') : [...currentArray];
                if (newArray.length < max) {
                    newArray.push(value);
                }
                return { ...prev, [field]: newArray };
            }
        });
    };

    const isStep1Valid = formData.nome.length > 2 && formData.email.includes('@') && formData.telefone.length > 8 && formData.moradiaAtual && formData.idade && formData.profissao && formData.genero;
    const isStep2Valid = formData.ondeMorar && formData.tipoCohousing && formData.tipologia && formData.areaResidencia && formData.comQuem && formData.totalPessoas;
    const isStep3Valid = formData.interesses.length > 0 && formData.empreender.length > 0 && formData.valores.length > 0 && formData.participouApresentacao !== '';

    const scrollToForm = () => {
        if (isModal) return;
        if (formRef.current) {
            const yOffset = -120;
            const element = formRef.current;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const nextStep = () => { scrollToForm(); setStep(s => s + 1); };
    const prevStep = () => { scrollToForm(); setStep(s => s - 1); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        // MÓDULO DE MARKETING: Anexando UTMs nas observações
        const utmString = `[UTM] Source: ${utms.source || 'Orgânico'} | Medium: ${utms.medium} | Campaign: ${utms.campaign} | Term: ${utms.term}`;
        formData.observacoes = formData.observacoes ? `${utmString}\n\n${formData.observacoes}` : utmString;
        
        // AI LEAD SCORING: Nota aleatória simulada para o MVP baseado na profissão e idade
        let aiScore = 50;
        if (formData.idade.includes('60') || formData.idade.includes('50')) aiScore += 20;
        if (formData.profissao.toLowerCase().includes('eng') || formData.profissao.toLowerCase().includes('med')) aiScore += 15;
        formData.observacoes = `[AI SCORE] ${aiScore}/100\n${formData.observacoes}`;

        const res = await submitCohousingFormAction(formData);
            if (res.success) {
                setIsSubmitted(true);
                scrollToForm();

                // Redirecionamento automático para o WhatsApp do Studio Be
                const msg = `Olá! Acabei de preencher o questionário de afinidade do Studio Be.\n\n*Nome:* ${formData.nome}\n*Celular:* ${formData.telefone}\n*Perfil:* ${formData.idade}\n*Local de Interesse:* ${formData.ondeMorar} (${formData.tipoCohousing})\n*Cadastro Completo:* Sim (100%)`;
                const whatsappUrl = `https://wa.me/5511934898990?text=${encodeURIComponent(msg)}`;
                window.open(whatsappUrl, '_blank');
            } else {
                alert(`Erro ao salvar interesse: ${res.error}\n\nDetalhes: ${res.details || 'Sem detalhes adicionais'}`);
            }
        } catch (error) {
            console.error("Erro ao salvar no CRM", error);
            alert('Erro de conexão. Verifique sua internet.');
        }
    };

    const formContent = (
        <div className={isModal ? 'bg-white rounded-3xl p-6 md:p-10 shadow-2xl' : 'container mx-auto px-6 lg:px-12 max-w-4xl'}>
            {!isModal && (
                <div className="text-center mb-12">
                    <span className="text-secondary-600 font-bold uppercase tracking-wider text-sm mb-2 block">Seu Futuro Começa Aqui</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4 tracking-tight">Questionário de Afinidade</h2>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-6">
                        Este é o primeiro passo para entendermos seu momento de vida, interesses e expectativas.<br />
                        Nosso objetivo aqui é apenas identificar conexões possíveis.
                    </p>
                    <div className="flex flex-col items-center text-center gap-4 px-6 py-6 rounded-2xl bg-primary-50 border border-primary-200 text-primary-900 mx-auto font-medium shadow-sm max-w-3xl">
                        <img src="/MATCH - icone.png" alt="Match" className="w-12 h-12 object-contain" />
                        <p className="text-sm md:text-base leading-relaxed">
                            Nosso sistema de curadoria atua para encontrar o "MATCH" perfeito de afinidades, interesses e propósitos entre os futuros membros.
                        </p>
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-400 mt-6 font-medium flex items-center justify-center gap-2 uppercase tracking-widest">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        Seus dados são tratados conforme a <a href="https://www.gov.br/esporte/pt-br/acesso-a-informacao/lgpd" target="_blank" rel="noopener noreferrer" className="underline hover:text-secondary-600 transition-colors">LGPD</a>.
                    </p>
                </div>
            )}

            {isModal && (
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-primary-900">Questionário de Afinidade</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mt-1">Passo {step} de 3</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-primary-900">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}

            {!isSubmitted ? (
                <div className={!isModal ? 'bg-white rounded-[2.5rem] p-8 md:p-14 shadow-2xl border border-secondary-100' : ''}>
                    {/* Stepper */}
                    <div className="flex items-center justify-between mb-12 relative max-w-xl mx-auto px-4 before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:h-1 before:bg-gray-100 before:w-full before:-z-10">
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-secondary-500 transition-all duration-500 -z-10" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
                        {[1, 2, 3].map(num => (
                            <div key={num} className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold border-4 transition-colors duration-300 bg-white ${step >= num ? 'border-secondary-500 text-secondary-600' : 'border-gray-200 text-gray-400'}`}>
                                {num}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <h3 className="text-xl font-bold text-primary-900 col-span-full border-b border-gray-50 pb-2">Identificação</h3>
                                <div className="space-y-1 col-span-full">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo *</label>
                                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">E-mail *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp *</label>
                                    <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Faixa Etária *</label>
                                    <select name="idade" value={formData.idade} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required>
                                        <option value="">Selecione...</option>
                                        {FAIXAS_ETARIAS.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Moradia Atual (Cidade/UF) *</label>
                                    <input type="text" name="moradiaAtual" value={formData.moradiaAtual} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Gênero *</label>
                                    <select name="genero" value={formData.genero} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required>
                                        <option value="">Selecione...</option>
                                        {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Profissão *</label>
                                    <input type="text" name="profissao" value={formData.profissao} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required />
                                </div>
                                <div className="col-span-full pt-6 flex justify-end">
                                    <Button type="button" onClick={nextStep} disabled={!isStep1Valid} className="h-14 px-10 rounded-full bg-primary-900">Próxima Etapa ➔</Button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <h3 className="text-xl font-bold text-primary-900 col-span-full border-b border-gray-50 pb-2">Preferências de Moradia</h3>
                                <div className="space-y-1 col-span-full">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Onde gostaria de morar? *</label>
                                    <input type="text" name="ondeMorar" value={formData.ondeMorar} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Tipo de Cohousing *</label>
                                    <select name="tipoCohousing" value={formData.tipoCohousing} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required>
                                        <option value="">Selecione...</option>
                                        {TIPOS_COHOUSING.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Tipologia *</label>
                                    <select name="tipologia" value={formData.tipologia} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required>
                                        <option value="">Selecione...</option>
                                        {TIPOLOGIAS.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Área *</label>
                                    <select name="areaResidencia" value={formData.areaResidencia} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required>
                                        <option value="">Selecione...</option>
                                        {AREAS_RESIDENCIA.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Com quem? *</label>
                                    <select name="comQuem" value={formData.comQuem} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required>
                                        <option value="">Selecione...</option>
                                        {COM_QUEM.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Pessoas *</label>
                                    <select name="totalPessoas" value={formData.totalPessoas} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required>
                                        <option value="">Selecione...</option>
                                        {TOT_PESSOAS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Dormitórios *</label>
                                    <select name="dormitorios" value={formData.dormitorios} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required>
                                        <option value="">Selecione...</option>
                                        {QTD_DORMITORIOS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Suítes *</label>
                                    <select name="suites" value={formData.suites} onChange={handleChange} className="w-full h-12 bg-gray-50 rounded-xl px-4 border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none" required>
                                        <option value="">Selecione...</option>
                                        {QTD_SUITES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-full pt-6 flex justify-between">
                                    <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 rounded-full">Voltar</Button>
                                    <Button type="button" onClick={nextStep} disabled={!isStep2Valid} className="h-14 px-10 rounded-full bg-primary-900">Próxima Etapa ➔</Button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                                <h3 className="text-xl font-bold text-primary-900 border-b border-gray-50 pb-2">Afinidades e Propósitos</h3>
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-700">Interesses (Máx 4)</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {INTERESSES.map(i => (
                                            <div key={i} onClick={() => handleCheckboxArray('interesses', i, 4)} className={`p-3 rounded-xl border cursor-pointer transition-all text-sm ${formData.interesses.includes(i) ? 'bg-secondary-50 border-secondary-500 text-secondary-900 font-bold' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'}`}>
                                                {i}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-700">Valores (Máx 4)</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {VALORES.map(v => (
                                            <div key={v} onClick={() => handleCheckboxArray('valores', v, 4)} className={`p-3 rounded-xl border cursor-pointer transition-all text-sm ${formData.valores.includes(v) ? 'bg-secondary-50 border-secondary-500 text-secondary-900 font-bold' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'}`}>
                                                {v}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-700">Empreender?</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {EMPREENDER.map(e => (
                                            <div key={e} onClick={() => handleCheckboxArray('empreender', e)} className={`p-3 rounded-xl border cursor-pointer transition-all text-sm ${formData.empreender.includes(e) ? 'bg-primary-50 border-primary-500 text-primary-900 font-bold' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'}`}>
                                                {e}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-700">Você já participou de alguma apresentação presencial ou on-line do Studio Be? *</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button type="button" onClick={() => setFormData({ ...formData, participouApresentacao: 'Sim' })} className={`p-4 rounded-xl border text-center font-bold transition-all ${formData.participouApresentacao === 'Sim' ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary-300'}`}>
                                            Sim
                                        </button>
                                        <button type="button" onClick={() => setFormData({ ...formData, participouApresentacao: 'Não' })} className={`p-4 rounded-xl border text-center font-bold transition-all ${formData.participouApresentacao === 'Não' ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary-300'}`}>
                                            Não
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-700">Observações ou Mensagem (Opcional)</label>
                                    <textarea name="observacoes" value={formData.observacoes} onChange={(e: any) => handleChange(e)} rows={3} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary-500 outline-none resize-none" placeholder="Conte-nos algo mais que devemos saber..."></textarea>
                                </div>
                                <div className="pt-6 flex justify-between items-center border-t border-gray-100">
                                    <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 rounded-full">Voltar</Button>
                                    <Button type="submit" disabled={!isStep3Valid} variant="secondary" className="h-16 px-12 rounded-full shadow-lg font-bold">Enviar Interesse</Button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            ) : (
                <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-3xl font-bold text-primary-900 mb-4">Recebido com Sucesso!</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">Sua jornada rumo a uma vida com mais propósito começou. Entraremos em contato em breve.</p>
                    {isModal && <Button onClick={onClose} variant="outline" className="rounded-full">Fechar Janela</Button>}
                </div>
            )}
        </div>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-primary-950/80 backdrop-blur-sm" onClick={onClose}></div>
                <div className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                    {formContent}
                </div>
            </div>
        );
    }

    return (
        <section id="cadastro" className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent"></div>
            {formContent}
        </section>
    );
}
