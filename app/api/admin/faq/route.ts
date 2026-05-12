import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { parseLang } from "@/lib/admin/lang";

const Query = z.object({
  lang: z.enum(["vi", "en"]).optional(),
  q: z.string().optional(),
  status: z.enum(["VISIBLE", "HIDDEN"]).optional(),
  sectionKey: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).optional()
});

export async function GET(req: NextRequest) {
  try {
    const { response } = await requireAdminSession(req);
    if (response) return response;

    const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
    const parsed = Query.safeParse(sp);
    if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });

    const lang = parseLang(parsed.data.lang);
    const q = (parsed.data.q ?? "").trim();
    const status = parsed.data.status ?? null;
    const sectionKey = (parsed.data.sectionKey ?? "").trim() || null;
    const page = parsed.data.page ?? 1;
    const pageSize = parsed.data.pageSize ?? 50;

    const like = q ? `%${q}%` : null;
    const offset = (page - 1) * pageSize;

    const rows = (await prisma.$queryRaw`
      SELECT
        f.id,
        f.status,
        f.sortOrder,
        f.sectionKey,
        f.createdAt,
        f.updatedAt,
        tl.question AS question_lang,
        tl.answer AS answer_lang,
        tv.question AS question_vi,
        tv.answer AS answer_vi
      FROM faq f
      LEFT JOIN faqtranslation tl
        ON tl.faqId = f.id AND tl.lang = ${lang}
      LEFT JOIN faqtranslation tv
        ON tv.faqId = f.id AND tv.lang = 'vi'
      WHERE
        (${status} IS NULL OR f.status = ${status})
        AND (${sectionKey} IS NULL OR f.sectionKey = ${sectionKey})
        AND (
          ${like} IS NULL OR (
            tl.question LIKE ${like}
            OR tv.question LIKE ${like}
          )
        )
      ORDER BY f.sortOrder ASC, f.updatedAt DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `) as Array<{
      id: number;
      status: "VISIBLE" | "HIDDEN";
      sortOrder: number;
      sectionKey: string | null;
      createdAt: Date;
      updatedAt: Date;
      question_lang: string | null;
      answer_lang: string | null;
      question_vi: string | null;
      answer_vi: string | null;
    }>;

    const items = rows.map((r) => {
      const hasLocale = Boolean(r.question_lang);
      const hasVi = Boolean(r.question_vi);
      const question = (hasLocale ? r.question_lang : r.question_vi) ?? "";
      const answer = (hasLocale ? r.answer_lang : r.answer_vi) ?? "";
      return {
        id: Number(r.id),
        status: r.status,
        sortOrder: Number(r.sortOrder ?? 0),
        sectionKey: r.sectionKey ?? null,
        createdAt: new Date(r.createdAt).toISOString(),
        updatedAt: new Date(r.updatedAt).toISOString(),
        translation: { lang: hasLocale ? lang : "vi", question, answer },
        meta: {
          missingLang: lang === "en" ? !hasLocale : false,
          hasVi
        }
      };
    });

    return NextResponse.json({ items, page, pageSize });
  } catch (e: unknown) {
    const detail = process.env.NODE_ENV !== "production" ? String((e as any)?.message ?? e) : undefined;
    return NextResponse.json({ error: "server_error", detail }, { status: 500 });
  }
}

const CreateBody = z.object({
  lang: z.enum(["vi", "en"]),
  question: z.string().trim().min(3).max(180),
  answer: z.string().trim().min(10).max(5000),
  sectionKey: z.string().trim().max(40).optional().nullable(),
  status: z.enum(["VISIBLE", "HIDDEN"]).optional().default("VISIBLE"),
  sortOrder: z.number().int().min(0).max(999999).optional()
});

export async function POST(req: NextRequest) {
  try {
    const { response } = await requireAdminSession(req);
    if (response) return response;

    const json = await req.json().catch(() => null);
    const parsed = CreateBody.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

    const { lang, question, answer, sectionKey, status, sortOrder } = parsed.data;
    const nextSectionKey = sectionKey ? sectionKey.trim() : null;

    const result = await prisma.$transaction(async (tx) => {
      const maxRows = (await tx.$queryRaw`
        SELECT MAX(sortOrder) AS maxSortOrder FROM faq
      `) as Array<{ maxSortOrder: number | null }>;
      const maxSort = Number(maxRows?.[0]?.maxSortOrder ?? 0);
      const nextSort = sortOrder ?? maxSort + 10;

      await tx.$executeRaw`
        INSERT INTO faq (status, sortOrder, sectionKey, createdAt, updatedAt)
        VALUES (${status}, ${nextSort}, ${nextSectionKey}, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
      `;

      const idRows = (await tx.$queryRaw`SELECT LAST_INSERT_ID() AS id`) as Array<{ id: number }>;
      const faqId = Number(idRows?.[0]?.id ?? 0);
      if (!faqId) throw new Error("faq_create_failed");

      const trId = randomUUID();
      await tx.$executeRaw`
        INSERT INTO faqtranslation (id, faqId, lang, question, answer)
        VALUES (${trId}, ${faqId}, ${lang}, ${question}, ${answer})
      `;

      return faqId;
    });

    return NextResponse.json({ ok: true, id: result });
  } catch (e: unknown) {
    const detail = process.env.NODE_ENV !== "production" ? String((e as any)?.message ?? e) : undefined;
    return NextResponse.json({ error: "server_error", detail }, { status: 500 });
  }
}

