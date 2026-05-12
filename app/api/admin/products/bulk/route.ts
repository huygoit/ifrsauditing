import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

const Body = z.object({
  ids: z.array(z.string().min(1)).min(1),
  action: z.enum(["set_status_active", "set_status_inactive", "set_featured_true", "set_featured_false"])
});

export async function POST(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const ids = parsed.data.ids;
  if (parsed.data.action === "set_status_active" || parsed.data.action === "set_status_inactive") {
    const status = parsed.data.action === "set_status_active" ? "ACTIVE" : "INACTIVE";
    await prisma.product.updateMany({ where: { id: { in: ids } }, data: { status } });
    return NextResponse.json({ ok: true });
  }
  const featured = parsed.data.action === "set_featured_true";
  await prisma.product.updateMany({ where: { id: { in: ids } }, data: { featured } });
  return NextResponse.json({ ok: true });
}


