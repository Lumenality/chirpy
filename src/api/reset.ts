import { Request, Response } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "./errors.js";
import { deleteUsers } from "../db/queries/users.js";

export async function handlerReset(req: Request, res: Response){
    if (config.api.platform !== "dev") {
        throw new ForbiddenError("403 verboten!")
    }
    await deleteUsers();
    config.api.fileServerHits = 0;
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send("config has been reset")
}