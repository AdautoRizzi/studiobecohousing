const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
const {data, error} = await supabase.from('users').insert([{email: 'pct@cmaisi.com', name: 'Paulo Cesar Togniazzolo', phone: '11996180250', status: 'Aprovado'}]);
console.log(data, error);
}
run();