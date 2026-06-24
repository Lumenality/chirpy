process.loadEnvFile();
export const config = {
    fileServerHits: 0,
    dbURL: envOrThrow("DB_URL"),
};
function envOrThrow(key) {
    const value = process.env[key];
    if (typeof value !== "string") {
        throw new Error("env not loaded");
    }
    return value;
}
