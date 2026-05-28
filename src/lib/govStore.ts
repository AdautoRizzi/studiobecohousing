import fs from 'fs';
import path from 'path';

export const DB_PATH = path.join(process.cwd(), 'data', 'governance.json');

export function getGovData() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch(e) {
        return { circles: [], roles: [], proposals: [], interactions: [], elections: [], nominations: [] };
    }
}

export function saveGovData(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
