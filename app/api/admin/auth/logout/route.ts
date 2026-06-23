import { NextResponse, type NextRequest } from "next/server";
import { revokeSession, ADMIN_SESSION_COOKIE, shouldUseSecureAdminCookie } from "@/lib/admin/auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    await revokeSession(token);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureAdminCookie(),
    path: "/",
    expires: new Date(0)
  });
  return res;
}


