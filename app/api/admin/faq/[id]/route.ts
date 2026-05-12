import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { parseLang } from "@/lib/admin/lang";

const Params = z.object({
  id: z.coerce.number().int().min(1)
});

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const p = Params.safeParse(ctx.params);
  if (!p.success) return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  const id = p.data.id;

  const baseRows = (await prisma.$queryRaw`
    SELECT id, status, sortOrder, sectionKey, createdAt, updatedAt
    FROM faq
    WHERE id = ${id}
    LIMIT 1
  `) as Array<{
    id: number;
    status: "VISIBLE" | "HIDDEN";
    sortOrder: number;
    sectionKey: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;

  const base = baseRows[0];
  if (!base) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const trs = (await prisma.$queryRaw`
    SELECT lang, question, answer
    FROM faqtranslation
    WHERE faqId = ${id}
  `) as Array<{ lang: "vi" | "en"; question: string; answer: string }>;

  return NextResponse.json({
    item: {
      id: Number(base.id),
      status: base.status,
      sortOrder: Number(base.sortOrder ?? 0),
      sectionKey: base.sectionKey ?? null,
      createdAt: new Date(base.createdAt).toISOString(),
      updatedAt: new Date(base.updatedAt).toISOString(),
      translations: trs
    }
  });
}

const PatchBody = z
  .object({
    lang: z.enum(["vi", "en"]).optional(),
    status: z.enum(["VISIBLE", "HIDDEN"]).optional(),
    sortOrder: z.number().int().min(0).max(999999).optional(),
    sectionKey: z.string().trim().max(40).optional().nullable(),
    question: z.string().trim().min(3).max(180).optional(),
    answer: z.string().trim().min(10).max(5000).optional()
  })
  .refine((v) => (v.question || v.answer ? Boolean(v.question && v.answer && v.lang) : true), {
    message: "translation_requires_lang_question_answer"
  });

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const p = Params.safeParse(ctx.params);
  if (!p.success) return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  const id = p.data.id;

  const json = await req.json().catch(() => null);
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const lang = parsed.data.lang ? parseLang(parsed.data.lang) : null;

  await prisma.$transaction(async (tx) => {
    if (parsed.data.status !== undefined) {
      await tx.$executeRaw`UPDATE faq SET status = ${parsed.data.status}, updatedAt = CURRENT_TIMESTAMP(3) WHERE id = ${id}`;
    }
    if (parsed.data.sortOrder !== undefined) {
      await tx.$executeRaw`UPDATE faq SET sortOrder = ${parsed.data.sortOrder}, updatedAt = CURRENT_TIMESTAMP(3) WHERE id = ${id}`;
    }
    if (parsed.data.sectionKey !== undefined) {
      await tx.$executeRaw`UPDATE faq SET sectionKey = ${parsed.data.sectionKey}, updatedAt = CURRENT_TIMESTAMP(3) WHERE id = ${id}`;
    }

    if (lang && parsed.data.question && parsed.data.answer) {
      const trId = randomUUID();
      await tx.$executeRaw`
        INSERT INTO faqtranslation (id, faqId, lang, question, answer)
        VALUES (${trId}, ${id}, ${lang}, ${parsed.data.question}, ${parsed.data.answer})
        ON DUPLICATE KEY UPDATE
          question = VALUES(question),
          answer = VALUES(answer)
      `;
      await tx.$executeRaw`UPDATE faq SET updatedAt = CURRENT_TIMESTAMP(3) WHERE id = ${id}`;
    }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const p = Params.safeParse(ctx.params);
  if (!p.success) return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  const id = p.data.id;

  await prisma.$executeRaw`DELETE FROM faq WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}

