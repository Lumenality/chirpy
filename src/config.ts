process.loadEnvFile() 

type APIConfig = {
  fileServerHits: number;
  dbURL: string;
};

export const config:APIConfig = {
    fileServerHits: 0,
    dbURL: envOrThrow("DB_URL"),
};

function envOrThrow(key: string) {
    const value = process.env[key];
    if (typeof value !== "string") {
      throw new Error("env not loaded")
    }
    return value;
}