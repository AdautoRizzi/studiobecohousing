import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        
        const { data, error } = await supabase
            .from('lessons')
            .update({ title: body.title, video_url: body.video_url })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ lesson: data });
    } catch(e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const { error } = await supabase.from('lessons').delete().eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch(e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
