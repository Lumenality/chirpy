import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { middlewareLogResponses, middlewareMetricsInc, errorHandler } from "./api/middleware.js";
import { handlerValidate } from "./api/validate.js";
const app = express();
const PORT = 8080;
// app
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
// Built-in JSON body parsing middleware
app.use(express.json());
// api
app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", (req, res, next) => {
    Promise.resolve(handlerValidate(req, res)).catch(next);
});
//app.get("/api/metrics", handlerFileserverHits); // migrated to admin 
// admin
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);
// error handler (needs to be after all use/CRUD but before .listen)
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
