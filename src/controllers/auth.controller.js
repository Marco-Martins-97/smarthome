import "dotenv/config";
import bcrypt from "bcrypt";
import { checkUser, getUser, saveUser } from "../models/user.model.js";
import { logError } from "../utils/logger.js";

const hashPassword = async (password) => {
    const SALT_ROUNDS = Number(process.env.HASHING_SALT) || 10;
    return await bcrypt.hash(password, SALT_ROUNDS);
}

const DUMMY_HASH = await hashPassword('random-placeholder');

export async function register(req, res) {
    try {
        const { username, password } = req.body;

        checkUser(username);

        const passwordHash = await hashPassword(password);

        saveUser(username, passwordHash);

        return res.status(201).json({ message: 'New user created' });
    } catch (error) {
        logError(error);
        console.error(error);

        if (error.statusCode === 409 || error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ error: 'Username already taken' });
        }
        return res.status(500).json({ error: 'Internal server error!' });
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;

        const user = getUser(username);

        const passwordMatches = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);

        if (!user || !passwordMatches) return res.status(401).json({ message: 'Invalid username or password' });

        req.session.userId = user.id;

        return res.status(200).json({ message: 'User logged in' });
    } catch (error) {
        logError(error);
        console.error(error);

        return res.status(500).json({ error: 'Internal server error!' });
    }
}

export function me(req, res) {
    return res.status(200).json({ message: `User ID: ${req.session.userId}` });
}
