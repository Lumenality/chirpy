import { Request, Response } from "express";
import { createChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";
import { BadRequestError, NotFoundError } from "./errors.js";

export async function handlerCreateChirp(req: Request, res: Response){

  const newChirp = await createChirp({
        body: req.body.body,
        userId: req.body.userId
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