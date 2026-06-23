import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ADMIN_SESSION_COOKIE, adminSessionCookieOptions, createSession, verifyPassword } from "@/lib/admin/auth";

const Body = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { username, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });

  const s = await createSession(user.id);
  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, username: user.username, role: user.role }
  });
  res.cookies.set(ADMIN_SESSION_COOKIE, s.token, adminSessionCookieOptions(s.expiresAt));
  return res;
}


