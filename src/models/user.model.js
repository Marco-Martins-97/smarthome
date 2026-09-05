import db from "../config/database.js";

export const checkUser = (username) => {
    const user = db.prepare(`SELECT 1 FROM users WHERE username = @username`).get({ username });

    if (user) throw Object.assign(new Error('Username already taken'), { statusCode: 409 });
}

export const saveUser = (username, passwordHash) => {
    db.prepare(`INSERT INTO users (username, password_hash) VALUES (@username, @passwordHash)`).run({ username, passwordHash });
}

export const getUser = (username) => {
    return db.prepare(`SELECT id, password_hash FROM users WHERE username = @username`).get({ username });
}