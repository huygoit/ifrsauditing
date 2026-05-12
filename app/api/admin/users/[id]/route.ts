import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { hashPassword } from "@/lib/admin/auth";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const item = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, role: true, createdAt: true, updatedAt: true }
  });
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({
    item: { ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() }
  });
}

const PatchBody = z.object({
  role: z.enum(["ADMIN", "EDITOR", "CSKH"]).optional(),
  password: z.string().min(8).max(200).optional()
});

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const json = await req.json().catch(() => null);
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const passwordHash = parsed.data.password ? await hashPassword(parsed.data.password) : undefined;

  await prisma.user.update({
    where: { id },
    data: {
      ...(parsed.data.role ? { role: parsed.data.role } : {}),
      ...(passwordHash ? { passwordHash } : {})
    }
  });

  return NextResponse.json({ ok: true });
}


