import { prisma } from "@/lib/db";
import type { SiteContentLocale } from "@/lib/siteContent/getSiteContentDetail";
import type { SiteContentCard } from "@/lib/siteContent/getSiteContents";
import type { SiteContentType } from "@/lib/siteContentTypes";

/**
 * Nội dung thuộc danh mục có `type` cho trước (gom mọi danh mục cùng loại).
 * Bản dịch theo `locale`, thiếu thì fallback sang VI. Chỉ lấy bài PUBLISHED đã đến hạn đăng.
 */
export async function getContentsByType(
  locale: SiteContentLocale,
  opts: { type: SiteContentType; limit?: number }
): Promise<SiteContentCard[]> {
  const now = new Date();
  const take = Math.max(1, Math.min(60, opts.limit ?? 30));
  const type = opts.type;

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
      ccl.slug AS cat_slug_lang,
      ccl.name AS cat_name_lang,
      ccv.slug AS cat_slug_vi,
      ccv.name AS cat_name_vi
    FROM sitecontent sc
    LEFT JOIN sitecontenttranslation tl ON tl.siteContentId = sc.id AND tl.lang = ${locale}
    LEFT JOIN sitecontenttranslation tv ON tv.siteContentId = sc.id AND tv.lang = 'vi'
    LEFT JOIN sitecontentcategorytranslation ccl ON ccl.siteContentCategoryId = sc.siteContentCategoryId AND ccl.lang = ${locale}
    LEFT JOIN sitecontentcategorytranslation ccv ON ccv.siteContentCategoryId = sc.siteContentCategoryId AND ccv.lang = 'vi'
    WHERE
      sc.type = ${type}
      AND sc.status = 'PUBLISHED'
      AND (sc.publishedAt IS NULL OR sc.publishedAt <= ${now})
    ORDER BY sc.sortOrder ASC, sc.updatedAt DESC, sc.createdAt DESC
    LIMIT ${take}
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
