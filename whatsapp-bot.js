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
    authStrategy: new LocalAuth() // Salva a sessão localmente
});

console.log('🤖 Inicializando Bot do WhatsApp Studio Be (Supabase Cloud)...');

client.on('qr', (qr) => {
    console.log('\n📱 Escaneie o QR Code abaixo com o seu WhatsApp:\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Cliente do WhatsApp está pronto e conectado!');
    console.log('\n=======================================');
    console.log('   CRM STUDIO BE - CONTROLE DO WHATSAPP');
    console.log('=======================================\n');
    menuInterativo();
});

async function getNovosLeads() {
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('status', 'Novo');
    
    if (error) {
        console.error('Erro ao buscar leads no Supabase:', error.message);
        return [];
    }
    return data;
}

async function markAsContatado(leadId) {
    const { error } = await supabase
        .from('leads')
        .update({ 
            status: 'Contatado',
            notasCrm: `\n[Bot WhatsApp] Mensagem de boas-vindas enviada em ${new Date().toLocaleString('pt-BR')}`
        })
        .eq('id', leadId);
    
    if (error) {
        console.error(`Erro ao atualizar status do lead ${leadId}:`, error.message);
    }
}

async function sendWelcomeMessage(lead) {
    if (!lead.telefone) {
        console.log(`❌ O lead ${lead.nome} não possui telefone cadastrado.`);
        return;
    }

    // Limpar o telefone para apenas números
    let numeroLimpo = lead.telefone.replace(/\D/g, '');
    
    // Validar formato Brasil (se faltar 55, adiciona)
    if (numeroLimpo.length === 11 || numeroLimpo.length === 10) {
        numeroLimpo = '55' + numeroLimpo;
    }

    const chatId = numeroLimpo + '@c.us';
    
    const message = `Olá ${lead.nome}! 🌿 Aqui é da equipe de curadoria do Studio Be.\n\nRecebemos o seu cadastro na nossa plataforma e estamos muito felizes com o seu interesse no nosso Cohousing.\n\nPara avançarmos, gostaríamos de agendar um breve bate-papo. Qual seria o melhor dia e horário para você?`;

    console.log(`\nEnviando mensagem para ${lead.nome} (${numeroLimpo})...`);
    
    try {
        await client.sendMessage(chatId, message);
        console.log(`✅ Mensagem enviada com sucesso para ${lead.nome}!`);
        await markAsContatado(lead.id);
    } catch (err) {
        console.error('❌ Erro ao enviar mensagem:', err);
    }
}

async function menuInterativo() {
    console.log('\nEscolha uma opção:');
    console.log('1. Listar Leads "Novos" (Ainda não contatados)');
    console.log('2. Enviar mensagem de boas-vindas para todos os "Novos"');
    console.log('0. Sair');

    rl.question('\nOpção: ', async (answer) => {
        switch(answer) {
            case '1':
                console.log('\n--- LEADS NOVOS NO SUPABASE ---');
                const novos = await getNovosLeads();
                if (novos.length === 0) console.log('Nenhum lead novo no momento.');
                novos.forEach(l => console.log(`- ${l.nome} | Tel: ${l.telefone || 'Sem tel'}`));
                menuInterativo();
                break;
            case '2':
                const leadsParaEnviar = await getNovosLeads();
                if (leadsParaEnviar.length === 0) {
                    console.log('\nNenhum lead novo para enviar mensagem.');
                    menuInterativo();
                } else {
                    console.log(`\nIniciando disparos para ${leadsParaEnviar.length} leads...`);
                    for (const lead of leadsParaEnviar) {
                        await sendWelcomeMessage(lead);
                        // Delay de 5 segundos entre mensagens para evitar spam
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }
                    console.log('\n--- Todos os disparos concluídos! ---');
                    menuInterativo();
                }
                break;
            case '0':
                console.log('Encerrando bot...');
                client.destroy();
                process.exit(0);
                break;
            default:
                console.log('Opção inválida.');
                menuInterativo();
                break;
        }
    });
}

client.initialize();
