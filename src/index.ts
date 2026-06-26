import express, { application } from "express";
import { handlerReadiness } from "./api/readiness.js";
// Admin command handlers
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidate } from "./api/validate.js";
// User handlers
import { handlerCreateUser } from "./api/users.js";
import { handlerLogin } from "./api/auth.js";
// Chirp handlers
import { handlerCreateChirp, handlerGetAllChirps, handlerGetChirp } from "./api/chirps.js";
// Middleware
import { middlewareLogResponses , middlewareMetricsInc, errorHandler } from "./api/middleware.js";
// Config
import { config } from "./config.js";
// psql / drizzle ORM
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";


// migrate on app start
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

// define the app
const app = express();
const PORT = 8080;

// app
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
// Built-in JSON body parsing middleware
app.use(express.json());

// api
app.get("/api/healthz", handlerReadiness);
app.get("/v1/health", handlerReadiness); // silencing the health checker when running the server
app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerGetAllChirps(req, res)).catch(next);
});
app.get("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(handlerGetChirp(req, res)).catch(next);
});
app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerCreateChirp(req, res)).catch(next);
});
app.post("/api/users", (req, res, next) => {
  Promise.resolve(handlerCreateUser(req, res)).catch(next);
});
app.post("/api/login", (req, res, next) => {
  Promise.resolve(handlerLogin(req, res)).catch(next);
});

// admin
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerReset(req, res)).catch(next);
});

// error handler (needs to be after all use/CRUD but before .listen)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});