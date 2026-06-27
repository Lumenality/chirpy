import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { asc, desc, eq } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}
export async function getChirp(chirpId: string) {
  const [result] = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, chirpId)
  );
  return result;
}
export async function getAllChirps(authorId?:string,sortOrder?:string) {
  const orderExpr = sortOrder === "desc" ? desc(chirps.createdAt) : asc(chirps.createdAt);
  const result = await db
    .select()
    .from(chirps)
    .where(authorId?eq(chirps.userId, authorId):undefined)
    .orderBy(
      orderExpr
    );
  return result;
}

export async function deleteChirp(id:string){
  await db.delete(chirps)
    .where(eq(chirps.id, id))
}

export async function deleteChirps() {
  await db.delete(chirps);

}