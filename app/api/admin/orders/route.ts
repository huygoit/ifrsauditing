import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

const Query = z.object({
  q: z.string().optional(),
  status: z.enum(["NEW", "CALLING", "CONFIRMED", "CANCELED"]).optional()
});

export async function GET(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = Query.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });

  const q = (parsed.data.q ?? "").trim();
  const status = parsed.data.status ?? undefined;

  const setting = await prisma.setting.findUnique({ where: { id: "default" }, select: { ordersEnabled: true } });

  const items = await prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { phone: { contains: q } },
              { address: { contains: q } }
            ]
          }
        : {})
    },
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      phone: true,
      address: true,
      quantity: true,
      note: true,
      status: true,
      internalNote: true,
      createdAt: true,
      productId: true,
      comboId: true
    }
  });

  return NextResponse.json({
    ordersEnabled: setting?.ordersEnabled ?? true,
    items: items.map((o) => ({ ...o, createdAt: o.createdAt.toISOString() }))
  });
}


