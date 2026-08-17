import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Slack URL Verification Challenge
        if (body.type === 'url_verification') {
            return NextResponse.json({ challenge: body.challenge });
        }

        // 2. Handle app_mention event
        if (body.event && body.event.type === 'app_mention') {
            const userMessage = body.event.text.replace(/<@[A-Z0-9]+>/g, '').trim(); // Remove bot mention
            const channelId = body.event.channel;
            const ts = body.event.ts; // thread timestamp

            // Fire and forget processing so Slack doesn't timeout
            processSlackMention(userMessage, channelId, ts).catch(console.error);

            return NextResponse.json({ ok: true });
        }

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        console.error('Slack Event Error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

async function processSlackMention(message: string, channelId: string, threadTs: string) {
    if (!process.env.GEMINI_API_KEY || !process.env.SLACK_BOT_TOKEN) {
        console.error('Missing API keys for Slack processing');
        return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 1. Get embedding for user question
    const embeddingResponse = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: message,
    });
    const queryEmbedding = embeddingResponse.embeddings?.[0]?.values;

    if (!queryEmbedding) throw new Error('Failed to generate embedding');

    // 2. Search relevant context in Cérebro (transcriptions)
    const { data: contexts, error } = await supabase.rpc('match_transcriptions', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 5
    });

    if (error) console.error('Supabase RPC Error:', error);

    let contextText = '';
    if (contexts && contexts.length > 0) {
        contextText = contexts.map((c: any) => `[Reunião: ${c.meeting_title}] ${c.content}`).join('\n\n');
    } else {
        contextText = 'Nenhum contexto encontrado nas transcrições.';
    }

    // 3. Generate Answer using Gemini
    const systemPrompt = `Você é o Agente I.A. da Comunidade Cohousing.
Você tem acesso ao seguinte Cérebro (transcrições de reuniões):
${contextText}

Responda à pergunta do usuário baseando-se no contexto acima. Se não souber ou a informação não estiver no contexto, seja sincero e amigável. Use formatação do Slack (*negrito*, _itálico_).`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [
            { role: 'user', parts: [{ text: systemPrompt + '\n\nPergunta: ' + message }] }
        ]
    });

    const answer = response.text || 'Desculpe, tive um problema ao processar a resposta.';

    // 4. Send back to Slack
    await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
        },
        body: JSON.stringify({
            channel: channelId,
            text: answer,
            thread_ts: threadTs
        })
    });
}
