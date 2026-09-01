'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export const Tiers = [
    { level: 0, name: 'Descoberta', offerTitle: 'Próximo Passo: Match de Afinidade', offerDesc: 'Descubra como você gostaria de viver no futuro. Responda ao questionário de afinidade e veja se o cohousing é para você.', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', cta: 'Fazer o Match Grátis', ctaLink: '/dashboard/questionario/descobridor' },
    { level: 1, name: 'Match', offerTitle: 'Próximo Passo: Comunidade', offerDesc: 'Seu perfil deu match! Dê o próximo passo e garanta seu lugar reservando sua vaga na comunidade.', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', cta: 'Preencher Alinhamento Profundo', ctaLink: '/dashboard/questionario/profundo' },
    { level: 2, name: 'Comunidade', offerTitle: 'Próximo Passo: Formação', offerDesc: 'Bem-vindo à comunidade. Agora precisamos nos alinhar. Inicie nosso programa de formação.', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', cta: 'Iniciar Programa Pago' },
    { level: 3, name: 'Formação', offerTitle: 'Próximo Passo: Projeto', offerDesc: 'Com a visão alinhada, é hora de materializar. Avance para a consultoria do projeto arquitetônico e jurídico.', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', cta: 'Contratar Projeto' },
    { level: 4, name: 'Projeto', offerTitle: 'Próximo Passo: Construção', offerDesc: 'O projeto está pronto! Vamos tirar do papel. Inicie a gestão e coordenação da obra.', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', cta: 'Iniciar Construção' },
    { level: 5, name: 'Construção', offerTitle: 'Próximo Passo: Moradia', offerDesc: 'A obra está quase lá! Prepare sua mudança e ative a plataforma SaaS para o dia a dia.', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', cta: 'Ativar Plataforma de Moradia' },
    { level: 6, name: 'Moradia', offerTitle: 'Próximo Passo: Comunidade Madura', offerDesc: 'Você já está morando! Facilite a vida da comunidade ativando nossos serviços de administração terceirizada.', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', cta: 'Conhecer Administração' },
    { level: 7, name: 'Comunidade Madura', offerTitle: 'Próximo Passo: Longevidade', offerDesc: 'Sua comunidade está rodando perfeitamente. Conheça nossos parceiros e serviços premium focados em longevidade.', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', cta: 'Explorar Serviços Premium' },
    { level: 8, name: 'Longevidade', offerTitle: 'Jornada Completa', offerDesc: 'Você atingiu o nível máximo de suporte da Studio Be. Aproveite sua comunidade!', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', ctaLink: '#', cta: '' }
];

interface TierContextProps {
    tier: number;
    setTier: (val: number) => void;
}

const TierContext = createContext<TierContextProps>({ tier: 0, setTier: () => {} });

export function ClientTierProvider({ children }: { children: React.ReactNode }) {
    const [tier, setTier] = useState<number>(0);
    
    useEffect(() => {
        const saved = localStorage.getItem('studiobe_client_tier');
        if (saved !== null) {
            setTier(parseInt(saved, 10));
        }
    }, []);

    const updateTier = (val: number) => {
        setTier(val);
        localStorage.setItem('studiobe_client_tier', val.toString());
    };

    return (
        <TierContext.Provider value={{ tier, setTier: updateTier }}>
            {children}
        </TierContext.Provider>
    );
}

export const useClientTier = () => useContext(TierContext);
