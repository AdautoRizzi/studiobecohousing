'use client';

import React, { useState } from 'react';
import EditLeadModal from './EditLeadModal';

interface EditLeadButtonProps {
    lead: any;
}

export default function EditLeadButton({ lead }: EditLeadButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="bg-[#0f172a] border border-slate-800 text-gray-700 px-3 py-1 rounded-lg text-sm font-bold hover:bg-[#020617] flex items-center gap-1.5 transition-colors"
                title="Editar Lead"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editar
            </button>

            {isOpen && (
                <EditLeadModal 
                    lead={lead} 
                    onClose={() => setIsOpen(false)} 
                />
            )}
        </>
    );
}
