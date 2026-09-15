import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    const { data, error } = await supabase.from('lessons').select('*').order('order_index');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ lessons: data });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { module_id, title, video_url, order_index } = body;
        
        const { data, error } = await supabase
            .from('lessons')
            .insert([{ module_id, title, video_url, order_index }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ lesson: data });
    } catch(e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
