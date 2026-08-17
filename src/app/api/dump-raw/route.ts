import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const { data, error } = await supabase.from('leads').select('notasCrm').eq('email', 'sys_12week_plan@studiobe.com').single();
    if (error) return NextResponse.json({ error: error.message });
    return NextResponse.json({ notasCrm: data.notasCrm });
}
