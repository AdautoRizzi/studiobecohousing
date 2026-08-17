import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

function chunkText(text: string, maxTokens = 800): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        if (currentChunk.length + sentence.length < maxTokens) {
            currentChunk += sentence + ' ';
        } else {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = sentence + ' ';
        }
    }
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
}

export async function POST(request: Request) {
    try {
        const { title, content } = await request.json();

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is not set.");
            return NextResponse.json({ error: 'GEMINI_API_KEY missing' }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const chunks = chunkText(content);
        const insertedRows = [];

        for (const chunk of chunks) {
            if (!chunk.trim()) continue;

            try {
                const embeddingResponse = await ai.models.embedContent({
                    model: 'text-embedding-004',
                    contents: chunk,
                });
                
                const embedding = embeddingResponse.embeddings?.[0]?.values;

                if (embedding) {
                    const { data, error } = await supabase
                        .from('transcriptions')
                        .insert([{
                            meeting_title: title,
                            content: chunk,
                            embedding: embedding
                        }]);

                    if (error) {
                        console.error('Supabase insert error:', error);
                    } else {
                        insertedRows.push(chunk);
                    }
                }
            } catch (embedError) {
                console.error('Embedding error for chunk:', embedError);
            }
        }

        return NextResponse.json({ success: true, chunksProcessed: insertedRows.length });
    } catch (error: any) {
        console.error('Cerebro Train Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
