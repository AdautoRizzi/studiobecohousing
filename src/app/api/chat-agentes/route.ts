import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'dummy',
});

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 });
        }

        
        // Simulando dados de sessão do usuário (já que o login real ainda não está pronto no MVP)
        // O layout tem a "Maria Silva" fixa.
        let userContext = `
[Contexto do Cliente Atual] Nome: Maria Silva (Usuária Teste), Perfil: Interessada em Moradia Sustentável, Cota 12.`;
 = await supabase
            .from('leads')
            .select('*')
            .limit(1);
            
        let userContext = '';
        if (leads && leads.length > 0) {
            const lead = leads[0];
            userContext = `\n[Contexto do Cliente Atual] Nome: ${lead.nome}, Profissão: ${lead.profissao}, Interesses/Preferências: Moradia ${lead.ondeMorar}, ${lead.tipoCohousing}, com ${lead.comQuem}. Renda: ${lead.rendaMensal}, Patrimônio: ${lead.patrimonioImobiliario}.`;
        }

        const systemPrompt = `Você é o 'Orquestrador da Comunidade' do StudioBe, uma startup de cohousing.
Sua função é conversar amigavelmente com os clientes/membros da comunidade.
Você tem acesso aos dados do perfil deles e deve usar essas informações para ser mais empático e direto.
Responda de forma clara, acolhedora e direta (máximo de 2 parágrafos).
Se houver contexto do cliente abaixo, use a seu favor.
${userContext}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1024,
        });

        const reply = chatCompletion.choices[0]?.message?.content || 'Sem resposta do agente.';

        return NextResponse.json({ 
            reply, 
            agent: 'Community Manager (Orquestrador)' 
        });

    } catch (e: any) {
        console.error('Groq Error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
