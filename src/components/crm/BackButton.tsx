'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export function BackButton() {
    const router = useRouter();
    
    return (
        <button 
            onClick={() => router.back()} 
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Voltar"
        >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
    );
}
