'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ProprietariosWizardPage() {
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<'idle'|'uploading'|'saving'|'success'|'error'>('idle');
    const [file, setFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        // Step 1: Identificação
        property_name: '', owner_name: '', owner_phone: '', owner_email: '', preferred_contact: 'WhatsApp',
        location_city: '', maps_link: '', coordinates: '', area_hectares: '', useful_area: '',
        
        // Step 2: Comercial & Documental
        estimated_price: '', price_per_hectare: '',
        accept_negotiation: false, accept_exchange: false, accept_partnership: false, accept_buy_option: false,
        documentation: '', judicial_issues: '', has_commission: false,
        
        // Step 3: Físicas & Infraestrutura
        topography: '', forest_area: '', water_sources: [] as string[],
        has_water: '', // resumo
        
        // Step 4: Pitch
        owner_pitch: ''
    });

    const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
    const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('saving');
        
        try {
            let fileUrls: string[] = [];
            
            // 1. Upload do Arquivo se existir
            if (file) {
                setStatus('uploading');
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${fileName}`;
                
                const { error: uploadError, data } = await supabase.storage
                    .from('territory_documents')
                    .upload(filePath, file);
                    
                if (uploadError) {
                    console.error('Erro no upload:', uploadError);
                } else if (data) {
                    const { data: publicUrlData } = supabase.storage.from('territory_documents').getPublicUrl(filePath);
                    fileUrls.push(publicUrlData.publicUrl);
                }
            }

            setStatus('saving');
            // 2. Salvar no Banco
            const payload = { ...formData };
            if (payload.forest_area === '') delete payload.forest_area;

            const { error } = await supabase.from('territories').insert([{
                ...payload,
                area_hectares: Number(formData.area_hectares) || 0,
                useful_area: Number(formData.useful_area) || 0,
                price_per_hectare: Number(formData.price_per_hectare) || 0,
                files_urls: fileUrls
            }]);
            
            if (error) throw error;
            
            setStatus('success');
        } catch (err: any) {
            console.error(err);
            setStatus('error');
            alert('Erro ao salvar no banco: ' + (err.message || 'Desconhecido'));
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
                <div className="max-w-2xl bg-white p-12 rounded-3xl shadow-xl text-center border border-emerald-100">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner">🗺️</div>
                    <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Propriedade Submetida!</h2>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        Sua área foi recebida e entrará em nosso <strong>Algoritmo de Inteligência Territorial</strong>. 
                        Nossa equipe avaliará a viabilidade regenerativa e o potencial de valorização. 
                        Caso atingida a pontuação necessária, nossa equipe de aquisições entrará em contato.
                    </p>
                    <Link href="/" className="bg-emerald-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-emerald-700 transition-colors inline-block">
                        Voltar para a Página Inicial
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-20">
            <header className="bg-white border-b border-slate-200 py-6 sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
                    <h1 className="font-serif font-bold text-2xl text-slate-900">Studio Be</h1>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full text-sm border border-emerald-200">Portal do Proprietário</span>
                </div>
            </header>

            <section className="max-w-3xl mx-auto px-4 pt-12">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Cadastre sua Propriedade</h2>
                    <p className="text-slate-600 text-lg">Buscamos áreas estratégicas para o desenvolvimento de comunidades regenerativas de alto padrão.</p>
                </div>

                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-8 relative">
                    <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
                    <div className="absolute left-0 top-1/2 h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                    
                    {[1, 2, 3, 4].map(num => (
                        <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors ${step >= num ? 'bg-emerald-500 border-white text-white shadow-md' : 'bg-slate-100 border-white text-slate-400'}`}>
                            {num}
                        </div>
                    ))}
                </div>

                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
                    <form onSubmit={handleSubmit}>
                        
                        {/* STEP 1 */}
                        <div className={step === 1 ? 'block' : 'hidden'}>
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span>👤</span> Identificação e Localização</h3>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo *</label><input required type="text" value={formData.owner_name} onChange={e => setFormData({...formData, owner_name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Telefone/WhatsApp *</label><input required type="text" value={formData.owner_phone} onChange={e => setFormData({...formData, owner_phone: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Nome da Propriedade (Opcional)</label><input type="text" value={formData.property_name} onChange={e => setFormData({...formData, property_name: e.target.value})} placeholder="Ex: Fazenda Bela Vista" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Município da Área *</label><input required type="text" value={formData.location_city} placeholder="Ex: Itu, Porto Feliz..."  onChange={e => setFormData({...formData, location_city: e.target.value})} placeholder="Ex: Porto Feliz, Itu..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                </div>
                                <div><label className="block text-sm font-bold text-slate-700 mb-1">Link do Google Maps (Opcional)</label><input type="text" value={formData.maps_link} onChange={e => setFormData({...formData, maps_link: e.target.value})} placeholder="Cole o link do mapa aqui" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Área Total (Hectares) *</label><input required type="number" step="0.1" value={formData.area_hectares} onChange={e => setFormData({...formData, area_hectares: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Área Útil (Opcional)</label><input type="number" step="0.1" value={formData.useful_area} onChange={e => setFormData({...formData, useful_area: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                </div>
                            </div>
                        </div>

                        {/* STEP 2 */}
                        <div className={step === 2 ? 'block' : 'hidden'}>
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span>💼</span> Aspectos Comerciais</h3>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Preço Total Estimado (R$)</label><input type="text" value={formData.estimated_price} onChange={e => setFormData({...formData, estimated_price: e.target.value})} placeholder="Ex: 5.000.000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Situação Documental</label>
                                        <select value={formData.documentation} onChange={e => setFormData({...formData, documentation: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                                            <option value="">Selecione...</option>
                                            <option value="Matrícula Limpa">Matrícula Limpa</option>
                                            <option value="Em Inventário/Usucapião">Em Inventário/Usucapião</option>
                                            <option value="Apenas Contrato">Apenas Contrato</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                    <label className="block text-sm font-bold text-slate-700 mb-3">Modelos de Negócio Aceitos (Marque os aplicáveis):</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.accept_negotiation} onChange={e => setFormData({...formData, accept_negotiation: e.target.checked})} className="w-5 h-5 text-emerald-600 rounded" /> Aceita negociar valor</label>
                                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.accept_exchange} onChange={e => setFormData({...formData, accept_exchange: e.target.checked})} className="w-5 h-5 text-emerald-600 rounded" /> Aceita permuta física</label>
                                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.accept_partnership} onChange={e => setFormData({...formData, accept_partnership: e.target.checked})} className="w-5 h-5 text-emerald-600 rounded" /> Parceria com desenvolvedor</label>
                                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.accept_buy_option} onChange={e => setFormData({...formData, accept_buy_option: e.target.checked})} className="w-5 h-5 text-emerald-600 rounded" /> Opção de Compra (Due Diligence)</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STEP 3 */}
                        <div className={step === 3 ? 'block' : 'hidden'}>
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span>🏞️</span> Características Físicas</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Topografia Predominante</label>
                                    <select value={formData.topography} onChange={e => setFormData({...formData, topography: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                                        <option value="">Selecione...</option>
                                        <option value="Maioria Plana">Plana (Até 5% declividade)</option>
                                        <option value="Ondulada">Ondulada (5% a 20%)</option>
                                        <option value="Acidentada">Acidentada / Montanhosa</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Recursos Hídricos na Área (Resumo) *</label>
                                    <select required value={formData.has_water} onChange={e => setFormData({...formData, has_water: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                                        <option value="">Selecione...</option>
                                        <option value="Rico em Água (Rios/Represa)">Rico em Água (Rios, Represas grandes)</option>
                                        <option value="Nascentes/Poço">Nascentes, Córregos ou Poço</option>
                                        <option value="Seco">Seco / Sem recursos relevantes</option>
                                    </select>
                                </div>
                                
                                <div className="border-t border-slate-200 pt-5 mt-5">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Upload de Documento ou Foto (Opcional)</label>
                                    <p className="text-xs text-slate-500 mb-3">Anexe a Matrícula, um KML ou uma foto representativa (PDF, JPG, PNG).</p>
                                    <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                                </div>
                            </div>
                        </div>

                        {/* STEP 4 */}
                        <div className={step === 4 ? 'block' : 'hidden'}>
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span>💡</span> O Potencial</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-lg font-serif font-bold text-slate-800 mb-2">Por que você acredita que esta propriedade tem potencial para um Cohousing?</label>
                                    <p className="text-sm text-slate-500 mb-3">Conte-nos sobre a vocação da terra, a paisagem, as transformações do entorno ou qualquer diferencial.</p>
                                    <textarea rows={5} value={formData.owner_pitch} onChange={e => setFormData({...formData, owner_pitch: e.target.value})} placeholder="Ex: É uma área muito próxima do novo parque tecnológico, tem uma vista incrível e muita água pura..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
                            {step > 1 ? (
                                <button type="button" onClick={handlePrev} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">← Voltar</button>
                            ) : <div></div>}
                            
                            {step < 4 ? (
                                <button type="button" onClick={handleNext} className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-lg">Próxima Etapa →</button>
                            ) : (
                                <button type="submit" disabled={status !== 'idle'} className="bg-emerald-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2">
                                    {status === 'idle' ? 'Concluir e Enviar Oferta' : <><span className="animate-spin">⏳</span> Processando...</>}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
