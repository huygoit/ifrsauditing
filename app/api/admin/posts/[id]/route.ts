import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { slugifyAscii } from "@/lib/slug";

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

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const item = await prisma.post.findUnique({
    where: { id },
    include: { translations: true }
  });
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Prisma client may not include the new `contentJson` column without regenerate on Windows.
  // Fetch JSON separately and merge into translations.
  const jsonRows = (await prisma.$queryRaw`
    SELECT postId, lang, contentJson
    FROM posttranslation
    WHERE postId = ${id}
  `) as Array<{ lang: "vi" | "en"; contentJson: any }>;
  const byLang = new Map(jsonRows.map((r) => [r.lang, r.contentJson]));

  const merged = {
    ...item,
    translations: item.translations.map((t: any) => ({ ...t, contentJson: byLang.get(t.lang) ?? null }))
  };

  return NextResponse.json({ item: merged });
}

const PatchBody = z.object({
  lang: z.enum(["vi", "en"]),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).optional(),
  publishedAt: z.string().optional().nullable(),
  postCategoryId: z.string().max(191).optional().nullable(),
  coverImage: z.string().max(500).optional().nullable(),
  author: z.string().max(120).optional().nullable(),
  tags: z.array(z.string().min(1).max(40)).optional(),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  // translation
  slug: z.string().min(1).max(160).optional(),
  title: z.string().min(1).max(200).optional(),
  excerpt: z.string().max(20000).optional(),
  contentMarkdown: z.string().max(200000).optional(),
  contentJson: z.any().optional().nullable(),
  seoTitle: z.string().max(200).optional(),
  seoDesc: z.string().max(500).optional()
});

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const json = await req.json().catch(() => null);
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, slug, title, excerpt, contentMarkdown, contentJson, seoTitle, seoDesc, postCategoryId, publishedAt, ...base } = parsed.data;
  const exists = await prisma.post.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const pub = publishedAt !== undefined ? (publishedAt ? new Date(publishedAt) : null) : undefined;
  const normalizedSlug = slug !== undefined ? slugifyAscii(slug) : undefined;
  const baseForSuggestion = (normalizedSlug ?? (title ? slugifyAscii(title) : "")).trim();

  try {
    await prisma.$transaction(async (tx) => {
      const baseKeys = Object.keys(base);
      if (baseKeys.length || publishedAt !== undefined) {
        await tx.post.update({
          where: { id },
          data: ({
            ...base,
            ...(publishedAt !== undefined
              ? { publishedAt: pub && pub instanceof Date && !isNaN(pub.valueOf()) ? pub : null }
              : {})
          } as any)
        });
      }

      // Prisma Client on Windows may be out of date (no `postCategoryId` field).
      // Update via raw SQL to avoid runtime "Unknown argument" errors.
      if (postCategoryId !== undefined) {
        await tx.$executeRaw`
          UPDATE post
          SET postCategoryId = ${postCategoryId || null}, updatedAt = CURRENT_TIMESTAMP(3)
          WHERE id = ${id}
        `;
      }

      if (
        slug !== undefined ||
        title !== undefined ||
        excerpt !== undefined ||
        contentMarkdown !== undefined ||
        contentJson !== undefined ||
        seoTitle !== undefined ||
        seoDesc !== undefined
      ) {
        const t = await tx.postTranslation.findUnique({
          where: { postId_lang: { postId: id, lang } }
        });
        if (t) {
          await tx.postTranslation.update({
            where: { id: t.id },
            data: {
              ...(normalizedSlug !== undefined ? { slug: normalizedSlug } : {}),
              ...(title !== undefined ? { title } : {}),
              ...(excerpt !== undefined ? { excerpt: excerpt || null } : {}),
              ...(contentMarkdown !== undefined ? { contentMarkdown: contentMarkdown || null } : {}),
              ...(seoTitle !== undefined ? { seoTitle: seoTitle || null } : {}),
              ...(seoDesc !== undefined ? { seoDesc: seoDesc || null } : {})
            }
          });
          if (contentJson !== undefined) {
            await tx.$executeRaw`UPDATE posttranslation SET contentJson = ${contentJson} WHERE id = ${t.id}`;
          }
        } else {
          const created = await tx.postTranslation.create({
            data: {
              postId: id,
              lang,
              slug: normalizedSlug ?? slugifyAscii(title ?? ""),
              title: title ?? "",
              excerpt: excerpt || null,
              contentMarkdown: contentMarkdown || null,
              seoTitle: seoTitle || null,
              seoDesc: seoDesc || null
            },
            select: { id: true }
          });
          if (contentJson !== undefined) {
            await tx.$executeRaw`UPDATE posttranslation SET contentJson = ${contentJson} WHERE id = ${created.id}`;
          }
        }
      }
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const code = (e as any)?.code as string | undefined;
    if (code === "P2002" || (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) {
      const suggestion = baseForSuggestion ? await suggestUniqueSlug(lang, baseForSuggestion) : undefined;
      return NextResponse.json({ error: "slug_conflict", suggestion }, { status: 409 });
    }

    console.error("[admin/posts/[id]][PATCH] update failed", e);
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


