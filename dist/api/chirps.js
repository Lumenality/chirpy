import { createChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
import { BadRequestError, NotFoundError } from "./errors.js";
export async function handlerCreateChirp(req, res) {
    const newChirp = await createChirp({
        body: req.body.body,
        userId: req.body.userId
    });
    return res.status(201).send(newChirp);
}
export async function handlerGetChirp(req, res) {
    const { chirpId } = req.params;
    if (typeof chirpId !== "string") {
        throw new BadRequestError("incorrect string id value");
    }
    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError("chirp of that id not found");
    }
    return res.status(200).send(chirp);
}
export async function handlerGetAllChirps(req, res) {
    const chirps = await getAllChirps();
    return res.status(200).send(chirps);
}
