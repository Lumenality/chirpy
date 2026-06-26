import { ref } from "node:process";
import { db } from "../index.js";
import { refreshTokens, NewRefreshToken } from "../schema.js";
import { users } from "../schema.js";
import { asc, eq, and, not, isNull, isNotNull, gt} from "drizzle-orm";

export async function createRefreshToken(refreshToken: NewRefreshToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getUserByRefreshToken(token: string) {

    const [result] = await db
        .select({ user: users })
        .from(refreshTokens)
        .innerJoin(users, eq(refreshTokens.userId, users.id))
        .where(
            and(
                eq(
                    refreshTokens.token,
                     token
                ),
                and(
                    isNull(refreshTokens.revokedAt),
                    gt(refreshTokens.expiresAt, new Date())
                )
            )
        );
    
    return result?.user;
}

export async function revokeRefreshToken(token:string) {
    await db.update(refreshTokens)
        .set({revokedAt: new Date()})
        .where(eq(refreshTokens.token, token))
}