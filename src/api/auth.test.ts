import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, getBearerToken } from "./auth.js";
import { hashPassword, checkPasswordHash } from "./auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("Getting JWT Bearer Token", () => {
  const authorization1 = "";
  const authorization2 = "Bearer";
  const authorization3 =
    "Bearer eLUoOYZ8uGtihuVfMsm0fVQQgbaUvLRSQKMaiJyYW4nXvxhgqIku0Hsg2lfnnqmyJLD3omzw2DFHS48vtxVCRA==";

  const mockReq = (authHeader?: string) => ({
    get: (key: string) => (key === "Authorization" ? authHeader : undefined),
  });

  it("should throw 401 for missing auth header", async () => {
    //const result = await getBearerToken(mockReq(authorization1));
    expect(() => getBearerToken(mockReq(authorization1) as any)).toThrow();
  });

  it("should throw 401 for missing auth token", async () => {
    //const result = await getBearerToken(mockReq(authorization1));
    expect(() => getBearerToken(mockReq(authorization2) as any)).toThrow();
  });

  it("Should return the clean auth token", async () => {
    const result = getBearerToken(mockReq(authorization3) as any);
    expect(result).toBe(
      "eLUoOYZ8uGtihuVfMsm0fVQQgbaUvLRSQKMaiJyYW4nXvxhgqIku0Hsg2lfnnqmyJLD3omzw2DFHS48vtxVCRA==",
    );
  });
});
