import { createClient } from '@supabase/supabase-js';

// Hardcoded keys to avoid Vercel environment variable issues during initial setup
const supabaseUrl = 'https://bofadzmsbciwxsyiidfk.supabase.co';
const supabaseAnonKey = 'sb_publishable_E88MUL1_aXZ0RqSwxfDpdQ_VMCkQFHe';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
