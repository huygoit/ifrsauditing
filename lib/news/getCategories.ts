import { prisma } from "@/lib/db";
import type { NewsCategory, NewsLocale } from "@/lib/news/types";

export async function getCategories(locale: NewsLocale): Promise<NewsCategory[]> {
  const rows = (await prisma.$queryRaw`
    SELECT
      pc.id,
      pc.status,
      pc.sortOrder,
      tl.lang AS lang_lang,
      tl.slug AS slug_lang,
      tl.name AS name_lang,
      tl.description AS description_lang,
      tl.seoTitle AS seoTitle_lang,
      tl.seoDesc AS seoDesc_lang,
      tv.slug AS slug_vi,
      tv.name AS name_vi,
      tv.description AS description_vi,
      tv.seoTitle AS seoTitle_vi,
      tv.seoDesc AS seoDesc_vi
    FROM postcategory pc
    LEFT JOIN postcategorytranslation tl
      ON tl.postCategoryId = pc.id AND tl.lang = ${locale}
    LEFT JOIN postcategorytranslation tv
      ON tv.postCategoryId = pc.id AND tv.lang = 'vi'
    WHERE pc.status = 'ACTIVE'
    ORDER BY pc.sortOrder ASC, pc.createdAt DESC
  `) as Array<{
    id: string;
    status: string;
    sortOrder: number;
    lang_lang: NewsLocale | null;
    slug_lang: string | null;
    name_lang: string | null;
    description_lang: string | null;
    seoTitle_lang: string | null;
    seoDesc_lang: string | null;
    slug_vi: string | null;
    name_vi: string | null;
    description_vi: string | null;
    seoTitle_vi: string | null;
    seoDesc_vi: string | null;
  }>;

  return rows.map((r) => {
    const hasLocale = Boolean(r.slug_lang && r.name_lang);
    const useVi = !hasLocale && Boolean(r.slug_vi && r.name_vi);
    const translationLang: NewsLocale = hasLocale ? locale : "vi";
    return {
      id: r.id,
      status: r.status,
      sortOrder: r.sortOrder,
      translationLang,
      slug: hasLocale ? (r.slug_lang ?? "") : (r.slug_vi ?? ""),
      name: hasLocale ? (r.name_lang ?? "") : (r.name_vi ?? ""),
      description: hasLocale ? (r.description_lang ?? "") : (r.description_vi ?? ""),
      seoTitle: hasLocale ? (r.seoTitle_lang ?? "") : (r.seoTitle_vi ?? ""),
      seoDesc: hasLocale ? (r.seoDesc_lang ?? "") : (r.seoDesc_vi ?? "")
    };
  });
}

export async function getCategoryBySlug(locale: NewsLocale, categorySlug: string): Promise<NewsCategory | null> {
  const slug = (categorySlug ?? "").trim();
  if (!slug) return null;

  // 1) try by requested locale
  const rows1 = (await prisma.$queryRaw`
    SELECT
      pc.id,
      pc.status,
      pc.sortOrder,
      tl.lang AS lang_lang,
      tl.slug AS slug_lang,
      tl.name AS name_lang,
      tl.description AS description_lang,
      tl.seoTitle AS seoTitle_lang,
      tl.seoDesc AS seoDesc_lang,
      tv.slug AS slug_vi,
      tv.name AS name_vi,
      tv.description AS description_vi,
      tv.seoTitle AS seoTitle_vi,
      tv.seoDesc AS seoDesc_vi
    FROM postcategorytranslation tl
    JOIN postcategory pc ON pc.id = tl.postCategoryId
    LEFT JOIN postcategorytranslation tv
      ON tv.postCategoryId = pc.id AND tv.lang = 'vi'
    WHERE tl.lang = ${locale} AND tl.slug = ${slug}
    LIMIT 1
  `) as any[];

  const row = (rows1[0] ??
    (locale === "en"
      ? (
          (await prisma.$queryRaw`
            SELECT
              pc.id,
              pc.status,
              pc.sortOrder,
              tl.lang AS lang_lang,
              tl.slug AS slug_lang,
              tl.name AS name_lang,
              tl.description AS description_lang,
              tl.seoTitle AS seoTitle_lang,
              tl.seoDesc AS seoDesc_lang,
              tv.slug AS slug_vi,
              tv.name AS name_vi,
              tv.description AS description_vi,
              tv.seoTitle AS seoTitle_vi,
              tv.seoDesc AS seoDesc_vi
            FROM postcategorytranslation tl
            JOIN postcategory pc ON pc.id = tl.postCategoryId
            LEFT JOIN postcategorytranslation tv
              ON tv.postCategoryId = pc.id AND tv.lang = 'vi'
            WHERE tl.lang = 'vi' AND tl.slug = ${slug}
            LIMIT 1
          `) as any[]
        )[0]
      : null)) as any | null;

  if (!row) return null;

  const hasLocale = Boolean(row.slug_lang && row.name_lang);
  const translationLang: NewsLocale = hasLocale ? locale : "vi";
  return {
    id: String(row.id),
    status: String(row.status),
    sortOrder: Number(row.sortOrder ?? 0),
    translationLang,
    slug: hasLocale ? String(row.slug_lang ?? "") : String(row.slug_vi ?? ""),
    name: hasLocale ? String(row.name_lang ?? "") : String(row.name_vi ?? ""),
    description: hasLocale ? String(row.description_lang ?? "") : String(row.description_vi ?? ""),
    seoTitle: hasLocale ? String(row.seoTitle_lang ?? "") : String(row.seoTitle_vi ?? ""),
    seoDesc: hasLocale ? String(row.seoDesc_lang ?? "") : String(row.seoDesc_vi ?? "")
  };
}

