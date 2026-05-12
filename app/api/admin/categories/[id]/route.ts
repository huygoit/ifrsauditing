import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const item = await prisma.category.findUnique({
    where: { id },
    include: { translations: true }
  });
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item });
}

const PatchBody = z.object({
  lang: z.enum(["vi", "en"]),
  iconKey: z.string().min(1).max(64).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  name: z.string().min(1).max(160).optional(),
  description: z.string().max(1000).optional()
});

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const json = await req.json().catch(() => null);
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, iconKey, status, sortOrder, name, description } = parsed.data;

  const exists = await prisma.category.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    if (iconKey || status || typeof sortOrder === "number") {
      await tx.category.update({
        where: { id },
        data: {
          ...(iconKey ? { iconKey } : {}),
          ...(status ? { status } : {}),
          ...(typeof sortOrder === "number" ? { sortOrder } : {})
        }
      });
    }

    if (name !== undefined || description !== undefined) {
      const t = await tx.categoryTranslation.findUnique({
        where: { categoryId_lang: { categoryId: id, lang } }
      });
      if (t) {
        await tx.categoryTranslation.update({
          where: { id: t.id },
          data: {
            ...(name !== undefined ? { name } : {}),
            ...(description !== undefined ? { description: description || null } : {})
          }
        });
      } else {
        await tx.categoryTranslation.create({
          data: {
            categoryId: id,
            lang,
            name: name ?? "",
            description: description || null
          }
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}


