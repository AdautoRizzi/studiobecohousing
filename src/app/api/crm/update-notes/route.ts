import { NextResponse } from 'next/server';
import { updateLeadNotes } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { id, notasCrm } = await request.json();
        if (!id) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });
        
        await updateLeadNotes(id, notasCrm);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
