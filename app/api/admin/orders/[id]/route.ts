import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const item = await prisma.order.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item: { ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() } });
}

const PatchBody = z.object({
  status: z.enum(["NEW", "CALLING", "CONFIRMED", "CANCELED"]).optional(),
  internalNote: z.string().max(2000).optional().nullable()
});

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const json = await req.json().catch(() => null);
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const exists = await prisma.order.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.order.update({
    where: { id },
    data: {
      ...(parsed.data.status ? { status: parsed.data.status } : {}),
      ...(parsed.data.internalNote !== undefined ? { internalNote: parsed.data.internalNote || null } : {})
    }
  });

  return NextResponse.json({ ok: true });
}


