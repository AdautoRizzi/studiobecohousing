import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    const { data, error } = await supabase.from('levels').select('*').order('order_index', { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ levels: data });
}

export async function POST(request: Request) {
    const body = await request.json();
    const { program_id, title, description, order_index } = body;
    const { data, error } = await supabase.from('levels').insert([{ program_id, title, description, order_index }]).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ level: data[0] });
}
