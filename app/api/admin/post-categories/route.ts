import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { parseLang } from "@/lib/admin/lang";
import { slugifyAscii } from "@/lib/slug";

const Query = z.object({
  lang: z.enum(["vi", "en"]).optional(),
  q: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

function isDuplicateSlugError(e: unknown) {
  const msg = String((e as any)?.message ?? "");
  return msg.includes("Duplicate entry") && msg.includes("PostCategoryTranslation_lang_slug_key");
}

async function suggestUniqueSlug(lang: "vi" | "en", baseSlug: string) {
  const rows = (await prisma.$queryRaw`
    SELECT slug
    FROM postcategorytranslation
    WHERE lang = ${lang} AND slug LIKE ${baseSlug + "%"}
  `) as Array<{ slug: string }>;

  const used = new Set(rows.map((r) => r.slug));
  if (!used.has(baseSlug)) return baseSlug;

  let maxN = 1;
  for (const s of used) {
    const m = s.match(new RegExp(`^${baseSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-([0-9]+)$`));
    if (m?.[1]) maxN = Math.max(maxN, Number(m[1]) || 1);
  }
  return `${baseSlug}-${maxN + 1}`;
}

export async function GET(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = Query.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });

  const lang = parseLang(parsed.data.lang);
  const q = (parsed.data.q ?? "").trim();
  const status = parsed.data.status ?? undefined;

  const like = q ? `%${q}%` : null;
  const rows = (await prisma.$queryRaw`
    SELECT
      pc.id, pc.status, pc.sortOrder, pc.createdAt, pc.updatedAt,
      tl.name AS name_lang, tl.slug AS slug_lang, tl.description AS description_lang, tl.seoTitle AS seoTitle_lang, tl.seoDesc AS seoDesc_lang,
      tv.name AS name_vi,   tv.slug AS slug_vi,   tv.description AS description_vi,   tv.seoTitle AS seoTitle_vi,   tv.seoDesc AS seoDesc_vi
    FROM postcategory pc
    LEFT JOIN postcategorytranslation tl
      ON tl.postCategoryId = pc.id AND tl.lang = ${lang}
    LEFT JOIN postcategorytranslation tv
      ON tv.postCategoryId = pc.id AND tv.lang = 'vi'
    WHERE
      (${status} IS NULL OR pc.status = ${status})
      AND (
        ${like} IS NULL OR (
          tl.name LIKE ${like} OR tl.slug LIKE ${like} OR tl.description LIKE ${like}
          OR tv.name LIKE ${like} OR tv.slug LIKE ${like} OR tv.description LIKE ${like}
        )
      )
    ORDER BY pc.sortOrder ASC, pc.createdAt DESC
  `) as Array<{
    id: string;
    status: "ACTIVE" | "INACTIVE" | string;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    name_lang: string | null;
    slug_lang: string | null;
    description_lang: string | null;
    seoTitle_lang: string | null;
    seoDesc_lang: string | null;
    name_vi: string | null;
    slug_vi: string | null;
    description_vi: string | null;
    seoTitle_vi: string | null;
    seoDesc_vi: string | null;
  }>;

  return NextResponse.json({
    items: rows.map((r) => {
      const hasLang = Boolean(r.name_lang || r.slug_lang || r.description_lang || r.seoTitle_lang || r.seoDesc_lang);
      const hasVi = Boolean(r.name_vi || r.slug_vi || r.description_vi || r.seoTitle_vi || r.seoDesc_vi);
      const translation =
        hasLang
          ? {
              lang,
              name: r.name_lang ?? "",
              slug: r.slug_lang ?? "",
              description: r.description_lang ?? "",
              seoTitle: r.seoTitle_lang ?? "",
              seoDesc: r.seoDesc_lang ?? ""
            }
          : lang === "en" && hasVi
            ? {
                lang: "vi",
                name: r.name_vi ?? "",
                slug: r.slug_vi ?? "",
                description: r.description_vi ?? "",
                seoTitle: r.seoTitle_vi ?? "",
                seoDesc: r.seoDesc_vi ?? ""
              }
            : { lang, name: "", slug: "", description: "", seoTitle: "", seoDesc: "" };

      return {
        id: r.id,
        status: r.status,
        sortOrder: r.sortOrder,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        translation,
        meta: { missingLang: lang === "en" ? !hasLang : false, hasVi }
      };
    })
  });
}

const CreateBody = z.object({
  lang: z.enum(["vi", "en"]),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  name: z.string().min(1).max(160),
  slug: z.string().max(160).optional(),
  description: z.string().max(20000).optional(),
  seoTitle: z.string().max(200).optional(),
  seoDesc: z.string().max(20000).optional()
});

export async function POST(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const json = await req.json().catch(() => null);
  const parsed = CreateBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, status, sortOrder, name, slug, description, seoTitle, seoDesc } = parsed.data;
  const baseSlug = slugifyAscii(slug?.trim() || name);
  if (!baseSlug) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const maxRow = (await prisma.$queryRaw`SELECT MAX(sortOrder) AS maxSort FROM postcategory`) as Array<{ maxSort: number | null }>;
  const nextSort = sortOrder ?? (((maxRow?.[0]?.maxSort ?? 0) as number) + 10);

  const id = randomUUID();
  const tid = randomUUID();

  try {
    await prisma.$transaction([
      prisma.$executeRaw`
        INSERT INTO postcategory (id, status, sortOrder, createdAt, updatedAt)
        VALUES (${id}, ${status}, ${nextSort}, NOW(3), NOW(3))
      `,
      prisma.$executeRaw`
        INSERT INTO postcategorytranslation (id, postCategoryId, lang, name, slug, description, seoTitle, seoDesc)
        VALUES (
          ${tid},
          ${id},
          ${lang},
          ${name},
          ${baseSlug},
          ${description?.trim() ? description.trim() : null},
          ${seoTitle?.trim() ? seoTitle.trim() : null},
          ${seoDesc?.trim() ? seoDesc.trim() : null}
        )
      `
    ]);
    return NextResponse.json({ ok: true, id });
  } catch (e: unknown) {
    if (isDuplicateSlugError(e)) {
      const suggestion = await suggestUniqueSlug(lang, baseSlug);
      return NextResponse.json({ error: "slug_conflict", suggestion }, { status: 409 });
    }
    console.error("[admin/post-categories][POST] create failed", e);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        { error: "server_error", detail: e instanceof Error ? e.message : String(e) },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

