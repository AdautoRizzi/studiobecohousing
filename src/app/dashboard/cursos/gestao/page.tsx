'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';


export default function GestaoCursosPage() {
    const [levels, setLevels] = useState<any[]>([]);
    const [modules, setModules] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [materials, setMaterials] = useState<any[]>([]);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [resL, resM, resLes, resMat] = await Promise.all([
                fetch('/api/cursos/levels').then(r => r.json()),
                fetch('/api/cursos/modules').then(r => r.json()),
                fetch('/api/cursos/lessons').then(r => r.json()),
                fetch('/api/cursos/materials').then(r => r.json())
            ]);
            if (resL.levels) setLevels(resL.levels);
            if (resM.modules) setModules(resM.modules);
            if (resLes.lessons) setLessons(resLes.lessons);
            if (resMat && resMat.materials) setMaterials(resMat.materials);
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };


    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile || !uploadTitle) return;
        
        setUploading(true);
        try {
            const fileExt = uploadFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage.from('course_materials').upload(fileName, uploadFile);
            if (uploadError) throw uploadError;
            
            const { data: publicUrlData } = supabase.storage.from('course_materials').getPublicUrl(fileName);
            
            await fetch('/api/cursos/materials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: uploadTitle, file_url: publicUrlData.publicUrl })
            });
            
            setUploadTitle('');
            setUploadFile(null);
            fetchData();
        } catch (error) {
            console.error('Upload falhou:', error);
            alert('Falha no upload. Verifique as permissões.');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteMaterial = async (id: string) => {
        if (!confirm('Deseja realmente remover este material?')) return;
        await fetch(`/api/cursos/materials/${id}`, { method: 'DELETE' });
        fetchData();
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

            
            {/* Biblioteca de PDFs */}
            <div className="bg-white rounded-2xl border border-primary-200 shadow-sm overflow-hidden mb-10">
                <div className="bg-primary-900 px-6 py-4 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold">📚 Biblioteca de PDFs (Para Impressão)</h2>
                </div>
                <div className="p-6">
                    <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Título do Material</label>
                            <input type="text" required value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="Ex: Cartões do Anel de Reciprocidade" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Arquivo (.pdf)</label>
                            <input type="file" required accept=".pdf" onChange={e => setUploadFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 bg-white" />
                        </div>
                        <button type="submit" disabled={uploading} className="px-6 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 h-[42px] whitespace-nowrap">
                            {uploading ? 'Enviando...' : 'Fazer Upload'}
                        </button>
                    </form>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {materials.length === 0 && <p className="text-gray-500 italic col-span-full">Nenhum material cadastrado ainda.</p>}
                        {materials.map(mat => (
                            <div key={mat.id} className="flex flex-col p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="text-red-500 text-2xl">📄</div>
                                    <button onClick={() => handleDeleteMaterial(mat.id)} className="text-gray-400 hover:text-red-600">🗑️</button>
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm mb-3 flex-1">{mat.title}</h4>
                                <a href={mat.file_url} target="_blank" rel="noopener noreferrer" className="text-center px-4 py-2 bg-gray-100 text-primary-700 font-bold rounded-lg hover:bg-gray-200 text-sm transition-colors border border-gray-200">
                                    📥 Baixar PDF
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
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
