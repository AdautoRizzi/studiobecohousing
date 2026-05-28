import fs from 'fs';
import path from 'path';

export const DB_PATH = path.join(process.cwd(), 'data', 'governance.json');

export function getGovData() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        const parsed = JSON.parse(data);
        return {
            circles: parsed.circles || [],
            roles: parsed.roles || [],
            proposals: parsed.proposals || [],
            interactions: parsed.interactions || [],
            elections: parsed.elections || [],
            nominations: parsed.nominations || [],
            tensions: parsed.tensions || [],
            notifications: parsed.notifications || [],
            logbook: parsed.logbook || []
        };
    } catch(e) {
        return { circles: [], roles: [], proposals: [], interactions: [], elections: [], nominations: [], tensions: [], notifications: [], logbook: [] };
    }
}

export function saveGovData(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// ACTION: Approve Proposal and Trigger Double Linking
export async function approveProposalAction(proposalId: string) {
    'use server';
    
    const data = getGovData();
    const proposal = data.proposals.find((p: any) => p.id === proposalId);
    if (!proposal || proposal.status === 'Approved') return { success: false, error: 'Proposta não encontrada ou já aprovada' };

    // Aprova a proposta
    proposal.status = 'Approved';
    
    // Insere no Logbook
    const logEntry = {
        id: 'l' + Date.now(),
        circleId: proposal.circleId,
        title: proposal.title,
        content: proposal.content,
        createdAt: new Date().toISOString(),
        reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // Revisar em 3 meses
    };
    data.logbook.push(logEntry);

    // Double Linking Automation: Inform Parent Circle
    const circle = data.circles.find((c: any) => c.id === proposal.circleId);
    if (circle && circle.parentCircleId) {
        // Encontra o delegado deste sub-círculo
        const delegateRole = data.roles.find((r: any) => r.circleId === circle.id && r.roleType === 'Delegate');
        
        // Cria uma tensão no Parent Circle para que a ata seja lida
        const tension = {
            id: 't' + Date.now(),
            circleId: circle.parentCircleId,
            title: `Decisão de Sub-círculo: ${proposal.title}`,
            content: `A política "${proposal.title}" foi aprovada no círculo ${circle.name}. Esta é uma pauta informativa.`,
            sourceCircleId: circle.id,
            assignedToRole: delegateRole ? delegateRole.id : null,
            status: 'Open',
            createdAt: new Date().toISOString()
        };
        data.tensions.push(tension);

        // Dispara notificação para o Delegado
        if (delegateRole) {
            data.notifications.push({
                id: 'n' + Date.now(),
                userId: delegateRole.userId,
                title: 'Alerta de Tensão - Double Linking',
                message: `Você deve informar o Círculo Pai sobre a aprovação da política "${proposal.title}".`,
                read: false,
                createdAt: new Date().toISOString()
            });
        }
    }

    saveGovData(data);
    return { success: true };
}
