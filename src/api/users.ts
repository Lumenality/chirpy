import { Request, Response } from "express";

import { config } from "../config.js";

import { createUser, updateUser } from "../db/queries/users.js";
import { hashPassword } from "./auth.js";
import { getBearerToken,validateJWT } from "./auth.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./errors.js";

export async function handlerCreateUser(req: Request, res: Response){
  const hashedPassword = await hashPassword(req.body.password)
  const newUser = await createUser({
    hashedPassword: hashedPassword,
    email: req.body.email
  });

  // Splitting out hashedPassword (and ignore it to avoid conflict)
  const { hashedPassword: _, ...userResponse } = newUser;
  return res.status(201).send(userResponse);

}

export async function handlerUpdateUser(req: Request, res: Response){
  const bearerToken = getBearerToken(req);
  const userId = validateJWT(bearerToken,config.api.jwtSecret);
  // if (!userId) {
  //   throw new UnauthorizedError("invalid (or missing) token")
  // }
  if (!req.body || typeof req.body.password !== "string" || typeof req.body.email !== "string") {
    throw new BadRequestError("missing data")
  }
  const newHashedPassword = await hashPassword(req.body.password)
  const newEmail = req.body.email
  const updatedUser = await updateUser(userId,newHashedPassword,newEmail);
  const { hashedPassword: _, ...userResponse } = updatedUser;
  return res.status(200).send(userResponse);
}