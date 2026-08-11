import { NextResponse } from 'next/server';
import { getTwelveWeeksPlan, saveTwelveWeeksPlan } from '@/lib/db';

export async function GET() {
    try {
        const plan = await getTwelveWeeksPlan();

        // 8 Marcos extracted from the PDF
        const marcos = [
            {
                title: "MARCO 0 — Fundação estratégica",
                items: [
                    "Posicionamento definido e testável.",
                    "Promessa central validada.",
                    "Público prioritário definido.",
                    "Jornada do cliente desenhada.",
                    "Modelo inicial de monetização definido.",
                    "Plataforma funcionando em nível mínimo.",
                    "Questionário de diagnóstico/match funcionando.",
                    "CRM e acompanhamento de leads estruturados.",
                    "Métricas de aquisição definidas."
                ]
            },
            {
                title: "MARCO 1 — Descoberta do Product-Market Fit inicial",
                items: [
                    "500 leads qualificados.",
                    "pelo menos 100 pessoas demonstrando intenção real.",
                    "pelo menos 30–50 pessoas dispostas a entrar em um grupo-piloto."
                ]
            },
            {
                title: "MARCO 2 — Primeira comunidade em formação",
                items: [
                    "Match inicial.",
                    "Encontros.",
                    "Apresentação dos participantes.",
                    "Identificação de valores.",
                    "Expectativas.",
                    "Visão de futuro.",
                    "Regras de convivência.",
                    "Primeiros exercícios de governança.",
                    "Definição do projeto de vida coletivo."
                ]
            },
            {
                title: "MARCO 3 — Primeira receita recorrente",
                items: [
                    "Plataforma.",
                    "Matchmaking.",
                    "Encontros.",
                    "Facilitação.",
                    "Conteúdo.",
                    "Palestras.",
                    "Acompanhamento.",
                    "Formação comunitária.",
                    "Primeiros 10–20 assinantes pagantes (3 meses consecutivos)."
                ]
            },
            {
                title: "MARCO 4 — Primeira comunidade validada",
                items: [
                    "Grupo permanece ativo.",
                    "Participantes continuam pagando.",
                    "Encontros acontecem.",
                    "Decisões são tomadas coletivamente.",
                    "Conflitos são tratados.",
                    "Visão comum é construída.",
                    "Comunidade começa a procurar terreno/projeto."
                ]
            },
            {
                title: "MARCO 5 — Primeira comunidade implantada",
                items: [
                    "Formação.",
                    "Erros.",
                    "Conflitos.",
                    "Governança.",
                    "Terreno.",
                    "Projeto.",
                    "Custos.",
                    "Construção.",
                    "Sustentabilidade.",
                    "Primeiros meses de convivência documentados."
                ]
            },
            {
                title: "MARCO 6 — Máquina de crescimento repetível",
                items: [
                    "Conteúdo.",
                    "Podcast.",
                    "Eventos.",
                    "Google.",
                    "SEO.",
                    "Indicações.",
                    "Palestras.",
                    "Parceiros.",
                    "Comunidade digital.",
                    "Automações.",
                    "3 canais de aquisição comprovadamente eficientes."
                ]
            },
            {
                title: "MARCO 7 — Studio Be como referência nacional",
                items: [
                    "5+ comunidades em formação.",
                    "1+ comunidade habitada.",
                    "Centenas de participantes.",
                    "Receita recorrente.",
                    "Plataforma consolidada.",
                    "Metodologia reconhecida.",
                    "Parceiros estratégicos.",
                    "Mídia espontânea.",
                    "Eventos recorrentes.",
                    "Produção de conhecimento.",
                    "Autoridade nacional."
                ]
            }
        ];

        // Ensure inbox exists
        if (!plan.inbox) plan.inbox = [];

        // Insert into inbox
        marcos.forEach((marco, i) => {
            plan.inbox.push({
                id: 'pdf_marco_' + Date.now() + '_' + i,
                description: marco.title,
                status: 'todo',
                isMilestone: true,
                checklist: marco.items.map((text, j) => ({
                    id: 'chk_' + Date.now() + '_' + i + '_' + j,
                    text: text,
                    completed: false
                }))
            });
        });

        await saveTwelveWeeksPlan(plan);

        return NextResponse.json({ success: true, message: "8 Marcos importados para a Caixa de Entrada." });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
