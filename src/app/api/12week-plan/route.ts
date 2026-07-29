import { NextResponse } from 'next/server';
import { getTwelveWeeksPlan, saveTwelveWeeksPlan } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const plan = await getTwelveWeeksPlan();
        return NextResponse.json(plan);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const plan = await request.json();
        await saveTwelveWeeksPlan(plan);
        return NextResponse.json({ success: true, plan });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
