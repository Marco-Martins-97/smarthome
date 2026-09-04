import "dotenv/config";
import app from "./app.js";
import runMigrations from "./db/migrate.js";

const PORT = process.env.PORT || 3000;

runMigrations();

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});