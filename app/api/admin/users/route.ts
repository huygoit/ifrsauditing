import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { hashPassword } from "@/lib/admin/auth";

const Query = z.object({
  q: z.string().optional(),
  role: z.enum(["ADMIN", "EDITOR", "CSKH"]).optional()
});

export async function GET(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = Query.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });

  const q = (parsed.data.q ?? "").trim();
  const role = parsed.data.role ?? undefined;

  const items = await prisma.user.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(q ? { username: { contains: q } } : {})
    },
    orderBy: [{ createdAt: "desc" }],
    select: { id: true, username: true, role: true, createdAt: true, updatedAt: true }
  });

  return NextResponse.json({
    items: items.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString()
    }))
  });
}

const CreateBody = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(200),
  role: z.enum(["ADMIN", "EDITOR", "CSKH"]).default("EDITOR")
});

export async function POST(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const json = await req.json().catch(() => null);
  const parsed = CreateBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { username, password, role } = parsed.data;
  const passwordHash = await hashPassword(password);
  try {
    const created = await prisma.user.create({
      data: { username, passwordHash, role },
      select: { id: true }
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch {
    return NextResponse.json({ error: "username_taken" }, { status: 409 });
  }
}


