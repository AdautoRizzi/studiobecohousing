const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bofadzmsbciwxsyiidfk.supabase.co';
const supabaseAnonKey = 'sb_publishable_E88MUL1_aXZ0RqSwxfDpdQ_VMCkQFHe';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('--- TESTE DE CONEXAO SUPABASE ---');
    
    // 1. Testar Select
    const { data, error } = await supabase.from('leads').select('*').limit(1);
    
    if (error) {
        console.error('❌ Erro no Select:', error.message);
        if (error.message.includes('policy')) {
            console.error('👉 MOTIVO: RLS (Row Level Security) está bloqueando o acesso.');
        }
    } else {
        console.log('✅ Select funcionando! Encontrados:', data.length, 'leads.');
    }

    // 2. Testar Inserção simples
    console.log('\nTestando inserção de lead teste...');
    const { error: insertError } = await supabase.from('leads').insert([{
        id: 'test-' + Date.now(),
        nome: 'Teste Sistema',
        email: 'teste@exemplo.com',
        telefone: '11999999999',
        status: 'Novo'
    }]);

    if (insertError) {
        console.error('❌ Erro no Insert:', insertError.message);
    } else {
        console.log('✅ Inserção de teste funcionou!');
    }
}

testConnection();
