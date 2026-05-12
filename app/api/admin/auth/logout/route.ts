import { NextResponse, type NextRequest } from "next/server";
import { revokeSession, clearSessionCookie, ADMIN_SESSION_COOKIE } from "@/lib/admin/auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    await revokeSession(token);
  }
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}


