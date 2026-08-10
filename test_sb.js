const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://bofadzmsbciwxsyiidfk.supabase.co';
const supabaseAnonKey = 'sb_publishable_E88MUL1_aXZ0RqSwxfDpdQ_VMCkQFHe';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
async function run() { 
    const {data, error} = await supabase.from('users').select('id, notasCrm').eq('email', 'sys_12week_plan@studiobe.com'); 
    console.log('Current Data:', data ? data[0]?.notasCrm?.substring(0, 50) : data, 'Error:', error); 
} 
run();
