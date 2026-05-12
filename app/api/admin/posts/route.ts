import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { parseLang } from "@/lib/admin/lang";
import { slugifyAscii } from "@/lib/slug";

const Query = z.object({
  lang: z.enum(["vi", "en"]).optional(),
  q: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).optional()
});

export async function GET(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = Query.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });

  const lang = parseLang(parsed.data.lang);
  const q = (parsed.data.q ?? "").trim();
  const status = parsed.data.status ?? undefined;

  const items = await prisma.post.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            translations: {
              some: { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }, { slug: { contains: q } }] }
            }
          }
        : {})
    },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    include: {
      translations: { where: { lang }, select: { title: true, excerpt: true, slug: true } }
    }
  });

  const needsViFallback = lang === "en" && items.some((p) => p.translations.length === 0);
  const viById = needsViFallback
    ? new Map(
        (
          await prisma.postTranslation.findMany({
            where: { postId: { in: items.map((x) => x.id) }, lang: "vi" },
            select: { postId: true, title: true, excerpt: true, slug: true }
          })
        ).map((t) => [t.postId, t])
      )
    : null;

  return NextResponse.json({
    items: items.map((p) => {
      const t = p.translations[0] ?? null;
      const vi = viById?.get(p.id) ?? null;
      return {
        id: p.id,
        postCategoryId: (p as any).postCategoryId ?? null,
        coverImage: p.coverImage,
        author: p.author,
        publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
        status: p.status,
        tags: Array.isArray(p.tags) ? (p.tags as any[]) : p.tags ? [p.tags] : [],
        sortOrder: p.sortOrder,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        translation: t
          ? { lang, title: t.title, excerpt: t.excerpt ?? "", slug: t.slug }
          : vi
            ? { lang: "vi", title: vi.title, excerpt: vi.excerpt ?? "", slug: vi.slug }
            : { lang, title: "", excerpt: "", slug: "" },
        meta: { missingLang: lang === "en" ? !t : false }
      };
    })
  });
}

const CreateBody = z.object({
  lang: z.enum(["vi", "en"]),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).default("DRAFT"),
  publishedAt: z.string().optional().nullable(),
  postCategoryId: z.string().max(191).optional().nullable(),
  coverImage: z.string().max(500).optional().nullable(),
  author: z.string().max(120).optional().nullable(),
  tags: z.array(z.string().min(1).max(40)).optional(),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  // translation
  slug: z.string().min(1).max(160),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(20000).optional(),
  contentMarkdown: z.string().max(200000).optional(),
  contentJson: z.any().optional().nullable(),
  seoTitle: z.string().max(200).optional(),
  seoDesc: z.string().max(500).optional()
});

async function suggestUniqueSlug(lang: "vi" | "en", baseSlug: string) {
  const rows = await prisma.postTranslation.findMany({
    where: { lang, slug: { startsWith: baseSlug } },
    select: { slug: true }
  });

  const used = new Set(rows.map((r) => r.slug));
  if (!used.has(baseSlug)) return baseSlug;

  let maxN = 1;
  for (const s of used) {
    const m = s.match(new RegExp(`^${baseSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-([0-9]+)$`));
    if (m?.[1]) maxN = Math.max(maxN, Number(m[1]) || 1);
  }
  return `${baseSlug}-${maxN + 1}`;
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const json = await req.json().catch(() => null);
  const parsed = CreateBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const {
    lang,
    status,
    publishedAt,
    postCategoryId,
    coverImage,
    author,
    tags,
    sortOrder,
    slug,
    title,
    excerpt,
    contentMarkdown,
    contentJson,
    seoTitle,
    seoDesc
  } = parsed.data;

  const normalizedSlug = slugifyAscii(slug);
  const max = await prisma.post.aggregate({ _max: { sortOrder: true } });
  const nextSort = sortOrder ?? ((max._max.sortOrder ?? 0) + 10);
  const pub = publishedAt ? new Date(publishedAt) : null;

  try {
    const created = await prisma.post.create({
      data: {
        status,
        publishedAt: pub && !isNaN(pub.valueOf()) ? pub : null,
        coverImage: coverImage ?? null,
        author: author ?? null,
        tags: tags ?? [],
        sortOrder: nextSort,
        translations: {
          create: {
            lang,
            slug: normalizedSlug,
            title,
            excerpt: excerpt ?? null,
            contentMarkdown: contentMarkdown ?? null,
            seoTitle: seoTitle ?? null,
            seoDesc: seoDesc ?? null
          }
        }
      },
      select: { id: true }
    });
    if (postCategoryId !== undefined) {
      await prisma.$executeRaw`
        UPDATE post
        SET postCategoryId = ${postCategoryId || null}, updatedAt = CURRENT_TIMESTAMP(3)
        WHERE id = ${created.id}
      `;
    }
    if (contentJson !== undefined) {
      await prisma.$executeRaw`
        UPDATE posttranslation
        SET contentJson = ${contentJson}
        WHERE postId = ${created.id} AND lang = ${lang}
      `;
    }
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e: unknown) {
    // NOTE: avoid relying only on `instanceof` here since Next bundling can
    // cause multiple Prisma copies and break instanceof checks.
    const code = (e as any)?.code as string | undefined;
    if (code === "P2002" || (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) {
      const suggestion = await suggestUniqueSlug(lang, normalizedSlug);
      return NextResponse.json({ error: "slug_conflict", suggestion }, { status: 409 });
    }

    // Surface details in dev to speed up debugging.
    console.error("[admin/posts][POST] create failed", e);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        {
          error: "server_error",
          detail: e instanceof Error ? e.message : String(e)
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}


