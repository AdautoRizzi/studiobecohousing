import fs from 'fs';
import path from 'path';

export interface UserAccount {
    email: string;
    name: string;
    phone: string;
    status: 'Pendente' | 'Aprovado';
    createdAt: string;
}

const dbFilePath = path.join(process.cwd(), 'database.json');

// Inicializa arquivo se não existir
if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify({ users: [] }, null, 2));
}

function getDatabase() {
    const fileData = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(fileData) as { users: UserAccount[] };
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
