import { NextResponse, type NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/admin/auth";

export async function GET(req: NextRequest) {
  const s = await getSessionFromRequest(req);
  if (!s) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({
    user: { id: s.user.id, username: s.user.username, role: s.user.role }
  });
}


