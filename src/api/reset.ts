import { Request, Response } from "express";
import { config } from "../config.js";

export function handlerReset(req: Request, res: Response){
    config.fileserverHits = 0;
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send("config has been reset")
}