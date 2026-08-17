import { getTwelveWeeksPlan } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const plan = await getTwelveWeeksPlan();
        return NextResponse.json(plan);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
