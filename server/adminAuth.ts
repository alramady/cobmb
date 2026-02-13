import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./_core/env";
import * as db from "./db";
import type { AdminUser } from "../drizzle/schema";

const ADMIN_COOKIE_NAME = "admin_session";
const SALT_ROUNDS = 12;

function getAdminSecret() {
  return new TextEncoder().encode(ENV.cookieSecret + "_admin");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminSessionToken(admin: AdminUser): Promise<string> {
  const secretKey = getAdminSecret();
  const expirationSeconds = Math.floor((Date.now() + 1000 * 60 * 60 * 24 * 7) / 1000); // 7 days
  return new SignJWT({
    adminId: admin.id,
    username: admin.username,
    role: admin.role,
    displayName: admin.displayName || admin.fullName,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(secretKey);
}

export async function verifyAdminSession(
  cookieValue: string | undefined | null
): Promise<{ adminId: number; username: string; role: string; displayName: string } | null> {
  if (!cookieValue) return null;
  try {
    const secretKey = getAdminSecret();
    const { payload } = await jwtVerify(cookieValue, secretKey, { algorithms: ["HS256"] });
    const { adminId, username, role, displayName } = payload as Record<string, unknown>;
    if (!adminId || !username || !role) return null;
    return { adminId: adminId as number, username: username as string, role: role as string, displayName: (displayName as string) || "" };
  } catch {
    return null;
  }
}

export async function authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
  const admin = await db.getAdminByUsername(username);
  if (!admin) return null;
  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) return null;
  await db.updateAdminLastLogin(admin.id);
  return admin;
}

export function parseCookies(cookieHeader: string | undefined): Map<string, string> {
  if (!cookieHeader) return new Map();
  const pairs = cookieHeader.split(";").map(s => s.trim());
  const map = new Map<string, string>();
  for (const pair of pairs) {
    const idx = pair.indexOf("=");
    if (idx > 0) {
      map.set(pair.substring(0, idx).trim(), pair.substring(idx + 1).trim());
    }
  }
  return map;
}

export { ADMIN_COOKIE_NAME };
