import argon2 from "argon2";
import { getUserByEmail } from "../db/queries/users.js";
import { UnauthorizedError } from "./errors.js";
export async function hashPassword(password) {
    const hash = await argon2.hash(password);
    return hash;
}
export async function checkPasswordHash(password, hash) {
    return await argon2.verify(hash, password);
}
export async function handlerLogin(req, res) {
    let user;
    try {
        user = await getUserByEmail(req.body.email);
    }
    catch {
        throw new UnauthorizedError("incorrect email or password");
    }
    const isValidPassword = await checkPasswordHash(req.body.password, user.hashedPassword);
    if (!isValidPassword) {
        throw new UnauthorizedError("incorrect email or password");
    }
    const { hashedPassword: _, ...userResponse } = user;
    return res.status(200).send(userResponse);
}
