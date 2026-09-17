'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GestaoCursosPage() {
    const [levels, setLevels] = useState<any[]>([]);
    const [modules, setModules] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [resL, resM, resLes] = await Promise.all([
                fetch('/api/cursos/levels').then(r => r.json()),
                fetch('/api/cursos/modules').then(r => r.json()),
                fetch('/api/cursos/lessons').then(r => r.json())
            ]);
            if (resL.levels) setLevels(resL.levels);
            if (resM.modules) setModules(resM.modules);
            if (resLes.lessons) setLessons(resLes.lessons);
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Carregando painel de gestão...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 p-4 md:p-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-secondary-900">Gestão de Treinamentos</h1>
                    <p className="text-gray-600 mt-2">Hierarquia: Nível &gt; Módulo &gt; Aula.</p>
                </div>
                <Link href="/dashboard/cursos" className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors border border-gray-300">
                    Ver Visão do Aluno
                </Link>
            </div>

            <div className="space-y-10">
                {levels.sort((a,b) => a.order_index - b.order_index).map(level => {
                    const levelModules = modules.filter(m => m.level_id === level.id).sort((a,b) => a.order_index - b.order_index);
                    return (
                        <div key={level.id} className="bg-white rounded-2xl border border-primary-200 shadow-sm overflow-hidden">
                            <div className="bg-primary-50 px-6 py-4 border-b border-primary-200">
                                <h2 className="text-xl font-bold text-primary-900">{level.title}</h2>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                {levelModules.length === 0 && <p className="text-sm text-gray-500 italic">Nenhum módulo cadastrado neste nível.</p>}
                                
                                {levelModules.map(module => {
                                    const moduleLessons = lessons.filter(l => l.module_id === module.id).sort((a,b) => a.order_index - b.order_index);
                                    return (
                                        <div key={module.id} className="border border-secondary-200 rounded-xl overflow-hidden">
                                            <div className="bg-secondary-50 px-4 py-3 border-b border-secondary-200 flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-secondary-900 text-lg">{module.title}</h3>
                                                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{module.description}</p>
                                                </div>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {moduleLessons.length === 0 && <p className="text-sm text-gray-500 italic p-4">Sem aulas cadastradas neste módulo.</p>}
                                                {moduleLessons.map((lesson, idx) => (
                                                    <div key={lesson.id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded bg-secondary-100 text-secondary-700 flex items-center justify-center font-bold text-sm">
                                                                {idx + 1}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-gray-800 text-sm">{lesson.title}</h4>
                                                                {lesson.video_url && <span className="text-xs text-blue-500 mr-2">Tem Vídeo</span>}
                                                                {lesson.text_content && <span className="text-xs text-green-500">Tem Texto</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
            
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-2xl">
                <p className="text-gray-500">Para cadastrar novos níveis, módulos ou aulas, solicite aos desenvolvedores ou utilize as APIs rest.</p>
            </div>
        </div>
    );
}
