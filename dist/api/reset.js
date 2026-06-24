import { config } from "../config.js";
export function handlerReset(req, res) {
    config.fileServerHits = 0;
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send("config has been reset");
}
