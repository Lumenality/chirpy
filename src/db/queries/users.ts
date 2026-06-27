import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { asc, eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getUserByEmail(userEmail: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.email, userEmail)
  );
  return result;
}

export async function updateUser(userId:string,hashedPassword:string,email:string) {
  const [result] = await db.update(users)
  .set({
    hashedPassword: hashedPassword,
    email:email
   })
  .where(eq(users.id, userId))
  .returning();
  return result;
}

export async function upgradeToChirpyRed(userId:string){
  const [result] = await db.update(users)
  .set({
    isChirpyRed:true,
   })
  .where(eq(users.id, userId))
  .returning();
  return result;
}

export async function deleteUsers() {
  await db.delete(users);

}