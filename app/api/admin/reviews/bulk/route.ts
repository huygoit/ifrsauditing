import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

const Body = z.object({
  ids: z.array(z.string().min(1)).min(1),
  action: z.enum(["approve", "hide", "set_pending"])
});

export async function POST(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const status = parsed.data.action === "approve" ? "APPROVED" : parsed.data.action === "hide" ? "HIDDEN" : "PENDING";
  await prisma.review.updateMany({ where: { id: { in: parsed.data.ids } }, data: { status } });
  return NextResponse.json({ ok: true });
}


