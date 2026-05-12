import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;
  const id = ctx.params.id;
  const item = await prisma.review.findUnique({
    where: { id },
    include: { translations: true }
  });
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item });
}

const PatchBody = z.object({
  lang: z.enum(["vi", "en"]),
  rating: z.number().int().min(1).max(5).optional(),
  location: z.string().max(120).optional().nullable(),
  avatar: z.string().max(500).optional().nullable(),
  images: z.array(z.string().min(1).max(500)).optional(),
  status: z.enum(["PENDING", "APPROVED", "HIDDEN"]).optional(),
  name: z.string().min(1).max(120).optional(),
  content: z.string().min(1).max(2000).optional()
});

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const json = await req.json().catch(() => null);
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, name, content, images, ...base } = parsed.data;
  const exists = await prisma.review.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    if (Object.keys(base).length || images !== undefined) {
      await tx.review.update({
        where: { id },
        data: { ...base, ...(images !== undefined ? { images } : {}) }
      });
    }
    if (name !== undefined || content !== undefined) {
      const t = await tx.reviewTranslation.findUnique({ where: { reviewId_lang: { reviewId: id, lang } } });
      if (t) {
        await tx.reviewTranslation.update({
          where: { id: t.id },
          data: { ...(name !== undefined ? { name } : {}), ...(content !== undefined ? { content } : {}) }
        });
      } else {
        await tx.reviewTranslation.create({
          data: { reviewId: id, lang, name: name ?? "", content: content ?? "" }
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}


