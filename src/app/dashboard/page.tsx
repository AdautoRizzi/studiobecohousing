'use client';
import React from 'react';
import Link from 'next/link';
import { useClientTier, Tiers } from './ClientTierContext';

export default function DashboardHomePage() {
    const { tier, setTier } = useClientTier();
    const currentTierInfo = Tiers[tier];

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            <div>
                <h1 className="text-3xl font-serif font-bold tracking-tight text-primary-900">Sua Jornada Studio Be</h1>
                <p className="text-gray-600 mt-2">Acompanhe seu progresso e descubra os próximos passos para viver em comunidade.</p>
            </div>

            {/* Visual Tracker */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-secondary-100 shadow-sm overflow-x-auto">
                <div className="flex items-center justify-between min-w-[900px] relative">
                    {/* Linha de fundo da trilha */}
                    <div className="absolute left-6 right-6 top-5 h-1 bg-gray-100 -z-10 rounded-full"></div>
                    
                    {Tiers.map((t, index) => {
                        const isPast = tier > t.level;
                        const isCurrent = tier === t.level;
                        
                        return (
                            <div key={t.level} className="flex flex-col items-center relative z-10 w-24">
                                {isPast && index !== Tiers.length - 1 && (
                                    <div className="absolute left-1/2 top-5 w-full h-1 bg-primary-500 -z-10"></div>
                                )}
                                
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500
                                    ${isPast ? 'bg-primary-500 border-primary-500 text-white shadow-md scale-100' : 
                                      isCurrent ? 'bg-white border-primary-600 text-primary-600 shadow-[0_0_15px_rgba(var(--color-primary-500),0.3)] scale-110' : 
                                      'bg-gray-50 border-gray-200 text-gray-400 scale-90'}`}>
                                    {isPast ? '✓' : t.level}
                                </div>
                                <span className={`mt-3 text-xs font-semibold text-center transition-colors duration-300
                                    ${isCurrent ? 'text-primary-800' : isPast ? 'text-gray-700' : 'text-gray-400'}`}>
                                    {t.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Offer Card & Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-primary-900 to-secondary-900 text-white p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-center">
                    <div className="relative z-10">
                        <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full mb-6">
                            Próxima Evolução
                        </span>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 tracking-tight">{currentTierInfo.offerTitle}</h2>
                        <p className="text-primary-100 mb-10 max-w-lg text-lg leading-relaxed font-light">
                            {currentTierInfo.offerDesc}
                        </p>
                        
                        {currentTierInfo.cta && (
                            <button 
                                onClick={() => { if (tier < 8) setTier(tier + 1); }}
                                className="group bg-white text-primary-900 hover:bg-gray-50 font-bold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-xl flex items-center gap-3 w-fit"
                            >
                                {currentTierInfo.cta}
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        )}
                        {!currentTierInfo.cta && (
                            <div className="py-3 px-6 bg-white/10 rounded-lg inline-block text-sm font-medium">
                                Você alcançou o nível mais alto da jornada!
                            </div>
                        )}
                    </div>
                    <div className="absolute -right-24 -bottom-24 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute right-10 top-10 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl pointer-events-none"></div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl border border-secondary-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-semibold text-lg text-primary-900 mb-1">Seu Status</h3>
                        <p className="text-gray-500 text-sm">Nível Atual: {tier}</p>
                        
                        <div className="mt-8 flex items-center gap-5">
                            <div className="text-5xl drop-shadow-sm">🏆</div>
                            <div>
                                <p className="font-bold text-gray-900 text-xl">{currentTierInfo.name}</p>
                                <p className="text-sm text-gray-500 mt-1 leading-snug">Seu menu lateral foi atualizado com as ferramentas desta fase.</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-400 italic leading-relaxed">
                            A Studio Be monetiza e entrega valor progressivamente, liberando ferramentas e consultorias conforme a comunidade avança.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Shortcuts */}
            {tier > 0 && (
                <div className="pt-4">
                    <h3 className="font-semibold text-lg text-primary-900 mb-6">Acesso Rápido às Suas Ferramentas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/dashboard/perfil" className="bg-white p-5 rounded-xl border border-secondary-100 text-center hover:border-primary-200 hover:shadow-md transition-all group">
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👤</div>
                            <span className="text-sm font-semibold text-gray-700">Meu Perfil</span>
                        </Link>
                        {tier >= 2 && (
                            <Link href="/dashboard/comunidade" className="bg-white p-5 rounded-xl border border-secondary-100 text-center hover:border-primary-200 hover:shadow-md transition-all group">
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👥</div>
                                <span className="text-sm font-semibold text-gray-700">Vizinhos</span>
                            </Link>
                        )}
                        {tier >= 3 && (
                            <Link href="/dashboard/governanca" className="bg-white p-5 rounded-xl border border-secondary-100 text-center hover:border-primary-200 hover:shadow-md transition-all group">
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏛️</div>
                                <span className="text-sm font-semibold text-gray-700">Governança</span>
                            </Link>
                        )}
                        {tier >= 5 && (
                            <Link href="/dashboard/financas" className="bg-white p-5 rounded-xl border border-secondary-100 text-center hover:border-primary-200 hover:shadow-md transition-all group">
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📊</div>
                                <span className="text-sm font-semibold text-gray-700">Finanças</span>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
