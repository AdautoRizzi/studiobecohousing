import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { subject, html, targetStatus } = await request.json();

        if (!subject || !html) {
            return NextResponse.json({ error: 'Subject and HTML content are required' }, { status: 400 });
        }

        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY is not set.");
            return NextResponse.json({ error: 'RESEND_API_KEY missing' }, { status: 500 });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        // Fetch leads matching the target status (if provided, else all leads except system lead)
        let query = supabase.from('leads').select('email, nome').neq('email', 'sys_12week_plan@studiobe.com');
        if (targetStatus && targetStatus !== 'Todos') {
            query = query.eq('status', targetStatus);
        }
        
        const { data: leads, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        if (!leads || leads.length === 0) {
            return NextResponse.json({ success: false, message: 'Nenhum lead encontrado para este filtro.' });
        }

        const BATCH_SIZE = 100;
        let sentCount = 0;

        for (let i = 0; i < leads.length; i += BATCH_SIZE) {
            const batch = leads.slice(i, i + BATCH_SIZE);
            const emails = batch.map(l => l.email).filter(e => e && e.includes('@')); // basic validation

            if (emails.length === 0) continue;

            const { error: sendError } = await resend.emails.send({
                from: `Studio Be <${process.env.EMAIL_USER || 'contato@studiobecohousing.com'}>`, // Example sender
                to: [], 
                bcc: emails, // Use BCC for mass campaigns to hide recipients
                subject: subject,
                html: html
            });

            if (sendError) {
                console.error('Resend Error:', sendError);
            } else {
                sentCount += emails.length;
            }
        }

        return NextResponse.json({ success: true, sentCount });
    } catch (error: any) {
        console.error('Campaign Send Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
