process.loadEnvFile() 

import type { MigrationConfig } from "drizzle-orm/migrator";
import { env } from "node:process";

type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  fileServerHits: number;
  platform: string;
  jwtSecret: string;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
}
// Helper to throw error if there is the env file for some reason cannot be loaded
function envOrThrow(key: string) {
    const value = process.env[key];
    if (typeof value !== "string") {
      throw new Error("env not loaded")
    }
    return value;
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config:Config = {
    api: {
      fileServerHits: 0,
      platform: envOrThrow("PLATFORM"),
      jwtSecret: envOrThrow("JWT_SECRET")
    },
    db:{
      url: envOrThrow("DB_URL"),
      migrationConfig:migrationConfig,
    }
};

