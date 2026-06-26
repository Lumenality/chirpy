import { Request, Response } from "express";
import { createChirp, deleteChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "./errors.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";

export async function handlerCreateChirp(req: Request, res: Response){
  const bearerToken = getBearerToken(req);
  const userId = validateJWT(bearerToken,config.api.jwtSecret);
  const newChirp = await createChirp({
        body: req.body.body,
        userId: userId
    });

  return res.status(201).send( newChirp );

}
export async function handlerGetChirp(req: Request, res: Response) {
  const { chirpId } = req.params;
  if (typeof chirpId !== "string") {
    throw new BadRequestError("incorrect string id value")
  }
  const chirp = await getChirp(chirpId)
  if (!chirp) {
    throw new NotFoundError("chirp of that id not found")
  }
  return res.status(200).send( chirp );
}

export async function handlerGetAllChirps(req: Request, res: Response) {
  const chirps = await getAllChirps();
  return res.status(200).send( chirps );
}

export async function handlerDeleteChirp(req: Request, res: Response) {
  const bearerToken = getBearerToken(req);
  const userId = validateJWT(bearerToken,config.api.jwtSecret);
  const { chirpId } = req.params;

  if (typeof chirpId !== "string") {
    throw new BadRequestError("Invalid chirp ID");
  }

  const chirpToDelete = await getChirp(chirpId);

  if (!chirpToDelete) {
    throw new NotFoundError("chirp not found")
  }
  if (!(chirpToDelete.userId === userId)) {
    throw new ForbiddenError("invalid user (not creator)")
  }

  await deleteChirp(chirpToDelete.id);
  return res.status(204).send();
}

  