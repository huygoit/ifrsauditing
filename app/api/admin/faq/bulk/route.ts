import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

const Body = z.object({
  ids: z.array(z.coerce.number().int().min(1)).min(1),
  action: z.enum(["set_visible", "set_hidden", "delete"])
});

export async function POST(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const ids = parsed.data.ids;
  if (parsed.data.action === "delete") {
    await prisma.$executeRawUnsafe(`DELETE FROM faq WHERE id IN (${ids.map(() => "?").join(",")})`, ...ids);
    return NextResponse.json({ ok: true });
  }

  const status = parsed.data.action === "set_visible" ? "VISIBLE" : "HIDDEN";
  await prisma.$executeRawUnsafe(
    `UPDATE faq SET status = ?, updatedAt = CURRENT_TIMESTAMP(3) WHERE id IN (${ids.map(() => "?").join(",")})`,
    status,
    ...ids
  );

  return NextResponse.json({ ok: true });
}

