import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        
        const { data, error } = await supabase
            .from('modules')
            .update({ title: body.title, description: body.description })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ module: data });
    } catch(e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const { error } = await supabase.from('modules').delete().eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch(e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
