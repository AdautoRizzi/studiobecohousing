import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    const { data, error } = await supabase.from('programs').select('*').order('created_at', { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ programs: data });
}

export async function POST(request: Request) {
    const body = await request.json();
    const { title, description } = body;
    const { data, error } = await supabase.from('programs').insert([{ title, description }]).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ program: data[0] });
}
