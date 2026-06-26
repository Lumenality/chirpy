process.loadEnvFile();
// Helper to throw error if there is the env file for some reason cannot be loaded
function envOrThrow(key) {
    const value = process.env[key];
    if (typeof value !== "string") {
        throw new Error("env not loaded");
    }
    return value;
}
const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
export const config = {
    api: {
        fileServerHits: 0,
        platform: envOrThrow("PLATFORM")
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
    }
};
