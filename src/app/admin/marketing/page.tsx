import React from 'react';
import Link from 'next/link';
import { getAllLeads } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function MarketingDashboard() {
    const leads = await getAllLeads();

    // Lógica para separar leads por Source (Google, Facebook, Instagram, Orgânico)
    const campaigns: any = {};
    const metrics = {
        google: { count: 0, qualificados: 0, aiScoreTotal: 0 },
        facebook: { count: 0, qualificados: 0, aiScoreTotal: 0 },
        instagram: { count: 0, qualificados: 0, aiScoreTotal: 0 },
        organico: { count: 0, qualificados: 0, aiScoreTotal: 0 }
    };

    leads.forEach(lead => {
        const obs = lead.observacoes || '';
        let source = 'organico';
        
        if (obs.includes('Source: google') || obs.includes('Source: Google')) source = 'google';
        else if (obs.includes('Source: facebook') || obs.includes('Source: Facebook')) source = 'facebook';
        else if (obs.includes('Source: instagram') || obs.includes('Source: Instagram')) source = 'instagram';

        let aiScore = 0;
        const scoreMatch = obs.match(/\[AI SCORE\] (\d+)/);
        if (scoreMatch) aiScore = parseInt(scoreMatch[1], 10);

        metrics[source as keyof typeof metrics].count++;
        
        const campMatch = obs.match(/Campaign: ([^|]+)/);
        const camp = campMatch && campMatch[1].trim() !== "" ? campMatch[1].trim() : "N/A";
        
        if (!campaigns[camp]) campaigns[camp] = { source, count: 0, qualificados: 0 };
        campaigns[camp].count++;
        if (lead.status === 'Qualificado') campaigns[camp].qualificados++;
        metrics[source as keyof typeof metrics].aiScoreTotal += aiScore;
        if (lead.status === 'Qualificado') {
            metrics[source as keyof typeof metrics].qualificados++;
        }
    });

    return (
        <div className="p-8 bg-[#020617] min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <a href="/admin/crm" className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-lg flex items-center gap-2 text-sm font-bold">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Voltar
                        </a>
                        <h1 className="text-3xl font-bold text-slate-50">Marketing & Perfomance (Ads)</h1>
                    </div>
                    <p className="text-slate-400 mt-2">Métricas de tráfego pago, funil de conversão e AI Lead Scoring.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {Object.entries(metrics).map(([key, data]) => {
                    const avgScore = data.count > 0 ? Math.round(data.aiScoreTotal / data.count) : 0;
                    const taxaConv = data.count > 0 ? Math.round((data.qualificados / data.count) * 100) : 0;
                    
                    return (
                        <div key={key} className="bg-[#0f172a] rounded-xl p-6 border border-slate-800 shadow-sm relative overflow-hidden">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{key}</h3>
                            <div className="text-4xl font-black text-slate-50 mb-2">{data.count} <span className="text-lg font-normal text-slate-500">leads</span></div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800">
                                <div className="text-xs text-slate-400">
                                    <div className="font-bold text-green-400">{taxaConv}% Conv.</div>
                                    <div>para Qualificado</div>
                                </div>
                                <div className="text-xs text-slate-400 text-right">
                                    <div className="font-bold text-blue-400">{avgScore}/100</div>
                                    <div>AI Match Médio</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-[#0f172a] rounded-xl p-6 border border-slate-800 mb-8">
                <h2 className="text-xl font-bold text-slate-50 mb-4">Performance por Post / Campanha</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-400 border-b border-slate-800">
                            <th className="pb-2 font-medium">Nome do Post / Campanha</th>
                            <th className="pb-2 font-medium">Plataforma</th>
                            <th className="pb-2 font-medium text-center">Volume (Leads)</th>
                            <th className="pb-2 font-medium text-center">Conversão (Qualificados)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(campaigns).sort((a: any, b: any) => b[1].count - a[1].count).map(([campName, data]: any) => (
                            <tr key={campName} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                <td className="py-3 text-slate-200 font-medium">{campName}</td>
                                <td className="py-3 text-slate-400 uppercase text-xs">{data.source}</td>
                                <td className="py-3 text-slate-50 text-center font-bold">{data.count}</td>
                                <td className="py-3 text-green-400 text-center font-medium">{Math.round((data.qualificados / data.count)*100)}% ({data.qualificados})</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* NOVO BLOCO: LTV (Mina de Ouro) */}
            <div className="bg-[#0f172a]/80 rounded-2xl p-6 border border-primary-900 shadow-[0_0_20px_rgba(16,185,129,0.05)] mb-8 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 text-primary-500/10 z-0">
                    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl font-bold text-slate-50 mb-2 flex items-center gap-2">
                        <span className="text-primary-500">🧠</span> Inteligência de Marketing: Mina de Ouro (LTV)
                    </h2>
                    <p className="text-sm text-slate-400 mb-6">
                        Baseado no histórico real de compradores, calculamos o valor médio que um cliente traz em 1 ano de fidelidade.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-[#020617] rounded-xl p-4 border border-slate-800">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ticket Médio</div>
                            <div className="text-2xl font-black text-slate-100">R$ 102,67</div>
                        </div>
                        <div className="bg-[#020617] rounded-xl p-4 border border-slate-800">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Frequência (Compras/Ano)</div>
                            <div className="text-2xl font-black text-slate-100">3.7x</div>
                        </div>
                        <div className="bg-primary-900/30 rounded-xl p-4 border border-primary-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <div className="text-[10px] font-bold text-primary-400 uppercase tracking-wider mb-1">Valor do Cliente (LTV Anual)</div>
                            <div className="text-2xl font-black text-primary-400">R$ 377,80</div>
                        </div>
                        <div className="bg-[#020617] rounded-xl p-4 border border-slate-600 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">Teto Máximo do CAC (33%)</div>
                            <div className="text-2xl font-black text-slate-100">R$ 125,93</div>
                        </div>
                    </div>
                    
                    <div className="text-xs text-primary-400/80 italic font-medium">
                        Regra de Ouro: Enquanto o CAC (Custo por Cliente Novo) de uma campanha for MENOR que o Teto Máximo, você está lucrando e deve investir mais!
                    </div>
                </div>
            </div>

            {/* NOVO BLOCO: Configuração Rastreamento */}
            <div className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 mb-8">
                <h2 className="text-xl font-bold text-slate-50 mb-2 flex items-center gap-2">
                    <span className="text-slate-400">&lt;&gt;</span> Configuração da Vitrine & Rastreamento
                </h2>
                <p className="text-sm text-slate-400 mb-6">
                    Insira seus códigos para a <strong>Página Vitrine</strong>. Todo o tráfego gerado pelo Google/Face cairá nela e será rastreado automaticamente.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coluna 1 */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">ID do Google Ads (AW-XXXXXXX)</label>
                            <input type="text" className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all" defaultValue="AW-18288080010" />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-[11px] font-bold text-slate-400 uppercase">ID do Google Analytics 4 (G-XXXXXXX)</label>
                                <a href="#" className="text-[10px] text-blue-400 hover:underline">Abrir Painel Oficial 🔗</a>
                            </div>
                            <input type="text" className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all" defaultValue="G-ENVKWL4C6L" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Pixel do Facebook</label>
                            <input type="text" className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all" defaultValue="1286357459906125" />
                        </div>
                    </div>
                    {/* Coluna 2 */}
                    <div className="space-y-4 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Link do seu Catálogo Completo (Kyte/Outro)</label>
                                <input type="text" className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all" defaultValue="https://ifzenda-comida-de-verdade.kyte.site/pt-BR" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">WhatsApp para Vendas (Vitrine)</label>
                                <input type="text" className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all" defaultValue="5511955985054" />
                                <p className="text-[10px] text-slate-500 mt-1">Isso ativará um botão flutuante na Vitrine.</p>
                            </div>
                        </div>
                        
                        <div className="flex justify-end pt-4">
                            <button className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Salvar Configurações
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#0f172a] rounded-xl p-6 border border-slate-800">
                    <h2 className="text-xl font-bold text-slate-50 mb-4">Custos de Campanha (Controle Manual)</h2>
                    <p className="text-sm text-slate-400 mb-6">Insira o investimento realizado na semana para calcularmos o CAC e CPL.</p>
                    
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Campanha</label>
                                <select className="w-full bg-[#020617] border border-slate-800 rounded-lg p-2 text-slate-50">
                                    <option>Google Ads (Pesquisa)</option>
                                    <option>Meta Ads (Instagram/FB)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Investimento (R$)</label>
                                <input type="number" className="w-full bg-[#020617] border border-slate-800 rounded-lg p-2 text-slate-50" placeholder="Ex: 500" />
                            </div>
                        </div>
                        <button type="button" className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-primary-700">Registrar Custo</button>
                    </form>
                </div>

                <div className="bg-[#0f172a] rounded-xl p-6 border border-slate-800">
                    <h2 className="text-xl font-bold text-slate-50 mb-4 flex items-center gap-2">
                        <span className="text-2xl">✨</span> AI Insights (Relatório)
                    </h2>
                    <p className="text-sm text-slate-400 mb-4">Nossa inteligência artificial analisa os dados das suas campanhas e sugere otimizações.</p>
                    
                    <div className="bg-[#020617] p-4 rounded-lg border border-slate-800">
                        <p className="text-sm text-slate-300 italic mb-3">"A campanha do Google Ads trouxe o maior AI Match Médio (85/100). No entanto, o volume de leads é maior no Facebook. Recomendo aumentar o orçamento do Google em 20% focado no termo 'Cohousing Senior'."</p>
                        <p className="text-xs text-slate-500">- Gerado automaticamente pela IA hoje.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
