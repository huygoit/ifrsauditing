import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const base = (await prisma.$queryRawUnsafe(
    `SELECT id, image, link, status, sortOrder, createdAt, updatedAt FROM slide WHERE id = ?`,
    id
  )) as any[];
  if (!base.length) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const translations = (await prisma.$queryRawUnsafe(
    `SELECT lang, eyebrow, title, \`desc\`, alt FROM slidetranslation WHERE slideId = ?`,
    id
  )) as any[];

  return NextResponse.json({ item: { ...base[0], sortOrder: Number(base[0].sortOrder), translations } });
}

const PatchBody = z.object({
  lang: z.enum(["vi", "en"]),
  image: z.string().min(1).max(500).optional(),
  link: z.string().max(500).optional().nullable(),
  status: z.enum(["PUBLISHED", "HIDDEN"]).optional(),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  eyebrow: z.string().max(200).optional(),
  title: z.string().min(1).max(200).optional(),
  desc: z.string().max(800).optional(),
  alt: z.string().max(200).optional()
});

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const json = await req.json().catch(() => null);
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const exists = (await prisma.$queryRawUnsafe(`SELECT id FROM slide WHERE id = ?`, id)) as any[];
  if (!exists.length) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { lang, image, link, status, sortOrder, eyebrow, title, desc, alt } = parsed.data;

  const sets: string[] = [];
  const params: unknown[] = [];
  if (image !== undefined) {
    sets.push("image = ?");
    params.push(image);
  }
  if (link !== undefined) {
    sets.push("link = ?");
    params.push(link ?? null);
  }
  if (status !== undefined) {
    sets.push("status = ?");
    params.push(status);
  }
  if (sortOrder !== undefined) {
    sets.push("sortOrder = ?");
    params.push(sortOrder);
  }
  if (sets.length) {
    sets.push("updatedAt = NOW(3)");
    params.push(id);
    await prisma.$executeRawUnsafe(`UPDATE slide SET ${sets.join(", ")} WHERE id = ?`, ...params);
  }

  if (eyebrow !== undefined || title !== undefined || desc !== undefined || alt !== undefined) {
    const tr = (await prisma.$queryRawUnsafe(
      `SELECT id FROM slidetranslation WHERE slideId = ? AND lang = ?`,
      id,
      lang
    )) as any[];
    if (tr.length) {
      const tSets: string[] = [];
      const tParams: unknown[] = [];
      if (eyebrow !== undefined) {
        tSets.push("eyebrow = ?");
        tParams.push(eyebrow || null);
      }
      if (title !== undefined) {
        tSets.push("title = ?");
        tParams.push(title);
      }
      if (desc !== undefined) {
        tSets.push("`desc` = ?");
        tParams.push(desc || null);
      }
      if (alt !== undefined) {
        tSets.push("alt = ?");
        tParams.push(alt || null);
      }
      if (tSets.length) {
        tParams.push(tr[0].id);
        await prisma.$executeRawUnsafe(`UPDATE slidetranslation SET ${tSets.join(", ")} WHERE id = ?`, ...tParams);
      }
    } else {
      await prisma.$executeRawUnsafe(
        `INSERT INTO slidetranslation (id, slideId, lang, eyebrow, title, \`desc\`, alt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        randomUUID(),
        id,
        lang,
        eyebrow || null,
        title ?? "",
        desc || null,
        alt || null
      );
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  await prisma.$executeRawUnsafe(`DELETE FROM slide WHERE id = ?`, id);
  return NextResponse.json({ ok: true });
}
