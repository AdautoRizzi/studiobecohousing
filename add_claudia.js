const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
const {data, error} = await supabase.from('users').insert([{email: 'claudia.studiobertucci@gmail.com', name: 'Claudia', phone: '', status: 'Aprovado'}]);
console.log(error);
}
run();