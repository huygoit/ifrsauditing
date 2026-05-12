import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const item = await prisma.partner.findUnique({
    where: { id },
    include: { translations: true }
  });
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item });
}

const PatchBody = z.object({
  lang: z.enum(["vi", "en"]),
  logoSrc: z.string().min(1).max(500).optional(),
  link: z.string().max(500).optional().nullable(),
  group: z.enum(["PARTNER", "DISTRIBUTOR", "CUSTOMER"]).optional(),
  status: z.enum(["PUBLISHED", "HIDDEN"]).optional(),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  // translation
  name: z.string().min(1).max(200).optional(),
  shortDesc: z.string().max(800).optional()
});

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const json = await req.json().catch(() => null);
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, name, shortDesc, link, ...base } = parsed.data;
  const exists = await prisma.partner.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    const baseKeys = Object.keys(base);
    if (baseKeys.length || link !== undefined) {
      await tx.partner.update({
        where: { id },
        data: {
          ...base,
          ...(link !== undefined ? { link: link ?? null } : {})
        }
      });
    }

    if (name !== undefined || shortDesc !== undefined) {
      const t = await tx.partnerTranslation.findUnique({
        where: { partnerId_lang: { partnerId: id, lang } }
      });
      if (t) {
        await tx.partnerTranslation.update({
          where: { id: t.id },
          data: {
            ...(name !== undefined ? { name } : {}),
            ...(shortDesc !== undefined ? { shortDesc: shortDesc || null } : {})
          }
        });
      } else {
        await tx.partnerTranslation.create({
          data: {
            partnerId: id,
            lang,
            name: name ?? "",
            shortDesc: shortDesc || null
          }
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}


