import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/admin/auth";

export async function requireAdminSession(req: NextRequest) {
  const s = await getSessionFromRequest(req);
  if (!s) {
    return { session: null, response: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }
  return { session: s, response: null };
}


