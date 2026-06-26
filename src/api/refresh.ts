import { Request, Response } from "express";

import { config } from "../config.js";

import { getBearerToken, makeJWT } from "./auth.js";
import { getUserByRefreshToken } from "../db/queries/refreshTokens.js";
import { UnauthorizedError } from "./errors.js";

export async function handlerRefresh(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    const user = await getUserByRefreshToken(refreshToken);
    if (!user) {
        throw new UnauthorizedError("invalid token")
    }
    const tokenExpiresIn = 60 * 60 //..seconds (1 hour)
    const token = makeJWT(user.id,tokenExpiresIn,config.api.jwtSecret)

    return res.status(200).send( {token:token} );
}