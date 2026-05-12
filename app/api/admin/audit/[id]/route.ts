import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const item = await prisma.auditLog.findUnique({
    where: { id },
    include: { actor: { select: { id: true, username: true, role: true } } }
  });
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({
    item: {
      id: item.id,
      entity: item.entity,
      entityId: item.entityId,
      action: item.action,
      summary: item.summary,
      diffJson: item.diffJson,
      createdAt: item.createdAt.toISOString(),
      actor: item.actor
    }
  });
}


