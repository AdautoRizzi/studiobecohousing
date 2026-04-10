'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';

// Constantes e dados estruturais
const MODELOS_CONSTRUTIVOS = [
    { id: 'verde', nome: 'Construção Verde', multiplicador: 1.05 },
    { id: 'tijolo_ecologico', nome: 'Tijolo Ecológico ou Solo-Cimento', multiplicador: 0.95 },
    { id: 'wood_frame', nome: 'Wood Frame', multiplicador: 1.0 },
    { id: 'alvenaria_convencional', nome: 'Alvenaria Convencional', multiplicador: 1.0 },
    { id: 'alvenaria_estrutural', nome: 'Alvenaria Estrutural', multiplicador: 0.90 },
    { id: 'light_steel_frame', nome: 'Light Steel Frame', multiplicador: 1.10 },
    { id: 'modular', nome: 'Construção Modular (Off-site)', multiplicador: 0.85 },
];

const EXTRAS_INICIAIS = [
    { id: 'coworking', nome: 'Coworking / Escritório', custoEstimado: 80000, ativo: false },
    { id: 'cafe', nome: 'Café Coletivo', custoEstimado: 50000, ativo: false },
    { id: 'dark_kitchen', nome: 'Dark Kitchen (Cozinha Indústrial)', custoEstimado: 120000, ativo: false },
    { id: 'horta', nome: 'Horta e Jardim', custoEstimado: 25000, ativo: false },
    { id: 'eventos', nome: 'Espaço de Eventos', custoEstimado: 150000, ativo: false },
    { id: 'lavanderia', nome: 'Lavanderia Compartilhada', custoEstimado: 35000, ativo: false },
];

export default function SimuladorPage() {
    // Modo Corretor Oculto (protegido por senha)
    const [adminMode, setAdminMode] = useState(false);
    
    const handleSecretClick = () => {
        const senha = window.prompt("Código de acesso restrito:");
        if (senha === "studiobe") {
            setAdminMode(!adminMode); // Liga e desliga
        } else if (senha !== null) {
            alert("Senha incorreta.");
        }
    };

    // Parâmetros da Simulação (Visíveis)
    const [areaPrivativa, setAreaPrivativa] = useState(60);
    const [cubBase, setCubBase] = useState(3500);
    const [modeloId, setModeloId] = useState('alvenaria_convencional');
    const [membrosRateio, setMembrosRateio] = useState(10);
    const [extras, setExtras] = useState(EXTRAS_INICIAIS);

    // Parâmetros Administrativos "Ocultos"
    const [taxaCorretagem, setTaxaCorretagem] = useState(5); // em %
    const [bandaTolerancia, setBandaTolerancia] = useState(10); // em %

    // Atualiza um Extra específico (Ativar/Desativar ou Mudar Custo)
    const updateExtra = (id: string, field: 'ativo' | 'custoEstimado', value: any) => {
        setExtras(prev => prev.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
    };

    // --- CÁLCULOS ---
    const modeloAtual = MODELOS_CONSTRUTIVOS.find(m => m.id === modeloId) || MODELOS_CONSTRUTIVOS[0];
    
    // 1. Custo da Casa Isolado
    const custoCasaBase = (areaPrivativa * cubBase) * modeloAtual.multiplicador;

    // 2. Custo do Rateio (Apenas os extras que o cliente escolheu)
    const custoExtrasTotal = extras.filter(e => e.ativo).reduce((acc, curr) => acc + Number(curr.custoEstimado), 0);
    const custoExtrasPorMembro = membrosRateio > 0 ? (custoExtrasTotal / membrosRateio) : 0;

    // 3. Subtotal visível antes de taxas (Opcional, mas a lógica usa direto o total)
    const subtotal = custoCasaBase + custoExtrasPorMembro;

    // 4. Aplicação da Corretagem Oculta
    const corretagemMultiplier = 1 + (Number(taxaCorretagem) / 100);
    const custoTotalReal = subtotal * corretagemMultiplier;

    // 5. Banda de Tolerância Financeira (Mínimo e Máximo)
    const margemMultiplier = (Number(bandaTolerancia) / 100);
    const limiteMinimo = custoTotalReal * (1 - margemMultiplier);
    const limiteMaximo = custoTotalReal * (1 + margemMultiplier);

    // Helpers
    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
            <div className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-3 tracking-tight">
                    Simulador de Construção Inteligente
                </h1>
                <p className="text-gray-600 text-lg">
                    Crie e simule cenários construtivos do seu futuro cohousing adaptados à sua realidade.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                
                {/* COLUNA ESQUERDA: Configurações */}
                <div className="xl:col-span-2 space-y-8">
                    
                    {/* Seção 1: A Casa / Unidade Privativa */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-secondary-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4 flex items-center gap-3">
                            <span className="text-primary-500">1.</span> Unidade Privativa
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700">Área Construída Desejada (m²)</label>
                                <input 
                                    type="number" 
                                    value={areaPrivativa} 
                                    onChange={(e) => setAreaPrivativa(Number(e.target.value))}
                                    className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-primary-500 outline-none border border-gray-200 text-gray-900 text-lg font-medium"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700">Valor do CUB Estimado (R$)</label>
                                <input 
                                    type="number" 
                                    value={cubBase} 
                                    onChange={(e) => setCubBase(Number(e.target.value))}
                                    className="w-full h-14 bg-gray-50 rounded-xl px-4 focus:ring-2 focus:ring-primary-500 outline-none border border-gray-200 text-gray-900 text-lg font-medium"
                                />
                            </div>

                            <div className="space-y-3 md:col-span-2">
                                <label className="text-sm font-bold text-gray-700">Modelo Construtivo</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {MODELOS_CONSTRUTIVOS.map(modelo => (
                                        <div 
                                            key={modelo.id}
                                            onClick={() => setModeloId(modelo.id)}
                                            className={`cursor-pointer p-4 rounded-xl border text-center transition-all ${
                                                modeloId === modelo.id 
                                                ? 'bg-primary-50 border-primary-500 text-primary-900 shadow-sm' 
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300'
                                            }`}
                                        >
                                            <span className="font-semibold block">{modelo.nome}</span>
                                            {/* Subtexto escondido do multiplicador por simplicidade, ou pode ser exibido se quiser */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Seção 2: Áreas Compartilhadas */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-secondary-100">
                        <div className="flex justify-between items-end border-b pb-4 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <span className="text-primary-500">2.</span> Áreas Comuns e Rateio
                            </h2>
                            <div className="text-right">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Total de Membros no Grupo</label>
                                <input 
                                    type="number" 
                                    value={membrosRateio} 
                                    onChange={(e) => setMembrosRateio(Number(e.target.value))}
                                    className="w-24 h-10 bg-gray-50 rounded-lg px-3 text-center focus:ring-2 focus:ring-primary-500 outline-none border border-gray-200 text-gray-900 font-bold"
                                />
                            </div>
                        </div>

                        <p className="text-gray-600 mb-6 font-medium">Selecione quais instalações deseja adicionar ao escopo do cohousing. O valor será dividido entre todos os membros.</p>

                        <div className="space-y-4">
                            {extras.map(extra => (
                                <div key={extra.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200 gap-4">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        {/* Toggle Apple-like */}
                                        <button 
                                            onClick={() => updateExtra(extra.id, 'ativo', !extra.ativo)}
                                            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${extra.ativo ? 'bg-primary-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${extra.ativo ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                        <span className={`font-semibold ${extra.ativo ? 'text-primary-900' : 'text-gray-500'}`}>{extra.nome}</span>
                                    </div>
                                    
                                    {/* Input flexível do valor do cubo/custo extra */}
                                    <div className={`flex items-center gap-2 transition-opacity ${extra.ativo ? 'opacity-100' : 'opacity-40'}`}>
                                        <span className="text-sm font-medium text-gray-500">Custo Ref. (R$)</span>
                                        <input 
                                            type="number" 
                                            disabled={!extra.ativo}
                                            value={extra.custoEstimado} 
                                            onChange={(e) => updateExtra(extra.id, 'custoEstimado', Number(e.target.value))}
                                            className="w-32 h-10 bg-white rounded-lg px-3 text-right focus:ring-2 focus:ring-primary-500 outline-none border border-gray-300 text-gray-900 font-bold disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* MODAL ADMIN OCULTO */}
                    {adminMode && (
                        <section className="bg-primary-900 p-8 rounded-3xl shadow-xl border border-primary-700 text-white animate-in zoom-in-95 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                🔐 Modo Administrador (Parâmetros Ocultos)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-primary-200">Taxa de Corretagem/Gestão (%)</label>
                                    <input 
                                        type="number" 
                                        value={taxaCorretagem} 
                                        onChange={(e) => setTaxaCorretagem(Number(e.target.value))}
                                        className="w-full h-12 bg-primary-800 rounded-xl px-4 outline-none border border-primary-600 text-white font-medium"
                                    />
                                    <p className="text-xs text-primary-300">Essa taxa incide sobre o total invisivelmente nas bandas estimadas e totais.</p>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-primary-200">Banda de Tolerância Financeira (%)</label>
                                    <input 
                                        type="number" 
                                        value={bandaTolerancia} 
                                        onChange={(e) => setBandaTolerancia(Number(e.target.value))}
                                        className="w-full h-12 bg-primary-800 rounded-xl px-4 outline-none border border-primary-600 text-white font-medium"
                                    />
                                    <p className="text-xs text-primary-300">Margem percentual mostrada nos cenários Otimista e Pessimista.</p>
                                </div>
                            </div>
                        </section>
                    )}

                </div>

                {/* COLUNA DIREITA: Resultados */}
                <div className="xl:col-span-1">
                    <div className="sticky top-8 bg-primary-50 rounded-3xl p-8 border border-primary-200 shadow-xl">
                        <h3 className="text-xl font-bold text-primary-900 mb-6 pb-4 border-b border-primary-200">
                            Resumo do Investimento
                        </h3>

                        <div className="space-y-6 mb-8">
                            {/* Breakdown: Casa */}
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-primary-600 mb-1">Custo Estimado da Unidade</span>
                                <span className="text-2xl font-bold text-primary-900">{formatCurrency(custoCasaBase)}</span>
                            </div>

                            {/* Breakdown: Rateio */}
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-primary-600 mb-1">Sua Cota das Áreas Comuns</span>
                                <span className="text-2xl font-bold text-primary-900">{formatCurrency(custoExtrasPorMembro)}</span>
                                <span className="text-xs text-primary-500 mt-1 font-medium bg-primary-100 p-1.5 rounded-md inline-block max-w-fit">
                                    Em {membrosRateio} membros
                                </span>
                            </div>
                        </div>

                        {/* Banda de Tolerância / Resultado Final */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-2xl -mr-16 -mt-16"></div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-4 relative z-10">Banda de Investimento Esperada</span>
                            
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-gray-500 font-medium">Cenário Otimista</span>
                                    <span className="font-bold text-green-600 text-lg">{formatCurrency(limiteMinimo)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-gray-500 font-medium">Cenário Segurador</span>
                                    <span className="font-bold text-red-500 text-lg">{formatCurrency(limiteMaximo)}</span>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full h-14 text-lg rounded-full shadow-lg hover:scale-105 transition-transform" onClick={() => window.print()}>
                            Salvar Simulação
                        </Button>

                        <p className="text-center text-xs text-primary-400 mt-6 mt-4">
                            * Os valores acima são simulações aproximadas. Projetos oficiais podem ter variâncias devido a topografia, leis de zoneamento e licenças.
                        </p>
                        
                        {/* Hidden trigger for admin */}
                        <div className="h-6 w-full mt-4 cursor-default" onClick={handleSecretClick}></div>
                    </div>
                </div>

            </div>
        </div>
    );
}
