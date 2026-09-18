'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export const Tiers = [
    { level: 0, name: 'Descoberta', offerTitle: 'Próximo Passo: Entendimento', offerDesc: 'Descubra como você gostaria de viver no futuro.', cta: 'Fazer o Match Grátis', ctaLink: '/dashboard/questionario/descobridor' },
    { level: 1, name: 'Entendimento do conceito e propósitos', offerTitle: 'Próximo Passo: Questionário', offerDesc: 'Aprofunde-se nos conceitos da comunidade.', cta: 'Acessar Materiais', ctaLink: '#' },
    { level: 2, name: 'Preenchimento do segundo questionário', offerTitle: 'Próximo Passo: Match', offerDesc: 'Responda ao questionário profundo para definirmos seu perfil.', cta: 'Preencher Alinhamento Profundo', ctaLink: '/dashboard/questionario/profundo' },
    { level: 3, name: 'Match entrada em uma comunidade', offerTitle: 'Próximo Passo: Consolidação', offerDesc: 'Seu perfil deu match! Garanta seu lugar reservando sua vaga na comunidade.', cta: 'Entrar na Comunidade', ctaLink: '#' },
    { level: 4, name: 'Consolidação do grupo (aculturamento)', offerTitle: 'Próximo Passo: Estudos', offerDesc: 'Bem-vindo(a)! Participe dos treinamentos e encontros presenciais.', cta: 'Acessar Treinamentos', ctaLink: '/dashboard/cursos' },
    { level: 5, name: 'Apresentação de estudos (cohousing)', offerTitle: 'Próximo Passo: Criação', offerDesc: 'Conheça as possibilidades de formatos de cohousing para o grupo.', cta: 'Ver Estudos', ctaLink: '#' },
    { level: 6, name: 'Criação do Projeto', offerTitle: 'Próximo Passo: Formação Societária', offerDesc: 'É hora de desenhar e arquitetar o seu futuro lar.', cta: 'Acompanhar Projeto', ctaLink: '#' },
    { level: 7, name: 'Formação societária', offerTitle: 'Próximo Passo: Construção', offerDesc: 'Formalize a sociedade para dar início às obras com total segurança.', cta: 'Ver Detalhes', ctaLink: '#' },
    { level: 8, name: 'Construção', offerTitle: 'Próximo Passo: Moradia', offerDesc: 'O projeto está ganhando vida. Acompanhe a evolução da construção.', cta: 'Acompanhar Obra', ctaLink: '#' },
    { level: 9, name: 'Moradia', offerTitle: 'Próximo Passo: Comunidade Madura', offerDesc: 'Você já está no seu novo lar. Ative nossos serviços terceirizados.', cta: 'Administração', ctaLink: '#' },
    { level: 10, name: 'Comunidade madura', offerTitle: 'Próximo Passo: Longevidade', offerDesc: 'Sua comunidade funciona em harmonia. Conheça recursos para o futuro.', cta: 'Ver Recursos', ctaLink: '#' },
    { level: 11, name: 'Longevidade', offerTitle: 'Jornada Completa', offerDesc: 'Você atingiu o nível máximo de suporte. Aproveite ao máximo sua comunidade StudioBe!', cta: '', ctaLink: '#' }
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
