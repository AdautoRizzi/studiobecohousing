'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');

    useEffect(() => {
        const debounce = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (query.trim()) {
                params.set('q', query.trim());
            } else {
                params.delete('q');
            }
            router.push(`/admin/crm?${params.toString()}`, { scroll: false });
        }, 400);

        return () => clearTimeout(debounce);
    }, [query, router, searchParams]);

    return (
        <div className="relative w-full max-w-sm mb-6">
            <input 
                type="text" 
                placeholder="Buscar contato (nome, email, tel)..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-[#0f172a] border border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
            />
            <svg className="w-5 h-5 text-slate-500 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
    );
}
