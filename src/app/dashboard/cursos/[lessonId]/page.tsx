'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactPlayer from 'react-player';

export default function AulaPage({ params }: { params: Promise<{ lessonId: string }> }) {
    const router = useRouter();
    const [lesson, setLesson] = useState<any>(null);
    const [moduleInfo, setModuleInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lessonId, setLessonId] = useState<string>('');

    useEffect(() => {
        params.then(p => {
            setLessonId(p.lessonId);
        });
    }, [params]);

    useEffect(() => {
        if (!lessonId) return;

        const fetchLessonData = async () => {
            try {
                // To keep it simple without writing a new API just for 1 lesson, 
                // we fetch all and find it (in a real app, use a specific endpoint for performance).
                const resLes = await fetch('/api/cursos/lessons');
                const dataLes = await resLes.json();
                const currentLesson = dataLes.lessons?.find((l: any) => l.id === lessonId);
                
                if (currentLesson) {
                    setLesson(currentLesson);
                    const resMod = await fetch('/api/cursos/modules');
                    const dataMod = await resMod.json();
                    const parentModule = dataMod.modules?.find((m: any) => m.id === currentLesson.module_id);
                    setModuleInfo(parentModule);
                }
            } catch(e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchLessonData();
    }, [lessonId]);

    if (loading) return <div className="p-10 text-center text-gray-500">Carregando aula...</div>;
    if (!lesson) return <div className="p-10 text-center text-red-500">Aula não encontrada.</div>;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <Link href="/dashboard/cursos" className="hover:text-primary-600 transition-colors">Treinamentos</Link>
                <span>/</span>
                <span className="truncate max-w-[200px]">{moduleInfo?.title}</span>
                <span>/</span>
                <span className="font-bold text-gray-800">{lesson.title}</span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden">
                {/* Header */}
                <div className="bg-secondary-900 px-6 py-5 text-white flex justify-between items-center">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary-400 mb-1 block">Aula {lesson.order_index}</span>
                        <h1 className="text-2xl font-bold">{lesson.title}</h1>
                    </div>
                </div>

                {/* Player Section */}
                <div className="bg-black w-full aspect-video relative flex items-center justify-center">
                    {lesson.video_url ? (
                        <div className="absolute inset-0 w-full h-full">
                            {/* ReactPlayer is great for YouTube/Vimeo/MP4 embeds */}
                            <ReactPlayer 
                                url={lesson.video_url} 
                                width="100%" 
                                height="100%" 
                                controls={true}
                                
                            />
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center p-8">
                            Nenhum vídeo cadastrado para esta aula.
                        </div>
                    )}
                </div>

                {/* Content / Text / Quizzes space */}
                <div className="p-6 md:p-8">
                    <h3 className="text-xl font-bold text-primary-900 mb-4">Material de Apoio</h3>
                    {lesson.text_content ? (
                        <div className="prose prose-primary max-w-none text-gray-700">
                            {lesson.text_content}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">O facilitador ainda não adicionou materiais complementares para esta aula.</p>
                    )}
                    
                    <div className="mt-12 pt-6 border-t border-gray-200 flex justify-end">
                        <button className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2">
                            Marcar como Concluída
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
