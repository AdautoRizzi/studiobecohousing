
'use client';

import React, { useState } from 'react';
import { deleteLeadAction } from '@/app/actions';

interface Props {
    leadId: string;
    leadName: string;
}

export default function DeleteLeadButton({ leadId, leadName }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm(`Tem certeza que deseja excluir permanentemente o lead "${leadName}"? Esta ação não pode ser desfeita.`)) {
            setIsDeleting(true);
            const res = await deleteLeadAction(leadId);
            if (res.success) {
                // A página será revalidada automaticamente pela Server Action
            } else {
                alert('Erro ao excluir: ' + res.error);
                setIsDeleting(false);
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors border border-red-100 ${isDeleting ? 'opacity-50' : ''}`}
            title="Excluir Lead"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    );
}
