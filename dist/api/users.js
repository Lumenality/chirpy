import { createUser } from "../db/queries/users.js";
import { hashPassword } from "./auth.js";
export async function handlerCreateUser(req, res) {
    const hashedPassword = await hashPassword(req.body.password);
    const newUser = await createUser({
        hashedPassword: hashedPassword,
        email: req.body.email
    });
    // Splitting out hashedPassword (and ignore it to avoid conflict)
    const { hashedPassword: _, ...userResponse } = newUser;
    return res.status(201).send(userResponse);
}
