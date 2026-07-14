import { NextResponse } from 'next/server';
import { getMethodSteps, saveMethodSteps, MethodStep } from '@/lib/db';

export async function GET() {
    try {
        const steps = await getMethodSteps();
        return NextResponse.json(steps);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { action, step } = await request.json();
        const steps = await getMethodSteps();
        
        if (action === 'add') {
            steps.push(step);
        } else if (action === 'delete') {
            const idx = steps.findIndex(x => x.id === step.id);
            if (idx >= 0) steps.splice(idx, 1);
        }

        await saveMethodSteps(steps);
        return NextResponse.json({ success: true, steps });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
