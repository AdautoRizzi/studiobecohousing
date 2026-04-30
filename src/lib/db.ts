import fs from 'fs';
import path from 'path';

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
    createdAt: string;
}

const dbFilePath = path.join(process.cwd(), 'database.json');

// Inicializa arquivo se não existir
if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify({ users: [], leads: [] }, null, 2));
}

function getDatabase() {
    const fileData = fs.readFileSync(dbFilePath, 'utf8');
    const parsed = JSON.parse(fileData);
    if (!parsed.leads) parsed.leads = [];
    return parsed as { users: UserAccount[], leads: Lead[] };
}

function saveDatabase(data: any) {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
}

export function getAllUsers(): UserAccount[] {
    return getDatabase().users;
}

export function getUserByEmail(email: string): UserAccount | undefined {
    return getDatabase().users.find(u => u.email === email);
}

export function registerUser(email: string, name: string, phone: string) {
    const db = getDatabase();

    // Evitar duplicidade
    if (db.users.find(u => u.email === email)) {
        throw new Error('E-mail já está em uso.');
    }

    const newUser: UserAccount = {
        email,
        name,
        phone,
        status: 'Pendente',
        createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDatabase(db);
    return newUser;
}

export function approveUser(email: string) {
    const db = getDatabase();
    const index = db.users.findIndex(u => u.email === email);
    if (index !== -1) {
        db.users[index].status = 'Aprovado';
        saveDatabase(db);
        return true;
    }
    return false;
}

export function getAllLeads(): Lead[] {
    return getDatabase().leads || [];
}

export function getLeadById(id: string): Lead | undefined {
    return getDatabase().leads?.find(l => l.id === id);
}

export function saveLead(leadData: Omit<Lead, 'id' | 'status' | 'notasCrm' | 'createdAt'>) {
    const db = getDatabase();
    
    const newLead: Lead = {
        ...leadData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        status: 'Novo',
        notasCrm: '',
        createdAt: new Date().toISOString()
    };

    if (!db.leads) db.leads = [];
    db.leads.push(newLead);
    saveDatabase(db);
    return newLead;
}

export function updateLeadStatus(id: string, status: Lead['status'], notasCrm?: string) {
    const db = getDatabase();
    const index = db.leads.findIndex(l => l.id === id);
    if (index !== -1) {
        db.leads[index].status = status;
        if (notasCrm !== undefined) {
            db.leads[index].notasCrm = notasCrm;
        }
        saveDatabase(db);
        return true;
    }
    return false;
}
