import { supabase } from './supabase';

export interface UserAccount {
    email: string;
    name: string;
    phone: string;
    status: 'Pendente' | 'Aprovado';
    createdAt: string;
}

export interface Lead {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    moradiaAtual: string;
    idade: string;
    profissao: string;
    genero: string;
    ondeMorar: string;
    tipoCohousing: string;
    tipologia: string;
    comQuem: string;
    totalPessoas: string;
    areaResidencia: string;
    dormitorios: string;
    suites: string;
    interesses: string[];
    empreender: string[];
    valores: string[];
    status: 'Novo' | 'Contatado' | 'Qualificado' | 'Turma Atribuída' | 'Descartado';
    notasCrm: string;
    proximoContato: string | null;
    observacoes: string;
    categoria?: string; // Ex: 'Lead Site', 'Pesquisa Antiga', 'Investidor', 'Proprietário de Área', 'Parceiro'
    createdAt: string;
}

export interface Interaction {
    id: number;
    lead_id: string;
    content: string;
    type: 'WhatsApp' | 'Ligação' | 'Reunião' | 'E-mail' | 'Sistema';
    sent_at: string;
}

export interface MessageTemplate {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

export interface QueuedMessage {
    id: number;
    lead_id: string;
    message: string;
    status: 'pending' | 'sent' | 'failed';
    created_at: string;
}

// Funções para Usuários (Moradores)
export async function getAllUsers(): Promise<UserAccount[]> {
    const { data, error } = await supabase
        .from('users')
        .select('*');
    
    if (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
    }
    return data as UserAccount[];
}

export async function getUserByEmail(email: string): Promise<UserAccount | undefined> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
    
    if (error) return undefined;
    return data as UserAccount;
}

export async function registerUser(email: string, name: string, phone: string) {
    const { data, error } = await supabase
        .from('users')
        .insert([{
            email,
            name,
            phone,
            status: 'Pendente'
        }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function approveUser(email: string) {
    const { error } = await supabase
        .from('users')
        .update({ status: 'Aprovado' })
        .eq('email', email);
    
    return !error;
}

// Funções para Leads (CRM)
export async function getAllLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('createdAt', { ascending: false });
    
    if (error) {
        console.error('Erro ao buscar leads:', error);
        return [];
    }
    return data as Lead[];
}

export async function getLeadById(id: string): Promise<Lead | undefined> {
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) return undefined;
    return data as Lead;
}

export async function saveLead(formData: any) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    
    const leadData: any = {
        id,
        nome: formData.nome || '',
        email: formData.email || '',
        telefone: formData.telefone || '',
        moradiaAtual: formData.moradiaAtual || '',
        idade: formData.idade || '',
        profissao: formData.profissao || '',
        genero: formData.genero || '',
        ondeMorar: formData.ondeMorar || '',
        tipoCohousing: formData.tipoCohousing || '',
        tipologia: formData.tipologia || '',
        areaResidencia: formData.areaResidencia || '',
        comQuem: formData.comQuem || '',
        totalPessoas: formData.totalPessoas || '',
        dormitorios: formData.dormitorios?.toString() || '0',
        suites: formData.suites?.toString() || '0',
        interesses: formData.interesses || [],
        valores: formData.valores || [],
        empreender: formData.empreender || [],
        observacoes: formData.observacoes || '',
        categoria: formData.categoria || 'Lead Site',
        status: 'Novo',
        notasCrm: '',
        createdAt: new Date().toISOString()
    };

    // Insere o lead no Supabase
    const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

    if (error) {
        console.error("Erro Supabase Insert:", error);
        throw new Error(error.message);
    }
    return data;
}

export async function updateLeadStatus(id: string, status: Lead['status'], notasCrm?: string, proximoContato?: string | null) {
    const updateData: any = { status };
    if (notasCrm !== undefined) {
        updateData.notasCrm = notasCrm;
    }
    if (proximoContato !== undefined) {
        updateData.proximoContato = proximoContato;
    }

    const { error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', id);
    
    return !error;
}

export async function deleteLead(id: string) {
    // 1. Excluir todas as interações primeiro para evitar erro de chave estrangeira
    await supabase
        .from('lead_interactions')
        .delete()
        .eq('lead_id', id);

    // 2. Excluir o lead
    const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
}

export async function logManualInteraction(leadId: string, content: string, type: Interaction['type']) {
    const { data, error } = await supabase
        .from('lead_interactions')
        .insert([{
            lead_id: leadId,
            content,
            type,
            sent_at: new Date().toISOString()
        }])
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    return data;
}

// Funções de Interação e Histórico
export async function getAllInteractions(): Promise<Interaction[]> {
    const { data, error } = await supabase
        .from('lead_interactions')
        .select('*');
    
    if (error) return [];
    return data as Interaction[];
}
export async function getInteractionsByLead(leadId: string): Promise<Interaction[]> {
    const { data, error } = await supabase
        .from('lead_interactions')
        .select('*')
        .eq('lead_id', leadId)
        .order('sent_at', { ascending: false });
    
    if (error) return [];
    return data as Interaction[];
}

// Funções de Templates
export async function getMessageTemplates(): Promise<MessageTemplate[]> {
    const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .order('title', { ascending: true });
    
    if (error) return [];
    return data as MessageTemplate[];
}

export async function createMessageTemplate(title: string, content: string) {
    const { data, error } = await supabase
        .from('message_templates')
        .insert([{ title, content }])
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    return data;
}

export async function updateMessageTemplate(id: number, title: string, content: string) {
    const { data, error } = await supabase
        .from('message_templates')
        .update({ title, content })
        .eq('id', id)
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    return data;
}

export async function deleteMessageTemplate(id: number) {
    const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', id);
    
    if (error) throw new Error(error.message);
    return true;
}

// Funções de Fila de Mensagens
export async function addToMessageQueue(leadId: string, message: string) {
    const { data, error } = await supabase
        .from('message_queue')
        .insert([{ lead_id: leadId, message, status: 'pending' }])
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    return data;
}

export async function updateLeadNotes(id: string, notasCrm: string) {
    const { error } = await supabase
        .from('users')
        .update({ notasCrm })
        .eq('id', id);
    if (error) {
        console.error('Error updating lead notes:', error);
        throw error;
    }
}

// --- HACK MVP: TAREFAS GLOBAIS ---
// Para evitar migrações complexas de banco de dados neste MVP, 
// as tarefas globais são salvas como JSON no notasCrm de um "usuário fantasma" (SYSTEM_TASKS)

const SYSTEM_TASKS_EMAIL = 'system_tasks_global_board@studiobe.com';

async function ensureSystemTasksUser() {
    const { data } = await supabase.from('users').select('id, notasCrm').eq('email', SYSTEM_TASKS_EMAIL).single();
    if (data) return data;
    
    // Create it
    const { data: newData, error } = await supabase.from('users').insert([{
        nome: 'SYSTEM TASKS',
        email: SYSTEM_TASKS_EMAIL,
        telefone: '00000000000',
        idade: '0',
        cidade: 'System',
        profissao: 'System',
        comoNosConheceu: 'System',
        status: 'Descartado', // So it doesn't show in CRM lists
        notasCrm: '[]'
    }]).select('id, notasCrm').single();
    
    return newData;
}

export interface GlobalTask {
    id: string;
    title: string;
    column_id: 'todo' | 'doing' | 'done';
    created_at: string;
}

export async function getGlobalTasks(): Promise<GlobalTask[]> {
    const sysUser = await ensureSystemTasksUser();
    try {
        return JSON.parse(sysUser?.notasCrm || '[]');
    } catch(e) {
        return [];
    }
}

export async function saveGlobalTasks(tasks: GlobalTask[]) {
    const sysUser = await ensureSystemTasksUser();
    await supabase.from('users').update({ notasCrm: JSON.stringify(tasks) }).eq('id', sysUser?.id);
}

// --- HACK MVP: PASSOS DO METODO ---
const SYSTEM_METHOD_STEPS_EMAIL = 'system_method_steps@studiobe.com';
async function ensureSystemMethodUser() {
    const { data } = await supabase.from('users').select('id, notasCrm').eq('email', SYSTEM_METHOD_STEPS_EMAIL).single();
    if (data) return data;
    
    const defaultSteps = [
        { id: 'step1', name: 'Passo 1: Envio do Kit Boas-Vindas (em até 24h)' },
        { id: 'step2', name: 'Passo 2: Ligação de Descoberta / Qualificação' },
        { id: 'step3', name: 'Passo 3: Reunião de Apresentação (Meet)' },
        { id: 'step4', name: 'Passo 4: Follow-up & Envio de Materiais' },
        { id: 'step5', name: 'Passo 5: Convite Oficial para Turma' }
    ];

    const { data: newData } = await supabase.from('users').insert([{
        nome: 'SYSTEM METHOD STEPS',
        email: SYSTEM_METHOD_STEPS_EMAIL,
        telefone: '00000000000',
        idade: '0',
        cidade: 'System',
        profissao: 'System',
        comoNosConheceu: 'System',
        status: 'Descartado',
        notasCrm: JSON.stringify(defaultSteps)
    }]).select('id, notasCrm').single();
    
    return newData;
}

export interface MethodStep { id: string; name: string; }

export async function getMethodSteps(): Promise<MethodStep[]> {
    const sysUser = await ensureSystemMethodUser();
    try { return JSON.parse(sysUser?.notasCrm || '[]'); } catch(e) { return []; }
}

export async function saveMethodSteps(steps: MethodStep[]) {
    const sysUser = await ensureSystemMethodUser();
    await supabase.from('users').update({ notasCrm: JSON.stringify(steps) }).eq('id', sysUser?.id);
}


// --- HACK MVP: 12 WEEK YEAR + SCRUM PLAN ---
const SYS_12WEEK_PLAN_EMAIL = 'sys_12week_plan@studiobe.com';

export interface TrimestralObjective {
    id: string;
    name: string;
}

export interface ScrumTask {
    id: string;
    description: string;
    status: 'todo' | 'doing' | 'done';
    objectiveId?: string;
    owner?: string;
}

export interface ScrumSprint {
    weekNumber: number;
    startDate: string;
    endDate: string;
    tasks: ScrumTask[];
}

export interface TwelveWeekPlan {
    vision3Years: string;
    objectives: TrimestralObjective[];
    sprints: Record<number, ScrumSprint>;
    currentSprintWeek: number;
}

async function ensureSystem12WeekUser() {
    const { data } = await supabase.from('users').select('id, notasCrm').eq('email', SYS_12WEEK_PLAN_EMAIL).single();
    if (data) return data;
    
    // Build initial blank plan
    const initialPlan: TwelveWeekPlan = {
        vision3Years: 'Construir o Ecossistema Líder em Cohousing no Brasil',
        objectives: [
            { id: 'obj1', name: 'Aceleração e Qualificação Profunda' }
        ],
        currentSprintWeek: 1,
        sprints: {}
    };
    for(let i=1; i<=12; i++) {
        initialPlan.sprints[i] = {
            weekNumber: i,
            startDate: '',
            endDate: '',
            tasks: []
        };
    }

    const { data: newData } = await supabase.from('users').insert([{
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
    
    return newData;
}

export async function getTwelveWeeksPlan(): Promise<TwelveWeekPlan> {
    const sysUser = await ensureSystem12WeekUser();
    try { 
        return JSON.parse(sysUser?.notasCrm || '{}'); 
    } catch(e) { 
        const dummy: TwelveWeekPlan = { vision3Years: 'Erro', objectives: [], currentSprintWeek: 1, sprints: {} };
        return dummy;
    }
}

export async function saveTwelveWeeksPlan(plan: TwelveWeekPlan) {
    const sysUser = await ensureSystem12WeekUser();
    await supabase.from('users').update({ notasCrm: JSON.stringify(plan) }).eq('id', sysUser?.id);
}).eq('id', sysUser?.id);
}
