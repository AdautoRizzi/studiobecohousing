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
        location_city: '', maps_link: '', address: '', coordinates: '', area_hectares: '', useful_area: '', area_unit: 'Hectares (ha)',
        
        // Step 2: Comercial & Documental
        estimated_price: '', price_per_hectare: '',
        accept_negotiation: false, accept_exchange: false, accept_partnership: false, accept_buy_option: false,
        documentation: '', judicial_issues: '', has_commission: false,
        doc_car: false, doc_ccir: false, doc_itr: false, doc_georef: false, doc_legal_reserve: false, doc_app: false,
        
        // Step 3: Físicas & Infraestrutura
        topography: '', soil_type: '', forest_area: '', pasture_area: '', agriculture_area: '', distance_main_road: '',
        water_sources: [] as string[], infra_items: [] as string[], improvements: [] as string[], current_use: [] as string[],
        has_water: '', // resumo
        
        // Step 4: Pitch
        owner_pitch: ''
    });

    const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
    const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        
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
            const payload: any = { ...formData };
            if (payload.forest_area === '') delete payload.forest_area;
        if (payload.pasture_area === '') delete payload.pasture_area;
        if (payload.agriculture_area === '') delete payload.agriculture_area;

            // Converter a área para Hectares internamente para a calculadora funcionar
            let multiplier = 1;
            if (payload.area_unit === 'Alqueires Paulistas') multiplier = 2.42;
            if (payload.area_unit === 'Alqueires Mineiros') multiplier = 4.84;
            if (payload.area_unit === 'Metros Quadrados (m²)') multiplier = 0.0001;

            const finalAreaHectares = (Number(formData.area_hectares) || 0) * multiplier;
            const finalUsefulArea = (Number(formData.useful_area) || 0) * multiplier;

            // Registrar a info original no Pitch para o CRM visualizar
            const unitInfo = `\n\n[NOTA DO SISTEMA: Área informada originalmente como ${formData.area_hectares} ${formData.area_unit}. Convertido automaticamente para ${finalAreaHectares.toFixed(2)} Hectares pelo algoritmo]`;
            const finalPitch = (payload.owner_pitch || '') + unitInfo;
            delete payload.area_unit; // Não temos essa coluna no Supabase ainda

            const { error } = await supabase.from('territories').insert([{
                ...payload,
                area_hectares: finalAreaHectares,
                useful_area: finalUsefulArea,
                owner_pitch: finalPitch,
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
                        Nossa equipe de aquisições fará uma análise detalhada e entrará em contato em breve para conversar sobre os próximos passos.
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
                    <p className="text-slate-600 text-lg">Buscamos áreas estratégicas para o desenvolvimento de comunidades regenerativas.</p>
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
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">E-mail (Opcional)</label><input type="email" value={formData.owner_email} onChange={e => setFormData({...formData, owner_email: e.target.value})} placeholder="Seu melhor e-mail" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Forma Preferencial de Contato</label><select value={formData.preferred_contact} onChange={e => setFormData({...formData, preferred_contact: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"><option value="WhatsApp">WhatsApp</option><option value="Telefone">Ligação Telefônica</option><option value="E-mail">E-mail</option></select></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Nome da Propriedade (Opcional)</label><input type="text" value={formData.property_name} onChange={e => setFormData({...formData, property_name: e.target.value})} placeholder="Ex: Fazenda Bela Vista" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Município da Área *</label><input required type="text" value={formData.location_city} onChange={e => setFormData({...formData, location_city: e.target.value})} placeholder="Ex: Porto Feliz, Itu..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                </div>
                                <div><label className="block text-sm font-bold text-slate-700 mb-1">Endereço ou Localização Detalhada (Opcional)</label><input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Rua, Estrada km, Referências..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none mb-5" /></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Link do Google Maps (Opcional)</label><input type="text" value={formData.maps_link} onChange={e => setFormData({...formData, maps_link: e.target.value})} placeholder="Cole o link do mapa aqui" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Coordenadas Geográficas (Opcional)</label><input type="text" value={formData.coordinates} onChange={e => setFormData({...formData, coordinates: e.target.value})} placeholder="-23.5505, -46.6333" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Unidade de Medida *</label>
                                        <select value={formData.area_unit} onChange={e => setFormData({...formData, area_unit: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                                            <option value="Hectares (ha)">Hectares (ha)</option>
                                            <option value="Alqueires Paulistas">Alqueires Paulistas (24.200 m²)</option>
                                            <option value="Alqueires Mineiros">Alqueires Mineiros (48.400 m²)</option>
                                            <option value="Metros Quadrados (m²)">Metros Quadrados (m²)</option>
                                        </select>
                                    </div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Área Total *</label><input required type="number" step="any" value={formData.area_hectares} onChange={e => setFormData({...formData, area_hectares: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Área Útil (Opcional)</label><input type="number" step="any" value={formData.useful_area} onChange={e => setFormData({...formData, useful_area: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                                </div>
                            </div>
                        </div>

                        {/* STEP 2 */}
                        <div className={step === 2 ? 'block' : 'hidden'}>
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span>💼</span> Aspectos Comerciais</h3>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
    <label className="block text-sm font-bold text-slate-700 mb-1">Preço Total Estimado (R$)</label>
    <input type="text" value={formData.estimated_price} onChange={e => {
        let val = e.target.value.replace(/\D/g, '');
        if (val) {
            val = (Number(val) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        setFormData({...formData, estimated_price: val});
    }} placeholder="Ex: 5.000.000,00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
</div>
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
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mt-5">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Documentos e Cadastros (Opcional)</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                                        {[
                                            {id: 'doc_car', label: 'CAR'}, {id: 'doc_ccir', label: 'CCIR'}, {id: 'doc_itr', label: 'ITR'},
                                            {id: 'doc_georef', label: 'Georreferenciamento'}, {id: 'doc_legal_reserve', label: 'Reserva Legal'}, {id: 'doc_app', label: 'APP'}
                                        ].map(doc => (
                                            <label key={doc.id} className="flex items-center gap-2 text-sm text-slate-600 bg-white p-2 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-50">
                                                <input type="checkbox" checked={formData[doc.id as keyof typeof formData] as boolean} onChange={e => setFormData({...formData, [doc.id]: e.target.checked})} className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
                                                {doc.label}
                                            </label>
                                        ))}
                                    </div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Pendências Judiciais/Fundiárias (Opcional)</label>
                                    <textarea rows={2} value={formData.judicial_issues} onChange={e => setFormData({...formData, judicial_issues: e.target.value})} placeholder="Descreva brevemente se houver restrições..." className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* STEP 3 */}
                        <div className={step === 3 ? 'block' : 'hidden'}>
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span>🏞️</span> Características Físicas</h3>
                            <div className="space-y-5">
<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
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
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Solo (Opcional)</label>
                                        <input type="text" value={formData.soil_type} onChange={e => setFormData({...formData, soil_type: e.target.value})} placeholder="Ex: Terra roxa, Arenoso..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Mata (ha) (Opcional)</label>
                                        <input type="number" step="any" value={formData.forest_area} onChange={e => setFormData({...formData, forest_area: e.target.value})} placeholder="Ex: 2.5" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Pastagem (ha) (Opcional)</label>
                                        <input type="number" step="any" value={formData.pasture_area} onChange={e => setFormData({...formData, pasture_area: e.target.value})} placeholder="Ex: 5.0" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Agrícola (ha) (Opcional)</label>
                                        <input type="number" step="any" value={formData.agriculture_area} onChange={e => setFormData({...formData, agriculture_area: e.target.value})} placeholder="Ex: 10.0" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Recursos Hídricos (Resumo) *</label>
                                        <select required value={formData.has_water} onChange={e => setFormData({...formData, has_water: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                                            <option value="">Selecione...</option>
                                            <option value="Rico em Água (Rios/Represa)">Rico em Água (Rios, Represas grandes)</option>
                                            <option value="Nascentes">Múltiplas Nascentes / Córregos</option>
                                            <option value="Poço Artesiano">Apenas Poço Artesiano / Caipira</option>
                                            <option value="Seco">Seco / Sem recursos relevantes</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Vazão do Poço / Rio (Opcional)</label>
                                        <input type="text" placeholder="Ex: 5.000 litros/hora" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" onChange={e => setFormData({...formData, owner_pitch: formData.owner_pitch.includes('| Vazão:') ? formData.owner_pitch.replace(/\| Vazão: .*/, '| Vazão: ' + e.target.value) : formData.owner_pitch + ' | Vazão: ' + e.target.value})} />
                                    </div>
                                </div>
                                
                                
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Uso Atual da Propriedade (Opcional)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Pecuária', 'Agricultura', 'Lazer', 'Residencial', 'Turismo', 'Área sem utilização', 'Outro'].map(uso => (
                                            <label key={uso} className={`px-4 py-2 rounded-full border text-sm cursor-pointer transition-colors ${formData.current_use.includes(uso) ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                <input type="checkbox" className="hidden" checked={formData.current_use.includes(uso)} onChange={(e) => {
                                                    const updated = e.target.checked ? [...formData.current_use, uso] : formData.current_use.filter(i => i !== uso);
                                                    setFormData({...formData, current_use: updated});
                                                }} />
                                                {uso}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Infraestrutura Existente (Opcional)</label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {['Energia Elétrica', 'Saneamento/Fossa', 'Internet', 'Telefonia', 'Acesso Asfaltado'].map(infra => (
                                            <label key={infra} className={`px-4 py-2 rounded-full border text-sm cursor-pointer transition-colors ${formData.infra_items.includes(infra) ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                <input type="checkbox" className="hidden" checked={formData.infra_items.includes(infra)} onChange={(e) => {
                                                    const updated = e.target.checked ? [...formData.infra_items, infra] : formData.infra_items.filter(i => i !== infra);
                                                    setFormData({...formData, infra_items: updated});
                                                }} />
                                                {infra}
                                            </label>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {['Construções/Sedes', 'Cercas', 'Estradas Internas', 'Vista/Paisagem'].map(imp => (
                                            <label key={imp} className={`px-4 py-2 rounded-full border text-sm cursor-pointer transition-colors ${formData.improvements.includes(imp) ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                <input type="checkbox" className="hidden" checked={formData.improvements.includes(imp)} onChange={(e) => {
                                                    const updated = e.target.checked ? [...formData.improvements, imp] : formData.improvements.filter(i => i !== imp);
                                                    setFormData({...formData, improvements: updated});
                                                }} />
                                                {imp}
                                            </label>
                                        ))}
                                    </div>
                                    <div><input type="text" value={formData.distance_main_road} onChange={e => setFormData({...formData, distance_main_road: e.target.value})} placeholder="Distância aproximada da estrada principal (ex: 2km de terra)" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
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
                                <button type="button" onClick={handleSubmit} disabled={status !== 'idle'} className="bg-emerald-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2">
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
