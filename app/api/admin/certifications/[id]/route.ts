import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const item = await prisma.certification.findUnique({
    where: { id },
    include: { translations: true }
  });
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item });
}

const PatchBody = z.object({
  lang: z.enum(["vi", "en"]),
  type: z.enum(["CERTIFICATION", "AWARD"]).optional(),
  logoSrc: z.string().min(1).max(500).optional(),
  certificateImageSrc: z.string().max(500).optional().nullable(),
  issuedDate: z.string().optional().nullable(),
  issuer: z.string().max(160).optional().nullable(),
  status: z.enum(["PUBLISHED", "HIDDEN"]).optional(),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  // translation
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  note: z.string().max(2000).optional()
});

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const json = await req.json().catch(() => null);
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, title, description, note, issuedDate, certificateImageSrc, issuer, ...base } = parsed.data;
  const exists = await prisma.certification.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    const baseKeys = Object.keys(base);
    if (
      baseKeys.length ||
      issuedDate !== undefined ||
      certificateImageSrc !== undefined ||
      issuer !== undefined
    ) {
      const issued = issuedDate ? new Date(issuedDate) : null;
      await tx.certification.update({
        where: { id },
        data: {
          ...base,
          ...(certificateImageSrc !== undefined ? { certificateImageSrc: certificateImageSrc ?? null } : {}),
          ...(issuer !== undefined ? { issuer: issuer ?? null } : {}),
          ...(issuedDate !== undefined ? { issuedDate: issued && !isNaN(issued.valueOf()) ? issued : null } : {})
        }
      });
    }

    if (title !== undefined || description !== undefined || note !== undefined) {
      const t = await tx.certificationTranslation.findUnique({
        where: { certificationId_lang: { certificationId: id, lang } }
      });
      if (t) {
        await tx.certificationTranslation.update({
          where: { id: t.id },
          data: {
            ...(title !== undefined ? { title } : {}),
            ...(description !== undefined ? { description: description || null } : {}),
            ...(note !== undefined ? { note: note || null } : {})
          }
        });
      } else {
        await tx.certificationTranslation.create({
          data: {
            certificationId: id,
            lang,
            title: title ?? "",
            description: description || null,
            note: note || null
          }
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}


