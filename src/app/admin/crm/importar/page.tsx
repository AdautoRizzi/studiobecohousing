'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { bulkImportLeadsAction } from '@/app/actions';

export default function ImportLeadsPage() {
    const router = useRouter();
    const [pastedData, setPastedData] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: number, failed: number } | null>(null);

    const handleImport = async () => {
        if (!pastedData.trim()) {
            alert('Por favor, cole os dados da planilha antes de continuar.');
            return;
        }

        setLoading(true);
        setResult(null);

        // 1. Separar as linhas
        const rows = pastedData.split('\n').filter(r => r.trim() !== '');
        
        // 2. Extrair cabeçalhos e remover a primeira linha (se for cabeçalho)
        // Aqui assumimos que as colunas são separadas por TAB (copiado do Excel)
        const leads = [];
        for (let i = 0; i < rows.length; i++) {
            const columns = rows[i].split('\t');
            
            // Pular linha de cabeçalho provável
            if (i === 0 && (columns[0].toLowerCase().includes('nome') || columns[0].toLowerCase().includes('name'))) {
                continue;
            }

            let nome = '';
            let email = '';
            let telefone = '';
            let observacoesArr: string[] = [];

            for (let j = 0; j < columns.length; j++) {
                const val = columns[j].trim();
                if (!val) continue;

                const isEmail = val.includes('@') && val.includes('.');
                const isPhone = /^[\d\s\-\+\(\)]+$/.test(val) && val.replace(/\D/g, '').length >= 8;

                if (isEmail && !email) {
                    email = val;
                } else if (isPhone && !telefone) {
                    telefone = val;
                } else if (!nome && !isEmail && !isPhone) {
                    nome = val;
                } else {
                    observacoesArr.push(val);
                }
            }

            if (!nome && email) nome = email.split('@')[0];
            if (!nome && telefone) nome = 'Contato Importado';

            if (!nome && !email && !telefone) continue;

            const observacoes = observacoesArr.length > 0 ? observacoesArr.join(' | ') : '';

            leads.push({
                nome: nome.trim(),
                email: email.trim(),
                telefone: telefone.trim(),
                observacoes: `[DADOS IMPORTADOS DA PESQUISA ANTIGA]\n${observacoes}`.trim(),
                categoria: 'Pesquisa Antiga',
                origem: 'Importação Manual',
                status: 'Novo'
            });
        }

        try {
            const res = await bulkImportLeadsAction(leads);
            setResult(res);
            if (res.failed === 0) {
                alert('Importação concluída com sucesso!');
                router.push('/admin/crm?tab=pesquisa');
            }
        } catch (err: any) {
            alert('Erro ao importar: ' + err.message);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/crm?tab=pesquisa" className="text-primary-600 hover:text-primary-900 font-bold mb-4 inline-block">
                        ← Voltar para o CRM
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-50">Importar Pesquisa Antiga</h1>
                    <p className="text-slate-400 mt-2">Copie e cole os dados diretamente da sua planilha Excel ou Google Sheets.</p>
                </div>
            </div>

            <div className="bg-[#0f172a] p-8 rounded-2xl shadow-sm border border-slate-800">
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2">Instruções de Uso:</h3>
                        <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                            <li>Abra sua planilha (Excel ou Sheets).</li>
                            <li>Organize as colunas nesta ordem: <strong>Nome | E-mail | Telefone | Outras Informações</strong></li>
                            <li>Selecione todas as linhas com os dados dos 170 respondentes.</li>
                            <li>Copie (Ctrl+C) e cole (Ctrl+V) na caixa de texto abaixo.</li>
                        </ol>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">Cole os dados da planilha aqui:</label>
                        <textarea 
                            value={pastedData}
                            onChange={(e) => setPastedData(e.target.value)}
                            className="w-full h-64 p-4 border border-gray-300 rounded-xl font-mono text-xs whitespace-pre bg-[#020617] focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="Nome Completo    email@exemplo.com    (11) 99999-9999    Moradia Atual: Casa, Idade: 50..."
                        ></textarea>
                    </div>

                    {result && (
                        <div className={`p-4 rounded-xl font-bold ${result.failed > 0 ? 'bg-orange-50 text-orange-800 border border-orange-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
                            Resultado: {result.success} salvos com sucesso. {result.failed} falhas.
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t border-slate-800">
                        <button 
                            onClick={handleImport} 
                            disabled={loading}
                            className="bg-primary-900 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-800 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>Carregando...</>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    Iniciar Importação
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
