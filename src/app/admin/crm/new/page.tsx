import React from 'react';
import ManualLeadForm from '@/components/crm/ManualLeadForm';

export default function NewLeadPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Novo Cadastro Manual</h1>
                <p className="text-gray-500 mt-1">Preencha os dados do cliente para incluí-lo na gestão do Studio Be.</p>
            </div>

            <ManualLeadForm />
        </div>
    );
}
