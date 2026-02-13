import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./_core/env";
import { eq } from "drizzle-orm";
import { clientUsers, type ClientUser, type InsertClientUser } from "../drizzle/schema";

const CLIENT_COOKIE_NAME = "client_session";
const SALT_ROUNDS = 12;

function getClientSecret() {
  return new TextEncoder().encode(ENV.cookieSecret + "_client");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createClientSessionToken(client: ClientUser): Promise<string> {
  const secretKey = getClientSecret();
  const expirationSeconds = Math.floor((Date.now() + 1000 * 60 * 60 * 24 * 30) / 1000); // 30 days
  return new SignJWT({
    clientId: client.id,
    email: client.email,
    role: client.role,
    firstName: client.firstName,
    lastName: client.lastName,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(secretKey);
}

export async function verifyClientSession(
  cookieValue: string | undefined | null
): Promise<{
  clientId: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
} | null> {
  if (!cookieValue) return null;
  try {
    const secretKey = getClientSecret();
    const { payload } = await jwtVerify(cookieValue, secretKey, { algorithms: ["HS256"] });
    const { clientId, email, role, firstName, lastName } = payload as Record<string, unknown>;
    if (!clientId || !email || !role) return null;
    return {
      clientId: clientId as number,
      email: email as string,
      role: role as string,
      firstName: (firstName as string) || "",
      lastName: (lastName as string) || "",
    };
  } catch {
    return null;
  }
}

export function parseCookies(cookieHeader: string | undefined): Map<string, string> {
  if (!cookieHeader) return new Map();
  const pairs = cookieHeader.split(";").map((s) => s.trim());
  const map = new Map<string, string>();
  for (const pair of pairs) {
    const idx = pair.indexOf("=");
    if (idx > 0) {
      map.set(pair.substring(0, idx).trim(), pair.substring(idx + 1).trim());
    }
  }
  return map;
}

export { CLIENT_COOKIE_NAME };
