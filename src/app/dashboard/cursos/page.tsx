'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Module {
    id: string;
    title: string;
    description: string;
    order_index: number;
}

interface Lesson {
    id: string;
    module_id: string;
    title: string;
    video_url: string;
    order_index: number;
}

export default function CursosAlunoPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resMod = await fetch('/api/cursos/modules');
                const dataMod = await resMod.json();
                if (dataMod.modules) setModules(dataMod.modules);

                const resLes = await fetch('/api/cursos/lessons');
                const dataLes = await resLes.json();
                if (dataLes.lessons) setLessons(dataLes.lessons);
            } catch(e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Carregando trilhas de conhecimento...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary-900">Trilha de Formação</h1>
                    <p className="text-gray-600 mt-2">Acesse seus cursos, assista as aulas e prepare-se para a vida em comunidade.</p>
                </div>
                {/* Apenas instrutores/admins devem ver isso na real, mas deixamos o atalho por praticidade */}
                <Link href="/dashboard/cursos/gestao" className="px-4 py-2 bg-primary-50 text-primary-700 font-bold rounded-xl hover:bg-primary-100 transition-colors border border-primary-200">
                    ⚙️ Painel do Instrutor
                </Link>
            </div>

            <div className="space-y-8">
                {modules.length === 0 ? (
                    <div className="bg-white p-10 text-center rounded-2xl border border-dashed border-gray-300 text-gray-500">
                        Nenhum módulo disponível no momento.
                    </div>
                ) : (
                    modules.sort((a,b) => a.order_index - b.order_index).map(module => {
                        const moduleLessons = lessons.filter(l => l.module_id === module.id).sort((a,b) => a.order_index - b.order_index);
                        return (
                            <div key={module.id} className="bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-primary-900 to-secondary-900 px-6 md:px-8 py-6 text-white">
                                    <h2 className="text-2xl font-bold">{module.title}</h2>
                                    <p className="text-primary-100 mt-2 max-w-3xl whitespace-pre-wrap leading-relaxed opacity-90">{module.description}</p>
                                </div>
                                <div className="p-6 md:p-8">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Aulas deste módulo:</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {moduleLessons.length === 0 ? (
                                            <p className="text-gray-500 italic">Módulo em construção...</p>
                                        ) : (
                                            moduleLessons.map((lesson, idx) => (
                                                <Link href={`/dashboard/cursos/${lesson.id}`} key={lesson.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-primary-200 hover:shadow-md transition-all group">
                                                    <div className="w-12 h-12 flex-shrink-0 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-lg group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <h4 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{lesson.title}</h4>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            Assistir Aula
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
