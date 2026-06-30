const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
const {data, error} = await supabase.from('users').select('*').eq('email', 'ajrizzi@gmail.com');
console.log(data, error);
}
run();