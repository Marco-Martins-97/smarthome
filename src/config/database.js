import Database from "better-sqlite3";
import path from 'path';

const dbPath = path.join(import.meta.dirname, '../../data/smarthome.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

console.log('Database connected successfully.');
export default db;