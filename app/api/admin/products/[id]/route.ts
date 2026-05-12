import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const item = await prisma.product.findUnique({
    where: { id },
    include: {
      translations: true,
      images: { orderBy: { sortOrder: "asc" } }
    }
  });
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item });
}

const PatchBody = z.object({
  lang: z.enum(["vi", "en"]),
  categoryId: z.string().min(1).optional(),
  priceVnd: z.number().int().min(0).max(999999999).optional(),
  salePriceVnd: z.number().int().min(0).max(999999999).optional().nullable(),
  sizeTag: z.string().min(1).max(80).optional(),
  badges: z.array(z.string().min(1).max(40)).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  thumbnailSrc: z.string().min(1).max(500).optional(),
  // translation fields
  name: z.string().min(1).max(160).optional(),
  shortDesc: z.string().max(400).optional(),
  descriptionJson: z.record(z.any()).nullable().optional(),
  descriptionMarkdown: z.string().max(50000).optional().nullable()
});

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const json = await req.json().catch(() => null);
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, name, shortDesc, descriptionJson, descriptionMarkdown, badges, salePriceVnd, ...base } = parsed.data;

  const exists = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    const baseKeys = Object.keys(base);
    if (baseKeys.length || badges !== undefined || salePriceVnd !== undefined) {
      await tx.product.update({
        where: { id },
        data: {
          ...base,
          ...(badges !== undefined ? { badges } : {}),
          ...(salePriceVnd !== undefined ? { salePriceVnd: salePriceVnd ?? null } : {})
        }
      });
    }

    if (
      name !== undefined ||
      shortDesc !== undefined ||
      descriptionJson !== undefined ||
      descriptionMarkdown !== undefined
    ) {
      const t = await tx.productTranslation.findUnique({
        where: { productId_lang: { productId: id, lang } }
      });
      const trData = {
        ...(name !== undefined ? { name } : {}),
        ...(shortDesc !== undefined ? { shortDesc: shortDesc || null } : {}),
        ...(descriptionJson !== undefined
          ? { descriptionJson: descriptionJson === null ? Prisma.JsonNull : descriptionJson }
          : {}),
        ...(descriptionMarkdown !== undefined ? { descriptionMarkdown: descriptionMarkdown ?? null } : {})
      };
      if (Object.keys(trData).length > 0) {
        if (t) {
          await tx.productTranslation.update({
            where: { id: t.id },
            data: trData
          });
        } else {
          await tx.productTranslation.create({
            data: {
              productId: id,
              lang,
              name: name ?? "",
              shortDesc: shortDesc ?? null,
              descriptionJson: descriptionJson === null || descriptionJson === undefined ? Prisma.JsonNull : descriptionJson,
              descriptionMarkdown: descriptionMarkdown ?? null
            }
          });
        }
      }
    }
  });

  return NextResponse.json({ ok: true });
}


