const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const dbPath = path.join(__dirname, 'database.json');

// Interface para leitura no terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new Client({
    authStrategy: new LocalAuth() // Salva a sessão localmente
});

console.log('🤖 Inicializando Bot do WhatsApp Studio Be...');

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

function getDatabase() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error('Erro ao ler database.json:', e.message);
        return { leads: [] };
    }
}

function updateLeadStatus(leadId, newStatus) {
    try {
        const db = getDatabase();
        const index = db.leads.findIndex(l => l.id === leadId);
        if (index !== -1) {
            db.leads[index].status = newStatus;
            db.leads[index].notasCrm = (db.leads[index].notasCrm || '') + `\n[Auto] Mensagem WhatsApp enviada em ${new Date().toLocaleString('pt-BR')}`;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

function sendWelcomeMessage(lead) {
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
    
    client.sendMessage(chatId, message).then(response => {
        console.log(`✅ Mensagem enviada com sucesso para ${lead.nome}!`);
        updateLeadStatus(lead.id, 'Contatado');
        menuInterativo();
    }).catch(err => {
        console.error('❌ Erro ao enviar mensagem:', err);
        menuInterativo();
    });
}

function menuInterativo() {
    console.log('\nEscolha uma opção:');
    console.log('1. Listar Leads "Novos" (Ainda não contatados)');
    console.log('2. Enviar mensagem de boas-vindas para todos os "Novos"');
    console.log('0. Sair');

    rl.question('\nOpção: ', (answer) => {
        const db = getDatabase();
        const novosLeads = db.leads ? db.leads.filter(l => l.status === 'Novo') : [];

        switch(answer) {
            case '1':
                console.log('\n--- LEADS NOVOS ---');
                if (novosLeads.length === 0) console.log('Nenhum lead novo no momento.');
                novosLeads.forEach(l => console.log(`- ${l.nome} | Tel: ${l.telefone || 'Sem tel'}`));
                menuInterativo();
                break;
            case '2':
                if (novosLeads.length === 0) {
                    console.log('\nNenhum lead novo para enviar mensagem.');
                    menuInterativo();
                } else {
                    console.log(`\nIniciando disparos para ${novosLeads.length} leads...`);
                    // Disparo sequencial com delay simples para evitar bloqueio
                    let delay = 0;
                    novosLeads.forEach((lead, index) => {
                        setTimeout(() => {
                            sendWelcomeMessage(lead);
                        }, delay);
                        delay += 5000; // 5 segundos entre mensagens
                    });
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
