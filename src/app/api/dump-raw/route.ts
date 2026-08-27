import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
export const dynamic = 'force-dynamic';
export async function GET() {
  const r1 = await supabase.from('app_state').select('*');
  const r2 = await supabase.from('leads').select('*').eq('email', 'sys_12week_plan@studiobe.com');
  return NextResponse.json({ app_state: r1.data, app_state_err: r1.error, leads: r2.data, leads_err: r2.error });
}
