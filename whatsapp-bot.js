const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Configurações Supabase (Nuvem)
const supabaseUrl = 'https://bofadzmsbciwxsyiidfk.supabase.co';
const supabaseAnonKey = 'sb_publishable_E88MUL1_aXZ0RqSwxfDpdQ_VMCkQFHe';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interface para leitura no terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox']
    }
});

console.log('🤖 Inicializando Bot do WhatsApp Studio Be (V2 - Fila & Histórico)...');

client.on('qr', (qr) => {
    console.log('\n📱 Escaneie o QR Code abaixo com o seu WhatsApp:\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Cliente do WhatsApp está pronto!');
    console.log('\n=======================================');
    console.log('   CRM STUDIO BE - CONTROLE DO WHATSAPP');
    console.log('=======================================\n');
    
    // Inicia o loop de monitoramento da fila
    console.log('👀 Monitorando fila de mensagens no Supabase...');
    monitorQueue();
    
    menuInterativo();
});

async function monitorQueue() {
    // Busca mensagens pendentes na fila
    const { data: queue, error } = await supabase
        .from('message_queue')
        .select('*, leads(*)')
        .eq('status', 'pending');

    if (!error && queue && queue.length > 0) {
        console.log(`\n📬 Encontradas ${queue.length} mensagens na fila para processar.`);
        
        for (const item of queue) {
            try {
                const lead = item.leads;
                if (!lead || !lead.telefone) {
                    await updateQueueStatus(item.id, 'failed');
                    continue;
                }

                let numeroLimpo = lead.telefone.replace(/\D/g, '');
                if (numeroLimpo.length === 11 || numeroLimpo.length === 10) {
                    numeroLimpo = '55' + numeroLimpo;
                }
                const chatId = numeroLimpo + '@c.us';

                await client.sendMessage(chatId, item.message);
                console.log(`✅ Mensagem enviada para ${lead.nome} (${numeroLimpo})`);

                // 1. Marca como enviado na fila
                await updateQueueStatus(item.id, 'sent');
                
                // 2. Registra no histórico de interações do lead
                await logInteraction(lead.id, item.message);

                // Delay para evitar bloqueio
                await new Promise(resolve => setTimeout(resolve, 5000));
            } catch (err) {
                console.error(`❌ Erro ao processar mensagem ${item.id}:`, err.message);
                await updateQueueStatus(item.id, 'failed');
            }
        }
    }

    // Roda novamente a cada 10 segundos
    setTimeout(monitorQueue, 10000);
}

async function updateQueueStatus(id, status) {
    await supabase.from('message_queue').update({ status }).eq('id', id);
}

async function logInteraction(leadId, content) {
    await supabase.from('lead_interactions').insert([{ lead_id: leadId, content }]);
}

async function getNovosLeads() {
    const { data, error } = await supabase.from('leads').select('*').eq('status', 'Novo');
    return error ? [] : data;
}

async function addWelcomeToQueue(lead) {
    const welcomeMsg = `Olá ${lead.nome}! 🌿 Aqui é da equipe de curadoria do Studio Be.\n\nRecebemos o seu cadastro na nossa plataforma e estamos muito felizes com o seu interesse no nosso Cohousing.\n\nPara avançarmos, gostaríamos de agendar um breve bate-papo. Qual seria o melhor dia e horário para você?`;
    
    const { error } = await supabase.from('message_queue').insert([{ 
        lead_id: lead.id, 
        message: welcomeMsg, 
        status: 'pending' 
    }]);

    if (!error) {
        await supabase.from('leads').update({ status: 'Contatado' }).eq('id', lead.id);
    }
}

async function menuInterativo() {
    console.log('\nOpções:');
    console.log('1. Listar Leads "Novos"');
    console.log('2. Enviar boas-vindas para todos os "Novos" (Adicionar à Fila)');
    console.log('0. Sair');

    rl.question('\nOpção: ', async (answer) => {
        switch(answer) {
            case '1':
                const novos = await getNovosLeads();
                novos.forEach(l => console.log(`- ${l.nome} (${l.telefone})`));
                menuInterativo();
                break;
            case '2':
                const leadsParaEnviar = await getNovosLeads();
                for (const lead of leadsParaEnviar) {
                    await addWelcomeToQueue(lead);
                    console.log(`➕ ${lead.nome} adicionado à fila.`);
                }
                menuInterativo();
                break;
            case '0':
                process.exit(0);
                break;
            default:
                menuInterativo();
                break;
        }
    });
}

client.initialize();
