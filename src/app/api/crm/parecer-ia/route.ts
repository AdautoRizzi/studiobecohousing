import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'dummy',
});

export async function POST(request: Request) {
    try {
        const { territory } = await request.json();

        if (!territory) {
            return NextResponse.json({ error: 'Dados do território não fornecidos' }, { status: 400 });
        }

        const totalScore = (
            ((territory.score_natureza || 0) * 15 / 10) +
            ((territory.score_aderencia || 0) * 15 / 10) +
            ((territory.score_legal || 0) * 15 / 10) +
            ((territory.score_valorizacao || 0) * 15 / 10) +
            ((territory.score_agua || 0) * 10 / 10) +
            ((territory.score_acesso || 0) * 10 / 10) +
            ((territory.score_custo || 0) * 5 / 10) +
            ((territory.score_infra || 0) * 5 / 10) +
            ((territory.score_regenerativo || 0) * 5 / 10) +
            ((territory.score_comunitario || 0) * 5 / 10) +
            (territory.score_pirai || 0)
        ).toFixed(1);

        const assimetria = ((territory.score_2035 || 0) - parseFloat(totalScore)).toFixed(1);

        const systemPrompt = `Você é o 'Cérebro' da Studio Be Cohousing, atuando como o Diretor Mestre de Inteligência Territorial e Análise de Investimentos.
Seu objetivo é gerar um "Parecer Executivo" profissional, analítico e persuasivo sobre uma propriedade rural (Banco de Terras) que a equipe acabou de avaliar.

ESTRUTURA OBRIGATÓRIA DO PARECER (em Markdown):
1. **Tese de Investimento**: Um parágrafo incisivo resumindo se vale a pena avançar com essa terra e qual o perfil de oportunidade (ex: Landbanking de longo prazo, Implantação Imediata de Cohousing, etc).
2. **Fortalezas Naturais e Técnicas**: Destacar os pontos mais altos das notas recebidas e a infraestrutura existente.
3. **Riscos e Gargalos (Mitigáveis ou Fatais)**: Analisar as notas baixas (especialmente viabilidade legal ou acesso) e alertar sobre as 'red flags'.
4. **Análise de Assimetria e Potencial 2035**: Explicar o que o salto da nota atual para a nota de 2035 representa financeiramente e estrategicamente.
5. **Veredito**: [Avançar para Negociação / Manter no Radar / Descartar] com 1 frase de conclusão.

MANTENHA O TOM: Executivo, sofisticado, técnico (focado em Real Estate, ecologia e cohousing), mas de leitura fluida. Use bullet points para facilitar a leitura rápida de investidores.
NÃO INVENTE INFORMAÇÕES QUE NÃO ESTEJAM NO JSON FORNECIDO, MAS DEDUZAS AS IMPLICAÇÕES LÓGICAS DAS NOTAS (ex: se Água = 10, deduza que a segurança hídrica é um ativo raro e valioso).`;

        const userMessage = `Por favor, analise os seguintes dados do território e gere o Parecer Executivo:
Nome do Lead/Propriedade: ${territory.first_name} ${territory.last_name || ''}
Estágio de Maturidade: ${territory.stage || 'Não definido'}
Eliminatórias (Red Flags): ${territory.eliminatory || 'Nenhuma'}

NOTAS DA MATRIZ:
- Aderência ao Cohousing: ${territory.score_aderencia || 0}/10
- Natureza e Visual: ${territory.score_natureza || 0}/10
- Viabilidade Legal: ${territory.score_legal || 0}/10
- Potencial de Valorização: ${territory.score_valorizacao || 0}/10
- Segurança Hídrica (Água): ${territory.score_agua || 0}/10
- Acesso/Distância: ${territory.score_acesso || 0}/10
- Custo Relativo: ${territory.score_custo || 0}/10
- Infraestrutura Existente: ${territory.score_infra || 0}/10
- Potencial Regenerativo: ${territory.score_regenerativo || 0}/10
- Impacto Comunitário: ${territory.score_comunitario || 0}/10
- Bônus Índice Piraí: +${territory.score_pirai || 0} pontos

PONTUAÇÃO FINAL CALCULADA: ${totalScore} pontos.
POTENCIAL ESTIMADO 2035: ${territory.score_2035 || 0} pontos.
ASSIMETRIA DE OPORTUNIDADE: +${assimetria} pontos.

INFRAESTRUTURA E DADOS EXTRAS MAPEADOS:
- Itens de Infra: ${territory.infra_items || 'N/A'}
- Benfeitorias: ${territory.improvements || 'N/A'}
- Uso Atual: ${territory.current_use || 'N/A'}
- Documentação: ${territory.document_status || 'N/A'}
- Topografia: ${territory.topography || 'N/A'}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
            max_tokens: 1500,
        });

        const report = chatCompletion.choices[0]?.message?.content || 'Não foi possível gerar o parecer no momento.';

        return NextResponse.json({ report });

    } catch (error: any) {
        console.error('Erro na geração de IA:', error);
        return NextResponse.json({ error: error.message || 'Erro interno na IA' }, { status: 500 });
    }
}
