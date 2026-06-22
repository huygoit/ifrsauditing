import { prisma } from "@/lib/db";
import type { SiteContentLocale } from "@/lib/siteContent/getSiteContentDetail";
import type { SiteContentCard } from "@/lib/siteContent/getSiteContents";

export type CategoryWithContents = {
  name: string;
  description: string;
  items: SiteContentCard[];
};

/**
 * Trang danh mục: thông tin danh mục + danh sách nội dung của chính nó VÀ các danh mục con.
 * Bản dịch theo `locale`, thiếu thì fallback sang VI.
 */
export async function getCategoryWithContents(
  locale: SiteContentLocale,
  slug: string
): Promise<CategoryWithContents | null> {
  const cleanSlug = (slug ?? "").trim();
  if (!cleanSlug) return null;

  const catRows = (await prisma.$queryRaw`
    SELECT
      scc.id AS id,
      cl.name AS name_lang,
      cl.description AS desc_lang,
      cv.name AS name_vi,
      cv.description AS desc_vi
    FROM sitecontentcategorytranslation t
    JOIN sitecontentcategory scc ON scc.id = t.siteContentCategoryId
    LEFT JOIN sitecontentcategorytranslation cl ON cl.siteContentCategoryId = scc.id AND cl.lang = ${locale}
    LEFT JOIN sitecontentcategorytranslation cv ON cv.siteContentCategoryId = scc.id AND cv.lang = 'vi'
    WHERE t.slug = ${cleanSlug}
    LIMIT 1
  `) as Array<{
    id: string;
    name_lang: string | null;
    desc_lang: string | null;
    name_vi: string | null;
    desc_vi: string | null;
  }>;

  const cat = catRows[0];
  if (!cat) return null;

  const now = new Date();
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
      sc.status = 'PUBLISHED'
      AND (sc.publishedAt IS NULL OR sc.publishedAt <= ${now})
      AND (
        sc.siteContentCategoryId = ${cat.id}
        OR sc.siteContentCategoryId IN (SELECT id FROM sitecontentcategory WHERE parentId = ${cat.id})
      )
    ORDER BY sc.sortOrder ASC, sc.updatedAt DESC, sc.createdAt DESC
    LIMIT 60
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

  const items = rows
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

  return {
    name: String(cat.name_lang ?? cat.name_vi ?? "").trim(),
    description: String(cat.desc_lang ?? cat.desc_vi ?? "").trim(),
    items
  };
}
