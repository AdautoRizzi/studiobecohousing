import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    const { data, error } = await supabase.from('course_materials').select('*').order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ materials: data });
}

export async function POST(request: Request) {
    const { title, file_url } = await request.json();
    const { data, error } = await supabase.from('course_materials').insert([{ title, file_url }]).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ material: data[0] });
}
