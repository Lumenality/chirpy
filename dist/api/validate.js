import { BadRequestError } from "./errors.js";
export async function handlerValidate(req, res) {
    const params = req.body;
    const replacement = "****";
    const badWords = new Set(["kerfuffle", "sharbert", "fornax"]);
    if (params.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    const sanitized = params.body
        .split(" ")
        .map(word => badWords.has(word.toLowerCase()) ? replacement : word)
        .join(" ");
    return res.status(200).send({ cleanedBody: sanitized });
}
