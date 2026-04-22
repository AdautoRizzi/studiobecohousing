'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

// Opções das 15 questões estruturadas
const FAIXAS_ETARIAS = ['menos de 40 anos', '40 a 45 anos', '46 a 50 anos', '51 a 55 anos', '56 a 60 anos', '61 a 65 anos', '66 a 70 anos', '70 a 80 anos', 'mais de 80 anos'];
const GENEROS = ['feminino', 'masculino', 'prefiro não informar'];
const TIPOS_COHOUSING = ['Urbano em grandes metrópoles', 'Urbano em cidades do interior', 'Rural - próximo ao centro da cidade', 'Urbano no litoral', 'Indiferente'];
const TIPOLOGIAS = ['Casas térreas', 'Apartamentos', 'Loft', 'Indiferente'];
const COM_QUEM = ['sozinha/o', 'com cônjuge ou companheira/o', 'com amigos e/ou familiares'];
const TOT_PESSOAS = ['1 pessoa', '2 pessoas', '3 pessoas', '4 pessoas'];
const INTERESSES = ['Atividades culturais e artísticas', 'Alimentação compartilhada e gastronomia', 'Horta e jardinagem', 'Atividades físicas, esporte e lazer', 'Atividades de meditação ou contemplativas', 'Wellness (saúde e bem-estar)'];
const EMPREENDER = ['Não tenho interesse', 'Coworking', 'Dark kitchen (cozinha compartilhada)', 'Serviços na área de terapias, saúde e bem-estar', 'Cafeteria / restaurante', 'Prestação de serviços diversos', 'Conveniência / drogaria', 'Lavanderia auto-serviço', 'Espaço de eventos (artístico e cultural)'];
const VALORES = ['Rede de apoio para combater a solidão', 'Segurança e suporte integrados', 'Manutenção da autonomia e independência', 'Redução de custos de manutenção', 'Sustentabilidade', 'Contato com a natureza', 'Proximidade a serviços e comércio', 'Rede de serviços de manutenção das unidades'];

export default function CohousingForm() {
    const [step, setStep] = useState(1);

    // Estado do Mega Formulário
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        moradiaAtual: '',
        idade: '',
        profissao: '',
        genero: '',
        ondeMorar: '',
        tipoCohousing: '',
        tipologia: '',
        comQuem: '',
        totalPessoas: '',
        dormitorios: '1',
        suites: '1',
        interesses: [] as string[],
        empreender: [] as string[],
        valores: [] as string[]
    });

    // Controla mudanças nos inputs comuns
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Controla limite de 4 seleções nos Arrays (Checkbox)
    const handleCheckboxArray = (field: 'interesses' | 'valores' | 'empreender', value: string, max: number = 99) => {
        setFormData(prev => {
            const currentArray = prev[field];

            // Especial: Se marcar "não tenho interesse", limpa os outros (só para empreender)
            if (field === 'empreender' && value === 'Não tenho interesse') {
                return { ...prev, [field]: currentArray.includes(value) ? [] : [value] };
            }

            if (currentArray.includes(value)) {
                // Remove
                return { ...prev, [field]: currentArray.filter(i => i !== value) };
            } else {
                // Adiciona verificando max
                // Limpa o "não tenho interesse" se selecionar outro
                let newArray = field === 'empreender' ? currentArray.filter(i => i !== 'Não tenho interesse') : [...currentArray];

                if (newArray.length < max) {
                    newArray.push(value);
                }
                return { ...prev, [field]: newArray };
            }
        });
    };

    const isStep1Valid = formData.nome.length > 2 && formData.email.includes('@') && formData.moradiaAtual && formData.idade && formData.profissao && formData.genero;
    const isStep2Valid = formData.ondeMorar && formData.tipoCohousing && formData.tipologia && formData.comQuem && formData.totalPessoas;
    const isStep3Valid = formData.interesses.length > 0 && formData.empreender.length > 0 && formData.valores.length > 0;

    const nextStep = () => { window.scrollTo({ top: document.getElementById('cadastro')?.offsetTop! - 100, behavior: 'smooth' }); setStep(s => s + 1); };
    const prevStep = () => { window.scrollTo({ top: document.getElementById('cadastro')?.offsetTop! - 100, behavior: 'smooth' }); setStep(s => s - 1); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Enviar para a Planilha do Google
        const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbyTq7VCLn1GZG2mMB9rGZBYFtedDezWmgEtq2hkMNx9aUKbuZjboz_oyjnMuigyYs8R/exec';
        
        const payload = {
            nome: formData.nome,
            email: formData.email,
            moradiaAtual: formData.moradiaAtual,
            idade: formData.idade,
            profissao: formData.profissao,
            genero: formData.genero,
            ondeMorar: formData.ondeMorar,
            tipologia: formData.tipologia,
            comQuem: `${formData.comQuem} (${formData.totalPessoas} pessoas - ${formData.dormitorios} quartos, ${formData.suites} suítes)`,
            resumoAfinidade: `Valores: ${formData.valores.join(', ')} | Interesses: ${formData.interesses.join(', ')} | Empreender: ${formData.empreender.join(', ')}`
        };

        try {
            await fetch(googleScriptUrl, {
                method: 'POST',
                mode: 'no-cors', // Evita erro de CORS no navegador
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error("Erro ao salvar na planilha", error);
        }

        // 2. Constrói a mensagem inteira para WhatsApp
        const text = `*NOVA APLICAÇÃO DE INTERESSE - STUDIO BE*
        
*👤 1. QUEM SOU EU*
*Nome:* ${formData.nome}
*E-mail:* ${formData.email}
*Moradia Atual:* ${formData.moradiaAtual}
*Faixa Etária:* ${formData.idade}
*Profissão:* ${formData.profissao}
*Gênero:* ${formData.genero}

*🏡 2. A CASA IDEAL*
*Onde quer morar:* ${formData.ondeMorar}
*Tipo de Cohousing:* ${formData.tipoCohousing}
*Tipologia:* ${formData.tipologia}
*Com quem vai morar:* ${formData.comQuem} (${formData.totalPessoas} - ${formData.dormitorios} quartos, ${formData.suites} suítes)

*❤️ 3. PROPÓSITO E VALORES*
*Motivações Principais:*
${formData.valores.map(v => `- ${v}`).join('\n')}

*Principais Interesses:*
${formData.interesses.map(v => `- ${v}`).join('\n')}

*Interesse em Empreender no Cohousing:*
${formData.empreender.map(v => `- ${v}`).join('\n')}`;

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/5511934898990?text=${encodedText}`;
        window.location.href = whatsappUrl;
    };

    return (
        <section id="cadastro" className="py-24 bg-white relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent"></div>

            <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
                <div className="text-center mb-12">
                    <span className="text-secondary-600 font-bold uppercase tracking-wider text-sm mb-2 block">Seu Futuro Começa Aqui</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4 tracking-tight">Questionário de Afinidade</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-6">
                        Ajudamos a conectar o seu projeto de vida à comunidade ideal. Esse cadastro rápido permite entender seu momento.
                    </p>
                    <div className="inline-flex flex-col sm:flex-row items-center text-left sm:text-center gap-3 px-6 py-3 rounded-2xl bg-primary-50 border border-primary-200 text-primary-900 mx-auto font-medium shadow-sm max-w-2xl">
                        <span className="text-2xl">✨</span>
                        Nosso sistema de curadoria atua para encontrar o &quot;MATCH&quot; perfeito de afinidades, interesses e propósitos entre os futuros membros.
                    </div>
                </div>

                {/* Stepper Visual */}
                <div className="flex items-center justify-between mb-12 relative max-w-xl mx-auto px-4 before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:h-1 before:bg-gray-100 before:w-full before:-z-10">
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-secondary-500 transition-all duration-500 -z-10" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
                    {[1, 2, 3].map(num => (
                        <div key={num} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-colors duration-300 bg-white ${step >= num ? 'border-secondary-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] text-secondary-600' : 'border-gray-200 text-gray-400'}`}>
                            {num}
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-2xl border border-secondary-100">
                    <form onSubmit={handleSubmit} className="space-y-10">

                        {/* ----------------- STEP 1 ----------------- */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-2xl font-bold text-primary-900 mb-8 border-b border-gray-100 pb-4">Etapa 1: Quem é você?</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2 col-span-1 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-700">Nome Completo *</label>
                                        <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none border border-gray-200 text-gray-900 font-medium" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">E-mail *</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none border border-gray-200 text-gray-900 font-medium" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Moradia Atual (Cidade/UF) *</label>
                                        <input type="text" name="moradiaAtual" value={formData.moradiaAtual} onChange={handleChange} placeholder="Ex: São Paulo, SP" className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none border border-gray-200 text-gray-900 font-medium" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Qual a sua faixa etária? *</label>
                                        <select name="idade" value={formData.idade} onChange={handleChange} className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none border border-gray-200 text-gray-900 font-medium" required>
                                            <option value="">Selecione...</option>
                                            {FAIXAS_ETARIAS.map(f => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Qual o seu gênero? *</label>
                                        <select name="genero" value={formData.genero} onChange={handleChange} className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none border border-gray-200 text-gray-900 font-medium" required>
                                            <option value="">Selecione...</option>
                                            {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2 col-span-1 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-700">Qual sua principal atividade profissional? *</label>
                                        <input type="text" name="profissao" value={formData.profissao} onChange={handleChange} className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none border border-gray-200 text-gray-900 font-medium" required />
                                    </div>
                                </div>
                                <div className="mt-12 flex justify-end">
                                    <Button type="button" onClick={nextStep} disabled={!isStep1Valid} className="h-14 px-10 text-lg rounded-full bg-primary-900 hover:bg-primary-800">Próxima Etapa ➔</Button>
                                </div>
                            </div>
                        )}

                        {/* ----------------- STEP 2 ----------------- */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                                <h3 className="text-2xl font-bold text-primary-900 mb-8 border-b border-gray-100 pb-4">Etapa 2: A Casa Ideal</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2 col-span-1 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-700">Onde gostaria de morar? *</label>
                                        <input type="text" name="ondeMorar" value={formData.ondeMorar} onChange={handleChange} placeholder="Ex: Interior de SP, Praia, etc" className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none border border-gray-200 text-gray-900 font-medium" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Tipo de Cohousing *</label>
                                        <select name="tipoCohousing" value={formData.tipoCohousing} onChange={handleChange} className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none border border-gray-200 text-gray-900 font-medium" required>
                                            <option value="">Selecione...</option>
                                            {TIPOS_COHOUSING.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Tipologia Preferencial *</label>
                                        <select name="tipologia" value={formData.tipologia} onChange={handleChange} className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none border border-gray-200 text-gray-900 font-medium" required>
                                            <option value="">Selecione...</option>
                                            {TIPOLOGIAS.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Com quem você pretende morar? *</label>
                                        <select name="comQuem" value={formData.comQuem} onChange={handleChange} className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none border border-gray-200 text-gray-900 font-medium" required>
                                            <option value="">Selecione...</option>
                                            {COM_QUEM.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Total de pessoas na casa? *</label>
                                        <select name="totalPessoas" value={formData.totalPessoas} onChange={handleChange} className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none border border-gray-200 text-gray-900 font-medium" required>
                                            <option value="">Selecione...</option>
                                            {TOT_PESSOAS.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Dormitórios *</label>
                                        <input type="number" min="0" max="6" name="dormitorios" value={formData.dormitorios} onChange={handleChange} className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none border border-gray-200 text-gray-900 font-medium" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Suítes (dentro dos dormitórios) *</label>
                                        <input type="number" min="0" max="6" name="suites" value={formData.suites} onChange={handleChange} className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-secondary-500 outline-none border border-gray-200 text-gray-900 font-medium" required />
                                    </div>
                                </div>
                                <div className="mt-12 flex justify-between">
                                    <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 text-gray-600 rounded-full border-gray-300">Voltar</Button>
                                    <Button type="button" onClick={nextStep} disabled={!isStep2Valid} className="h-14 px-10 text-lg rounded-full bg-primary-900 hover:bg-primary-800">Próxima Etapa ➔</Button>
                                </div>
                            </div>
                        )}

                        {/* ----------------- STEP 3 ----------------- */}
                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                                <h3 className="text-2xl font-bold text-primary-900 mb-8 border-b border-gray-100 pb-4">Etapa 3: Valores e Interesses</h3>

                                <div className="space-y-12">
                                    {/* Interesses */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <label className="text-base font-bold text-gray-800">Seus principais interesses</label>
                                            <span className="text-xs font-bold text-secondary-600 bg-secondary-50 px-2 py-1 rounded">MÁXIMO 4</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {INTERESSES.map(int => (
                                                <div
                                                    key={int}
                                                    onClick={() => handleCheckboxArray('interesses', int, 4)}
                                                    className={`cursor-pointer border p-4 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${formData.interesses.includes(int) ? 'border-secondary-500 bg-secondary-50 shadow-inner' : 'border-gray-200 bg-white hover:border-secondary-300 hover:bg-gray-50'}`}
                                                >
                                                    <div className={`w-5 h-5 rounded overflow-hidden flex items-center justify-center border-2 ${formData.interesses.includes(int) ? 'bg-secondary-500 border-secondary-500' : 'bg-white border-gray-300'}`}>
                                                        {formData.interesses.includes(int) && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                    <span className={formData.interesses.includes(int) ? 'text-secondary-900 font-bold' : 'text-gray-600'}>{int}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Emprender */}
                                    <div className="space-y-4">
                                        <label className="text-base font-bold text-gray-800 block mb-2">Interesse em Empreender no Cohousing?</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {EMPREENDER.map(emp => (
                                                <div
                                                    key={emp}
                                                    onClick={() => handleCheckboxArray('empreender', emp)}
                                                    className={`cursor-pointer border p-4 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${formData.empreender.includes(emp) ? 'border-primary-500 bg-primary-50 shadow-inner' : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50'}`}
                                                >
                                                    <div className={`w-5 h-5 rounded overflow-hidden flex items-center justify-center border-2 ${formData.empreender.includes(emp) ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-300'}`}>
                                                        {formData.empreender.includes(emp) && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                    <span className={formData.empreender.includes(emp) ? 'text-primary-900 font-bold' : 'text-gray-600'}>{emp}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Valores Motivacionais */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <label className="text-base font-bold text-gray-800">Quais valores motivam sua mudança?</label>
                                            <span className="text-xs font-bold text-secondary-600 bg-secondary-50 px-2 py-1 rounded">MÁXIMO 4</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {VALORES.map(val => (
                                                <div
                                                    key={val}
                                                    onClick={() => handleCheckboxArray('valores', val, 4)}
                                                    className={`cursor-pointer border p-4 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${formData.valores.includes(val) ? 'border-secondary-500 bg-secondary-50 shadow-inner' : 'border-gray-200 bg-white hover:border-secondary-300 hover:bg-gray-50'}`}
                                                >
                                                    <div className={`w-5 h-5 rounded overflow-hidden flex items-center justify-center border-2 ${formData.valores.includes(val) ? 'bg-secondary-500 border-secondary-500' : 'bg-white border-gray-300'}`}>
                                                        {formData.valores.includes(val) && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                    <span className={formData.valores.includes(val) ? 'text-secondary-900 font-bold' : 'text-gray-600'}>{val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 text-gray-600 rounded-full border-gray-300 w-full md:w-auto">Revisar Etapas</Button>

                                    <Button
                                        type="submit"
                                        disabled={!isStep3Valid}
                                        variant="secondary"
                                        className="h-16 px-10 text-lg shadow-xl shadow-secondary-600/30 transition-transform hover:scale-105 rounded-full w-full md:w-auto flex items-center gap-3 justify-center"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.927 3.151.927 3.181 0 5.767-2.586 5.767-5.766 0-3.18-2.586-5.769-5.769-5.769zM12.031 15.939c-1.127 0-1.924-.343-2.613-.75l-.187-.111-1.29.339.345-1.259-.122-.194c-.45-.718-.737-1.503-.736-2.432 0-2.316 1.885-4.201 4.203-4.201 2.316 0 4.201 1.885 4.201 4.201 0 2.315-1.885 4.207-4.201 4.207z" />
                                            <path d="M14.498 12.871c-.135-.068-.801-.395-.925-.44-.124-.045-.214-.068-.305.068-.09.135-.35.44-.429.53-.079.09-.158.101-.293.033-.135-.068-.571-.21-1.087-.671-.401-.358-.673-.801-.752-.936-.079-.135-.008-.209.059-.276.063-.063.135-.158.203-.236.068-.079.09-.135.135-.225.045-.09.023-.169-.011-.236-.034-.068-.304-.734-.416-1.006-.11-.264-.221-.228-.305-.232-.079-.004-.169-.004-.26-.004s-.236.034-.36.169c-.124.135-.473.462-.473 1.127 0 .664.484 1.307.552 1.398.068.09 1.137 1.8 2.75 2.454.673.272 1.198.435 1.609.557.676.2 1.291.171 1.777.104.542-.075 1.666-.681 1.897-1.338.231-.658.231-1.222.163-1.338-.068-.117-.248-.184-.383-.252z" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.745.448 3.385 1.228 4.821L2 22l5.356-1.168A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.423c-1.488 0-2.894-.383-4.129-1.045l-.296-.159-3.078.672.684-2.951-.174-.301A8.428 8.428 0 013.577 12c0-4.646 3.777-8.423 8.423-8.423 4.646 0 8.423 3.777 8.423 8.423 0 4.646-3.777 8.423-8.423 8.423z" />
                                        </svg>
                                        Finalizar e Enviar Interesse
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}
