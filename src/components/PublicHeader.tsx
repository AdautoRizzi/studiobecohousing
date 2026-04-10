'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { name: 'Início', path: '/' },
    { name: 'O que é cohousing', path: '/conceito' },
    { name: 'A solução Studio Be', path: '/#solucao' },
    { name: 'Modelos', path: '/modelos' },
    { name: 'Mídias', path: '/midias' },
    { name: 'Quem somos', path: '/quem-somos' },
    { name: 'Menu do Morador', path: '/login' }
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="bg-white border-b border-primary-100 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-2 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
                    <img src="/logo.png" alt="Studio Be" className="h-28 md:h-40 w-auto object-contain scale-125 origin-left" />
                </Link>

                {/* Navegação Desktop */}
                <nav className="hidden md:flex items-center ml-auto">
                    <div className="flex items-center space-x-6 lg:space-x-12 mr-8">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`text-sm font-semibold transition duration-300 relative py-1 tracking-wide ${isActive ? 'text-secondary-600' : 'text-primary-900 hover:text-secondary-500'
                                        }`}
                                >
                                    {item.name}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary-600 rounded-full"></span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                    <Link
                        href="/#cadastro"
                        className="bg-secondary-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-secondary-700 transition duration-300 shadow-md hover:shadow-lg whitespace-nowrap uppercase tracking-tighter"
                    >
                        Cadastrar Interesse
                    </Link>
                </nav>

                {/* Menu Mobile Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-primary-900 focus:outline-none p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Menu Mobile Expandido */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-primary-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <nav className="flex flex-col px-6 pt-2 pb-6 space-y-3">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`w-full text-center py-3 rounded-xl transition duration-300 font-medium ${isActive ? 'bg-secondary-50 text-secondary-600' : 'text-primary-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                        <Link
                            href="/#cadastro"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full text-center bg-secondary-600 text-white flex justify-center py-3 rounded-xl font-bold mt-2 shadow-lg"
                        >
                            Cadastrar Interesse
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
