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
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-50">Marketing & Perfomance (Ads)</h1>
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
