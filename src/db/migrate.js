import fs from 'fs';
import path from 'path';
import db from '../config/database.js';

export default function runMigrations() {
    const migrationsDir = path.join(import.meta.dirname, './migrations');

    db.exec(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename TEXT NOT NULL PRIMARY KEY,
            applied_at TIMESTAMP NOT NULL
        );  
    `);

    const migrationFiles = fs.readdirSync(migrationsDir).filter((filename) => filename.endsWith('.sql')).sort();
    const hasMigrated = db.prepare(`SELECT 1 FROM schema_migrations WHERE filename = @filename`);
    const recordMigration = db.prepare(`INSERT INTO schema_migrations (filename, applied_at) VALUES (@filename, @applied_at)`);

    for (const filename of migrationFiles) {
        const alreadyApplied = hasMigrated.get({ filename });

        if (alreadyApplied) continue;

        const migrationPath = path.join(migrationsDir, filename);
        const sql = fs.readFileSync(migrationPath, 'utf8');

        const appyMigration = db.transaction(() => {
            db.exec(sql);
            recordMigration.run({ filename, applied_at: new Date().toISOString() });
        });

        appyMigration();
    }
    console.log('Migrations Completed.');
}