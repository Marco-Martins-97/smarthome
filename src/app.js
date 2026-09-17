import "dotenv/config";
import express from "express";
import runMigrations from "./db/migrate.js";
import session from "express-session";
import { SESSION_MAX_AGE_MS, SQLiteSessionStore } from "./config/session.js";
import routes from "./routes/index.js";

runMigrations();    //Run migrations before anything else

const store = new SQLiteSessionStore();

const app = express();

app.use(express.json());
app.use(session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
        maxAge: SESSION_MAX_AGE_MS,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    },
}));

// Routes
app.use('/api', routes);


app.get('/', (req, res) => {
    res.status(200).send('Ok');
});

export default app;