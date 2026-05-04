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

export async function saveLead(leadData: Omit<Lead, 'id' | 'status' | 'notasCrm' | 'createdAt'>) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    
    const { data, error } = await supabase
        .from('leads')
        .insert([{
            ...leadData,
            id,
            status: 'Novo',
            notasCrm: ''
        }])
        .select()
        .single();

    if (error) throw new Error(error.message);
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
