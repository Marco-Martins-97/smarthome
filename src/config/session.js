import "dotenv/config";
import db from "./database.js";
import session from 'express-session';

const SESSION_MAX_AGE = Number(process.env.SESSION_AGE || 30);

export const SESSION_MAX_AGE_MS = SESSION_MAX_AGE * 24 * 60 * 60 * 1000;

export class SQLiteSessionStore extends session.Store {
    constructor() {
        super();

        this.getStatement = db.prepare(`SELECT session, expires_at FROM sessions WHERE sid = @sid`);
        this.setStatement = db.prepare(`
            INSERT INTO sessions (sid, session, expires_at)
            VALUES (@sid, @session, @expires_at)
            ON CONFLICT(sid) DO UPDATE SET
                session = excluded.session,
                expires_at = excluded.expires_at
        `);
        this.touchtStatement = db.prepare(`UPDATE sessions SET expires_at = @expires_at WHERE sid = @sid`);
        this.destroyStatement = db.prepare(`DELETE FROM sessions WHERE sid = @sid`);
        this.deleteExpiredStatement = db.prepare(`DELETE FROM sessions WHERE sid = @sid`);
    }

    get(sid, callback) {
        try {
            const row = this.getStatement.get({ sid });

            if (!row) return callback(null, null);

            const expires_at = new Date(row.expires_at).getTime();

            if (expires_at <= Date.now()) {
                this.deleteExpiredStatement.run({ sid });
                return callback(null, null);
            }

            const sessionData = JSON.parse(row.session);
            callback(null, sessionData);
        } catch (error) {
            callback(error);
        }
    }

    set(sid, sessionData, callback) {
        try {
            const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS).toISOString();

            this.setStatement.run({ sid, session: JSON.stringify(sessionData), expires_at: expiresAt });

            callback(null);
        } catch (error) {
            callback(error);
        }
    }

    destroy(sid, callback) {
        try {
            this.destroyStatement.run({ sid });

            callback(null);
        } catch (error) {
            callback(error);
        }
    }

    touch(sid, sessionData, callback) {
        try {
            const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS).toISOString();

            this.touchtStatement.run({ expires_at: expiresAt, sid });

            callback(null);
        } catch (error) {
            callback(error);
        }
    }
}