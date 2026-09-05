import fs from "fs";
import path from "path";

const logDir = path.resolve("logs");
const logFile = path.join(logDir, "err.log");

fs.mkdirSync(logDir, { recursive: true });

export const logError = (error) => {
    const timestamp = new Date().toISOString();

    const message = [
        `[${timestamp}]`,
        `name=${error.name}`,
        `message=${error.message}`,
        `statusCode=${error.statusCode ?? 500}`,
        `stack=${error.stack}`,
        "\n"
    ].join(" ");

    fs.appendFileSync(logFile, message);
};