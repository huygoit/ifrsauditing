import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const item = await prisma.video.findUnique({
    where: { id },
    include: { translations: true }
  });
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item });
}

const PatchBody = z.object({
  lang: z.enum(["vi", "en"]),
  type: z.enum(["YOUTUBE", "MP4"]).optional(),
  src: z.string().min(1).max(1000).optional(),
  thumbnailSrc: z.string().min(1).max(500).optional(),
  duration: z.string().min(1).max(20).optional(),
  placement: z.enum(["VIDEO_PROOF", "HOW_TO_USE", "OTHER"]).optional(),
  status: z.enum(["PUBLISHED", "HIDDEN"]).optional(),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  title: z.string().min(1).max(200).optional(),
  caption: z.string().max(1000).optional()
});

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const json = await req.json().catch(() => null);
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, title, caption, ...base } = parsed.data;
  const exists = await prisma.video.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    if (Object.keys(base).length) {
      await tx.video.update({ where: { id }, data: base });
    }
    if (title !== undefined || caption !== undefined) {
      const t = await tx.videoTranslation.findUnique({
        where: { videoId_lang: { videoId: id, lang } }
      });
      if (t) {
        await tx.videoTranslation.update({
          where: { id: t.id },
          data: {
            ...(title !== undefined ? { title } : {}),
            ...(caption !== undefined ? { caption: caption || null } : {})
          }
        });
      } else {
        await tx.videoTranslation.create({
          data: { videoId: id, lang, title: title ?? "", caption: caption || null }
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}


