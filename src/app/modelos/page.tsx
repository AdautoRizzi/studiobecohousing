"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { Button } from '@/components/ui/Button';

// Tipos extraídos
interface ICohousingModel {
    id: number;
    name: string;
    location: string;
    type: string;
    purpose: string[];
    features: string[];
    image: string;
}

const allModels: ICohousingModel[] = [
    { id: 1, name: 'Comunidade Serra Verde', location: 'Minas Gerais', type: 'Rural', purpose: ['Sustentabilidade', 'Arte'], features: ['Horta orgânica', 'Ateliê compartilhado', 'Trilhas ecológicas'], image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1887' },
    { id: 2, name: 'Vila Harmonia Urbana', location: 'São Paulo', type: 'Urbano', purpose: ['Empreendedorismo', 'Saúde'], features: ['Coworking', 'Academia', 'Proximidade a centros médicos'], image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070' },
    { id: 3, name: 'Refúgio Litorâneo', location: 'Santa Catarina', type: 'Rural', purpose: ['Saúde', 'Lazer'], features: ['Acesso à praia', 'Piscina natural', 'Cozinha gourmet'], image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070' },
    { id: 4, name: 'Polo Criativo Paulista', location: 'São Paulo', type: 'Urbano', purpose: ['Arte', 'Cultura'], features: ['Oficinas de arte', 'Biblioteca comunitária', 'Perto de teatros'], image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070' },
    { id: 5, name: 'Morada do Sol Nascente', location: 'Bahia', type: 'Rural', purpose: ['Espiritualidade', 'Sustentabilidade'], features: ['Espaço de meditação', 'Energia solar', 'Reuso de água'], image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070' },
    { id: 6, name: 'Centro de Inovação Sênior', location: 'Paraná', type: 'Urbano', purpose: ['Empreendedorismo', 'Tecnologia'], features: ['Laboratório de ideias', 'Cursos de tecnologia', 'Automação residencial'], image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069' },
];

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-6 py-2.5 text-sm font-semibold rounded-full border transition-all duration-300 shadow-sm ${isActive
            ? 'bg-primary-500 text-white border-primary-500 shadow-md transform scale-105'
            : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700'}`}
    >
        {label}
    </button>
);

const ModelCard: React.FC<{ model: ICohousingModel }> = ({ model }) => (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col border border-gray-100 group">
        <div className="relative h-60 overflow-hidden">
            <img src={model.image} alt={model.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                📍 {model.location}
            </div>
            <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="bg-primary-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {model.type}
                </span>
            </div>
        </div>
        <div className="p-8 flex flex-col flex-grow relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">{model.name}</h3>

            <div className="mb-6 flex flex-wrap gap-2">
                {model.purpose.map(p => (
                    <span key={p} className="inline-block bg-secondary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full border border-primary-100">
                        {p}
                    </span>
                ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-8 flex-grow">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Diferenciais da Comunidade</p>
                <ul className="text-sm text-gray-600 space-y-2">
                    {model.features.map(f => (
                        <li key={f} className="flex items-center gap-2">
                            <span className="text-green-500">✓</span> {f}
                        </li>
                    ))}
                </ul>
            </div>

            <Link href="/#cadastro" className="inline-flex items-center justify-center w-full h-12 rounded-full font-bold shadow-sm border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors">
                Juntar-se ao Grupo
            </Link>
        </div>
    </div>
);

export default function ModelosPage() {
    const [typeFilter, setTypeFilter] = useState<'All' | 'Rural' | 'Urbano'>('All');
    const [locationFilter, setLocationFilter] = useState<string>('All');

    const locations = ['All', ...Array.from(new Set(allModels.map(m => m.location)))];

    const filteredModels = useMemo(() => {
        return allModels.filter(model => {
            const typeMatch = typeFilter === 'All' || model.type === typeFilter;
            const locationMatch = locationFilter === 'All' || model.location === locationFilter;
            return typeMatch && locationMatch;
        });
    }, [typeFilter, locationFilter]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-foreground flex flex-col">
            <PublicHeader />

            <main className="flex-1 py-16 lg:py-24">
                <div className="container mx-auto px-6">
                    {/* Cabeçalho */}
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold text-primary-900 tracking-tight mb-6">Explore Nossos Modelos</h1>
                        <p className="text-lg md:text-xl text-gray-600">
                            Encontre a comunidade que mais se alinha com seus valores, propósito e estilo de vida.
                        </p>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm mb-16 flex flex-col lg:flex-row items-center justify-between gap-6 border border-gray-100 max-w-5xl mx-auto">
                        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
                            <span className="font-semibold text-gray-400 uppercase text-xs tracking-wider mr-2">Filtro por Tipo:</span>
                            <FilterButton label="Todos os Ambientes" isActive={typeFilter === 'All'} onClick={() => setTypeFilter('All')} />
                            <FilterButton label="🏔️ Retiro Rural" isActive={typeFilter === 'Rural'} onClick={() => setTypeFilter('Rural')} />
                            <FilterButton label="🏙️ Centro Urbano" isActive={typeFilter === 'Urbano'} onClick={() => setTypeFilter('Urbano')} />
                        </div>

                        <div className="flex items-center gap-4 w-full lg:w-auto bg-gray-50 px-4 py-2.5 rounded-full border border-gray-200">
                            <label htmlFor="location-filter" className="font-semibold text-gray-400 uppercase text-xs tracking-wider whitespace-nowrap">Localidade:</label>
                            <select
                                id="location-filter"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="bg-transparent text-primary-900 font-semibold text-sm outline-none border-none cursor-pointer w-full focus:ring-0 appearance-none"
                            >
                                <option value="All">Todas as Regiões</option>
                                {locations.filter(loc => loc !== 'All').map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Grid de Modelos */}
                    {filteredModels.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                            {filteredModels.map(model => <ModelCard key={model.id} model={model} />)}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-300">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nenhuma comunidade disponível</h3>
                            <p className="text-lg text-gray-500">Tente ajustar seus filtros de localidade ou tipo de ambiente.</p>
                            <Button className="mt-8 rounded-full" onClick={() => {
                                setTypeFilter('All');
                                setLocationFilter('All');
                            }}>
                                Limpar Filtros
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer Unificado Público */}
            <PublicFooter />
        </div>
    );
}
