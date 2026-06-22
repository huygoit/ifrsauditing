import { prisma } from "@/lib/db";
import type { SiteContentLocale } from "@/lib/siteContent/getSiteContentDetail";

export type SiteContentCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  category: { slug: string; name: string } | null;
};

/**
 * Danh sách nội dung website theo danh mục (vd: "dich-vu").
 * Bản dịch theo `locale`, thiếu thì fallback sang VI. Chỉ lấy bài PUBLISHED đã đến hạn đăng.
 */
export async function getSiteContents(
  locale: SiteContentLocale,
  opts: { categorySlug: string; limit?: number }
): Promise<SiteContentCard[]> {
  const now = new Date();
  const limit = Math.max(1, Math.min(50, opts.limit ?? 12));
  const categorySlug = (opts.categorySlug ?? "").trim();
  if (!categorySlug) return [];

  // Tìm id danh mục theo slug (khớp bất kỳ ngôn ngữ nào)
  const catRows = (await prisma.$queryRaw`
    SELECT scc.id AS id
    FROM sitecontentcategory scc
    JOIN sitecontentcategorytranslation t ON t.siteContentCategoryId = scc.id
    WHERE t.slug = ${categorySlug}
    LIMIT 1
  `) as Array<{ id: string }>;
  const categoryId = catRows[0]?.id ?? null;
  if (!categoryId) return [];

  const rows = (await prisma.$queryRaw`
    SELECT
      sc.id,
      sc.coverImage,
      sc.publishedAt,
      sc.updatedAt,
      tl.slug AS slug_lang,
      tl.title AS title_lang,
      tl.excerpt AS excerpt_lang,
      tv.slug AS slug_vi,
      tv.title AS title_vi,
      tv.excerpt AS excerpt_vi,
      cl.slug AS cat_slug_lang,
      cl.name AS cat_name_lang,
      cv.slug AS cat_slug_vi,
      cv.name AS cat_name_vi
    FROM sitecontent sc
    LEFT JOIN sitecontenttranslation tl
      ON tl.siteContentId = sc.id AND tl.lang = ${locale}
    LEFT JOIN sitecontenttranslation tv
      ON tv.siteContentId = sc.id AND tv.lang = 'vi'
    LEFT JOIN sitecontentcategorytranslation cl
      ON cl.siteContentCategoryId = sc.siteContentCategoryId AND cl.lang = ${locale}
    LEFT JOIN sitecontentcategorytranslation cv
      ON cv.siteContentCategoryId = sc.siteContentCategoryId AND cv.lang = 'vi'
    WHERE
      sc.status = 'PUBLISHED'
      AND (sc.publishedAt IS NULL OR sc.publishedAt <= ${now})
      AND sc.siteContentCategoryId = ${categoryId}
    ORDER BY sc.sortOrder ASC, sc.updatedAt DESC, sc.createdAt DESC
    LIMIT ${limit}
  `) as Array<{
    id: string;
    coverImage: string | null;
    publishedAt: Date | null;
    updatedAt: Date;
    slug_lang: string | null;
    title_lang: string | null;
    excerpt_lang: string | null;
    slug_vi: string | null;
    title_vi: string | null;
    excerpt_vi: string | null;
    cat_slug_lang: string | null;
    cat_name_lang: string | null;
    cat_slug_vi: string | null;
    cat_name_vi: string | null;
  }>;

  return rows
    .map((r) => {
      const hasLocale = Boolean(r.slug_lang && r.title_lang);
      const useVi = !hasLocale && Boolean(r.slug_vi && r.title_vi);
      if (!hasLocale && !useVi) return null;

      const catSlug = String(r.cat_slug_lang ?? r.cat_slug_vi ?? "").trim();
      const catName = String(r.cat_name_lang ?? r.cat_name_vi ?? "").trim();

      return {
        id: r.id,
        slug: (hasLocale ? r.slug_lang : r.slug_vi) ?? "",
        title: (hasLocale ? r.title_lang : r.title_vi) ?? "",
        excerpt: (hasLocale ? r.excerpt_lang : r.excerpt_vi) ?? "",
        coverImage: r.coverImage,
        publishedAt: r.publishedAt,
        updatedAt: r.updatedAt,
        category: catSlug && catName ? { slug: catSlug, name: catName } : null
      } satisfies SiteContentCard;
    })
    .filter(Boolean) as SiteContentCard[];
}
