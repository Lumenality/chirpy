import { Request, Response } from "express";
import { config } from "../../config.js";
import { upgradeToChirpyRed } from "../../db/queries/users.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors.js";
import { getAPIKey } from "../auth.js";

export async function handlerUpgradeUserToRed(req: Request, res: Response) {
  const apiKey = getAPIKey(req)
  if(apiKey !== config.api.polkaKey) {
    throw new UnauthorizedError("invalid key")
  }

  if (!req.body || typeof req.body.data.userId !== "string") {
    throw new BadRequestError("missing data");
  }
  if (req.body.event !== "user.upgraded") {
    return res.status(204).send();
  }

  const userId = req.body.data.userId;
  const updatedUser = await upgradeToChirpyRed(userId);
  
  if (!updatedUser) {
    throw new NotFoundError("user of that ID not found");
  }
  
  return res.status(204).send();
}
