import { NextResponse } from 'next/server';
import { updateUserRole } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token');
        if (!adminToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { email, role } = body;

        if (!email || !role) {
            return NextResponse.json({ error: 'Missing email or role' }, { status: 400 });
        }

        const success = await updateUserRole(email, role);
        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error updating role:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
