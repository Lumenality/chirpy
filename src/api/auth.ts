import { Request, Response } from "express";

import argon2 from "argon2";

import { getUserByEmail } from "../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "./errors.js";
import { config } from "../config.js";

import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { isTable } from "drizzle-orm";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password);
    return hash;

}

export async function checkPasswordHash(password: string, hash: string) {
    return await argon2.verify(hash, password);

}

export async function handlerLogin(req: Request, res: Response) {
    let user;
    try {
        user = await getUserByEmail(req.body.email)
    } catch {
        throw new UnauthorizedError("incorrect email or password")
    }

    const isValidPassword = await checkPasswordHash(req.body.password, user.hashedPassword)
    if (!isValidPassword) {
        throw new UnauthorizedError("incorrect email or password")
    }
    // Construct the JWT
    const expiresInSeconds = req.body.expiresInSeconds && req.body.expiresInSeconds < 3600
        ? req.body.expiresInSeconds
        : 3600; // Set to an hour if not specified
    const token = makeJWT(user.id,expiresInSeconds,config.api.jwtSecret)
    // Remove the password from output
    const { hashedPassword: _, ...userResponse } = user;
    // Spread response and include token in the return object
    return res.status(200).send({ ...userResponse, token });
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string{
    const iat = Math.floor(Date.now() / 1000)
    const payload:payload = {
        iss: "chirpy",
        sub: userID,
        iat: iat,
        exp: iat + expiresIn
    }
    return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string{
    let decoded = null; 
    try {
        decoded = jwt.verify(tokenString, secret);
    } catch {
        throw new UnauthorizedError("invalid token")
    }
    if (typeof decoded === "string") {
        throw new UnauthorizedError("invalid token")
    }
    if (typeof decoded.sub !== "string") {
        throw new UnauthorizedError("invalid token")
    }
    if (typeof decoded.iss !== "string" || decoded.iss !== "chirpy") {
        throw new UnauthorizedError("invalid token")
    }
    return decoded.sub;
}

export function getBearerToken(req: Request): string {
    const token = req.get("Authorization");
    if (!token) {
        throw new UnauthorizedError("invalid token")
    }
    const cleanToken = token.split(" ")[1].trim()
    if (!cleanToken) {
        throw new UnauthorizedError("invalid token")
    }
    return cleanToken;
}