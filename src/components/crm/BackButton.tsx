'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export function BackButton({ fallbackUrl }: { fallbackUrl?: string }) {
    const router = useRouter();
    
    return (
        <button 
            onClick={() => {
                if (fallbackUrl) {
                    router.push(fallbackUrl);
                } else {
                    router.back();
                }
            }} 
            className="w-10 h-10 bg-[#0f172a] border border-slate-800 rounded-full flex items-center justify-center hover:bg-[#020617] transition-colors"
            title="Voltar"
        >
            <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
    );
}
