'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CursosAlunoPage() {
    const [programs, setPrograms] = useState<any[]>([]);
    const [levels, setLevels] = useState<any[]>([]);
    const [modules, setModules] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resP, resL, resM, resLes] = await Promise.all([
                    fetch('/api/cursos/programs').then(r => r.json()),
                    fetch('/api/cursos/levels').then(r => r.json()),
                    fetch('/api/cursos/modules').then(r => r.json()),
                    fetch('/api/cursos/lessons').then(r => r.json())
                ]);

                if (resP.programs) setPrograms(resP.programs);
                if (resL.levels) setLevels(resL.levels);
                if (resM.modules) setModules(resM.modules);
                if (resLes.lessons) setLessons(resLes.lessons);
            } catch(e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500">Carregando trilhas de conhecimento...</div>;

    const program = programs[0]; // Assuming one main program for now

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary-900">{program?.title || 'Trilha de Formação'}</h1>
                    <p className="text-gray-600 mt-2 whitespace-pre-wrap">{program?.description || 'Acesse seus cursos, assista as aulas e prepare-se para a vida em comunidade.'}</p>
                </div>
                <Link href="/dashboard/cursos/gestao" className="px-4 py-2 bg-primary-50 text-primary-700 font-bold rounded-xl hover:bg-primary-100 transition-colors border border-primary-200">
                    ⚙️ Painel do Instrutor
                </Link>
            </div>

            <div className="space-y-12">
                {levels.sort((a,b) => a.order_index - b.order_index).map((level) => {
                    const levelModules = modules.filter(m => m.level_id === level.id).sort((a,b) => a.order_index - b.order_index);
                    
                    return (
                        <div key={level.id} className="space-y-6">
                            <div className="border-b-2 border-primary-200 pb-2">
                                <h2 className="text-2xl font-bold text-primary-900">{level.title}</h2>
                                <p className="text-gray-600 mt-2 whitespace-pre-wrap">{level.description}</p>
                            </div>
                            
                            <div className="space-y-6 pl-0 md:pl-4">
                                {levelModules.length === 0 && <p className="text-gray-500 italic">Nenhum módulo cadastrado neste nível.</p>}
                                {levelModules.map(module => {
                                    const moduleLessons = lessons.filter(l => l.module_id === module.id).sort((a,b) => a.order_index - b.order_index);
                                    return (
                                        <div key={module.id} className="bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden">
                                            <div className="bg-gradient-to-r from-primary-900 to-secondary-900 px-6 py-4 text-white">
                                                <h3 className="text-xl font-bold">{module.title}</h3>
                                                {module.description && <p className="text-primary-100 mt-1 text-sm whitespace-pre-wrap leading-relaxed opacity-90">{module.description}</p>}
                                            </div>
                                            <div className="p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {moduleLessons.length === 0 ? (
                                                        <p className="text-gray-500 italic">Módulo em construção...</p>
                                                    ) : (
                                                        moduleLessons.map((lesson, idx) => (
                                                            <Link href={`/dashboard/cursos/${lesson.id}`} key={lesson.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-primary-200 hover:shadow-md transition-all group">
                                                                <div className="w-10 h-10 flex-shrink-0 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                                                    {idx + 1}
                                                                </div>
                                                                <div className="flex flex-col justify-center">
                                                                    <h4 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors text-sm">{lesson.title}</h4>
                                                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                        Acessar Conteúdo
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
