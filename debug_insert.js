const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://bofadzmsbciwxsyiidfk.supabase.co';
const supabaseAnonKey = 'sb_publishable_E88MUL1_aXZ0RqSwxfDpdQ_VMCkQFHe';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SYS_12WEEK_PLAN_EMAIL = 'sys_12week_plan@studiobe.com';

async function run() {
    const initialPlan = { vision3Years: 'Construir o Ecossistema Líder em Cohousing no Brasil' };
    
    const { data: d1, error: e1 } = await supabase.from('leads').insert([{
        id: 'sys_' + Date.now() + '_' + Math.random().toString(36).substring(2),
        nome: 'SYSTEM 12WEEK PLAN',
        email: SYS_12WEEK_PLAN_EMAIL,
        telefone: '00000000000',
        idade: '0',
        cidade: 'System',
        profissao: 'System',
        comoNosConheceu: 'System',
        status: 'Descartado',
        notasCrm: JSON.stringify(initialPlan)
    }]).select('id, notasCrm').single();
    
    console.log('Insert:', d1, 'Error:', e1);
}
run();
