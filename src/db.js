import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('db.json');
const db = lowdb(adapter);

export function initializeDb() {
  db.defaults({
    nubankTokens: [],
    favoriteActions: [],
  }).write();
}

export default db;
