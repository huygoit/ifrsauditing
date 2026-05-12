import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

const Query = z.object({
  q: z.string().optional(),
  entity: z.string().max(60).optional()
});

export async function GET(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = Query.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });

  const q = (parsed.data.q ?? "").trim();
  const entity = (parsed.data.entity ?? "").trim();

  const items = await prisma.auditLog.findMany({
    where: {
      ...(entity ? { entity } : {}),
      ...(q
        ? {
            OR: [
              { entityId: { contains: q } },
              { action: { contains: q } },
              { summary: { contains: q } },
              { actor: { username: { contains: q } } }
            ]
          }
        : {})
    },
    orderBy: [{ createdAt: "desc" }],
    take: 200,
    include: { actor: { select: { id: true, username: true, role: true } } }
  });

  return NextResponse.json({
    items: items.map((a) => ({
      id: a.id,
      entity: a.entity,
      entityId: a.entityId,
      action: a.action,
      summary: a.summary,
      diffJson: a.diffJson,
      createdAt: a.createdAt.toISOString(),
      actor: a.actor
    }))
  });
}


