import { NextResponse } from 'next/server';
import { getGlobalTasks, saveGlobalTasks, GlobalTask } from '@/lib/db';

export async function GET() {
    try {
        const tasks = await getGlobalTasks();
        return NextResponse.json(tasks);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { action, task, taskId, columnId } = await request.json();
        const tasks = await getGlobalTasks();
        
        if (action === 'add') {
            tasks.push(task);
        } else if (action === 'move') {
            const t = tasks.find(x => x.id === taskId);
            if (t) t.column_id = columnId;
        } else if (action === 'delete') {
            const idx = tasks.findIndex(x => x.id === taskId);
            if (idx >= 0) tasks.splice(idx, 1);
        }

        await saveGlobalTasks(tasks);
        return NextResponse.json({ success: true, tasks });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
