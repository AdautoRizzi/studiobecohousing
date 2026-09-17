import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    const { data, error } = await supabase.from('modules').select('*').order('order_index');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ modules: data });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { level_id, title, description, order_index } = body;
        
        const { data, error } = await supabase
            .from('modules')
            .insert([{ level_id, title, description, order_index }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ module: data });
    } catch(e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
