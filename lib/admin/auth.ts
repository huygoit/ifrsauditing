import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const ADMIN_SESSION_COOKIE = "enso_admin_session";
export const ADMIN_SESSION_TTL_DAYS = 30;

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function newSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function sessionExpiryDate() {
  const d = new Date();
  d.setDate(d.getDate() + ADMIN_SESSION_TTL_DAYS);
  return d;
}

export async function createSession(userId: string) {
  const token = newSessionToken();
  const expiresAt = sessionExpiryDate();
  await prisma.session.create({ data: { token, userId, expiresAt } });
  return { token, expiresAt };
}

export async function revokeSession(token: string) {
  await prisma.session.updateMany({
    where: { token, revokedAt: null },
    data: { revokedAt: new Date() }
  });
}

export function setSessionCookie(token: string, expiresAt: Date) {
  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  });
}

export function clearSessionCookie() {
  cookies().set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0)
  });
}

export async function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const s = await prisma.session.findFirst({
    where: { token, revokedAt: null, expiresAt: { gt: new Date() } },
    include: { user: true }
  });
  return s;
}


