"use client";

import React from 'react';

export default function WhatsAppWidget() {
    return (
        <a
            href="https://wa.me/5511934898990"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 w-16 h-16 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
            aria-label="Falar conosco no WhatsApp"
        >
            <img src="/whatsapp.png.jpeg" alt="WhatsApp" className="w-16 h-16 drop-shadow-2xl rounded-full" />
            <span className="hidden md:flex ml-3 font-semibold text-lg overflow-hidden whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[200px] transition-all duration-300">
                Fale Conosco
            </span>
        </a>
    )
}
