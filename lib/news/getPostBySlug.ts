import { prisma } from "@/lib/db";
import type { NewsCategory, NewsLocale, NewsPostCard, NewsPostDetail } from "@/lib/news/types";
import { getCategoryBySlug } from "@/lib/news/getCategories";

function pickCategoryFromRow(locale: NewsLocale, r: any): NewsCategory | null {
  const hasLocale = Boolean(r.cat_slug_lang && r.cat_name_lang);
  const useVi = !hasLocale && Boolean(r.cat_slug_vi && r.cat_name_vi);
  if (!hasLocale && !useVi) return null;
  return {
    id: String(r.postCategoryId),
    status: String(r.cat_status ?? "ACTIVE"),
    sortOrder: Number(r.cat_sortOrder ?? 0),
    translationLang: hasLocale ? locale : "vi",
    slug: String((hasLocale ? r.cat_slug_lang : r.cat_slug_vi) ?? ""),
    name: String((hasLocale ? r.cat_name_lang : r.cat_name_vi) ?? ""),
    description: String((hasLocale ? r.cat_desc_lang : r.cat_desc_vi) ?? ""),
    seoTitle: String((hasLocale ? r.cat_seoTitle_lang : r.cat_seoTitle_vi) ?? ""),
    seoDesc: String((hasLocale ? r.cat_seoDesc_lang : r.cat_seoDesc_vi) ?? "")
  };
}

const FALLBACK_CAT_SLUG_VI = "tin-tuc";
const FALLBACK_CAT_SLUG_EN = "news";

function isFallbackCategorySlug(slug: string): boolean {
  const s = (slug ?? "").trim();
  return s === FALLBACK_CAT_SLUG_VI || s === FALLBACK_CAT_SLUG_EN;
}

function syntheticCategory(locale: NewsLocale, categorySlug: string): NewsCategory {
  const name = locale === "en" ? "News" : "Tin tức";
  const slug = (categorySlug ?? "").trim() || (locale === "en" ? FALLBACK_CAT_SLUG_EN : FALLBACK_CAT_SLUG_VI);
  return {
    id: "",
    status: "ACTIVE",
    sortOrder: 0,
    translationLang: locale,
    slug,
    name,
    description: "",
    seoTitle: name,
    seoDesc: ""
  };
}

export async function getPostBySlug(locale: NewsLocale, categorySlug: string, slug: string) {
  const cat = await getCategoryBySlug(locale, categorySlug);
  const useFallbackCategory = !cat && isFallbackCategorySlug(categorySlug);
  if (!cat && !useFallbackCategory) return null;
  const catId = cat?.id ?? null;

  const now = new Date();
  const s = (slug ?? "").trim();
  if (!s) return null;

  async function queryByCategory(lang: NewsLocale) {
    const rows = (await prisma.$queryRaw`
      SELECT
        p.id,
        p.coverImage,
        p.author,
        p.publishedAt,
        p.updatedAt,
        p.postCategoryId,

        pt.lang AS tr_lang,
        pt.slug AS tr_slug,
        pt.title AS tr_title,
        pt.excerpt AS tr_excerpt,
        pt.contentMarkdown AS tr_html,
        pt.contentJson AS tr_json,
        pt.seoTitle AS tr_seoTitle,
        pt.seoDesc AS tr_seoDesc,

        pc.status AS cat_status,
        pc.sortOrder AS cat_sortOrder,
        cl.slug AS cat_slug_lang,
        cl.name AS cat_name_lang,
        cl.description AS cat_desc_lang,
        cl.seoTitle AS cat_seoTitle_lang,
        cl.seoDesc AS cat_seoDesc_lang,
        cv.slug AS cat_slug_vi,
        cv.name AS cat_name_vi,
        cv.description AS cat_desc_vi,
        cv.seoTitle AS cat_seoTitle_vi,
        cv.seoDesc AS cat_seoDesc_vi
      FROM posttranslation pt
      JOIN post p ON p.id = pt.postId
      JOIN postcategory pc ON pc.id = p.postCategoryId
      LEFT JOIN postcategorytranslation cl
        ON cl.postCategoryId = p.postCategoryId AND cl.lang = ${locale}
      LEFT JOIN postcategorytranslation cv
        ON cv.postCategoryId = p.postCategoryId AND cv.lang = 'vi'
      WHERE
        pt.lang = ${lang}
        AND pt.slug = ${s}
        AND p.postCategoryId = ${catId}
        AND p.status = 'PUBLISHED'
        AND (p.publishedAt IS NULL OR p.publishedAt <= ${now})
      LIMIT 1
    `) as any[];
    return rows[0] ?? null;
  }

  async function queryBySlugOnly(lang: NewsLocale) {
    const rows = (await prisma.$queryRaw`
      SELECT
        p.id,
        p.coverImage,
        p.author,
        p.publishedAt,
        p.updatedAt,
        p.postCategoryId,

        pt.lang AS tr_lang,
        pt.slug AS tr_slug,
        pt.title AS tr_title,
        pt.excerpt AS tr_excerpt,
        pt.contentMarkdown AS tr_html,
        pt.contentJson AS tr_json,
        pt.seoTitle AS tr_seoTitle,
        pt.seoDesc AS tr_seoDesc,

        pc.status AS cat_status,
        pc.sortOrder AS cat_sortOrder,
        cl.slug AS cat_slug_lang,
        cl.name AS cat_name_lang,
        cl.description AS cat_desc_lang,
        cl.seoTitle AS cat_seoTitle_lang,
        cl.seoDesc AS cat_seoDesc_lang,
        cv.slug AS cat_slug_vi,
        cv.name AS cat_name_vi,
        cv.description AS cat_desc_vi,
        cv.seoTitle AS cat_seoTitle_vi,
        cv.seoDesc AS cat_seoDesc_vi
      FROM posttranslation pt
      JOIN post p ON p.id = pt.postId
      LEFT JOIN postcategory pc ON pc.id = p.postCategoryId
      LEFT JOIN postcategorytranslation cl
        ON cl.postCategoryId = p.postCategoryId AND cl.lang = ${locale}
      LEFT JOIN postcategorytranslation cv
        ON cv.postCategoryId = p.postCategoryId AND cv.lang = 'vi'
      WHERE
        pt.lang = ${lang}
        AND pt.slug = ${s}
        AND p.status = 'PUBLISHED'
        AND (p.publishedAt IS NULL OR p.publishedAt <= ${now})
      LIMIT 1
    `) as any[];
    return rows[0] ?? null;
  }

  const row = useFallbackCategory
    ? (await queryBySlugOnly(locale)) ?? (locale === "en" ? await queryBySlugOnly("vi") : null)
    : (await queryByCategory(locale)) ?? (locale === "en" ? await queryByCategory("vi") : null);
  if (!row) return null;

  const category = useFallbackCategory
    ? syntheticCategory(locale, categorySlug)
    : pickCategoryFromRow(locale, row);
  const effectiveCatId = useFallbackCategory ? (row.postCategoryId as string | null) ?? null : catId;

  const detail: NewsPostDetail = {
    id: String(row.id),
    translationLang: String(row.tr_lang) === "en" ? "en" : "vi",
    slug: String(row.tr_slug ?? ""),
    title: String(row.tr_title ?? ""),
    excerpt: String(row.tr_excerpt ?? ""),
    coverImage: (row.coverImage as string | null) ?? null,
    author: (row.author as string | null) ?? null,
    publishedAt: (row.publishedAt as Date | null) ?? null,
    updatedAt: row.updatedAt as Date,
    contentHtml: String(row.tr_html ?? ""),
    contentJson: row.tr_json ?? null,
    seoTitle: String(row.tr_seoTitle ?? ""),
    seoDesc: String(row.tr_seoDesc ?? ""),
    category
  };

  // related (same category, or recent when post has no category)
  const relatedRows =
    effectiveCatId != null
      ? ((await prisma.$queryRaw`
    SELECT
      p.id,
      p.coverImage,
      p.author,
      p.publishedAt,
      p.updatedAt,
      p.postCategoryId,

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
    FROM post p
    LEFT JOIN posttranslation tl
      ON tl.postId = p.id AND tl.lang = ${locale}
    LEFT JOIN posttranslation tv
      ON tv.postId = p.id AND tv.lang = 'vi'
    LEFT JOIN postcategorytranslation cl
      ON cl.postCategoryId = p.postCategoryId AND cl.lang = ${locale}
    LEFT JOIN postcategorytranslation cv
      ON cv.postCategoryId = p.postCategoryId AND cv.lang = 'vi'
    WHERE
      p.id <> ${detail.id}
      AND p.postCategoryId = ${effectiveCatId}
      AND p.status = 'PUBLISHED'
      AND (p.publishedAt IS NULL OR p.publishedAt <= ${now})
    ORDER BY p.updatedAt DESC, p.publishedAt DESC, p.createdAt DESC
    LIMIT 3
  `) as any[])
      : ((await prisma.$queryRaw`
    SELECT
      p.id,
      p.coverImage,
      p.author,
      p.publishedAt,
      p.updatedAt,
      p.postCategoryId,

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
    FROM post p
    LEFT JOIN posttranslation tl
      ON tl.postId = p.id AND tl.lang = ${locale}
    LEFT JOIN posttranslation tv
      ON tv.postId = p.id AND tv.lang = 'vi'
    LEFT JOIN postcategorytranslation cl
      ON cl.postCategoryId = p.postCategoryId AND cl.lang = ${locale}
    LEFT JOIN postcategorytranslation cv
      ON cv.postCategoryId = p.postCategoryId AND cv.lang = 'vi'
    WHERE
      p.id <> ${detail.id}
      AND p.postCategoryId IS NULL
      AND p.status = 'PUBLISHED'
      AND (p.publishedAt IS NULL OR p.publishedAt <= ${now})
    ORDER BY p.updatedAt DESC, p.publishedAt DESC, p.createdAt DESC
    LIMIT 3
  `) as any[]);

  const fallbackSlug = locale === "en" ? FALLBACK_CAT_SLUG_EN : FALLBACK_CAT_SLUG_VI;
  const fallbackName = locale === "en" ? "News" : "Tin tức";
  const related: NewsPostCard[] = relatedRows
    .map((r: any) => {
      const hasLocale = Boolean(r.slug_lang && r.title_lang);
      const useVi = !hasLocale && Boolean(r.slug_vi && r.title_vi);
      if (!hasLocale && !useVi) return null;
      const catSlug = String((hasLocale ? r.cat_slug_lang : r.cat_slug_vi) ?? "").trim();
      const catName = String((hasLocale ? r.cat_name_lang : r.cat_name_vi) ?? "").trim();
      const category =
        r.postCategoryId && catSlug && catName
          ? { id: String(r.postCategoryId), slug: catSlug, name: catName }
          : { id: "", slug: fallbackSlug, name: fallbackName };
      return {
        id: String(r.id),
        translationLang: hasLocale ? locale : "vi",
        slug: String((hasLocale ? r.slug_lang : r.slug_vi) ?? ""),
        title: String((hasLocale ? r.title_lang : r.title_vi) ?? ""),
        excerpt: String((hasLocale ? r.excerpt_lang : r.excerpt_vi) ?? ""),
        coverImage: (r.coverImage as string | null) ?? null,
        author: (r.author as string | null) ?? null,
        publishedAt: (r.publishedAt as Date | null) ?? null,
        updatedAt: r.updatedAt as Date,
        category
      };
    })
    .filter(Boolean) as NewsPostCard[];

  // recent posts (all categories)
  const recentRows = (await prisma.$queryRaw`
    SELECT
      p.id,
      p.coverImage,
      p.author,
      p.publishedAt,
      p.updatedAt,
      p.postCategoryId,

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
    FROM post p
    LEFT JOIN posttranslation tl
      ON tl.postId = p.id AND tl.lang = ${locale}
    LEFT JOIN posttranslation tv
      ON tv.postId = p.id AND tv.lang = 'vi'
    LEFT JOIN postcategorytranslation cl
      ON cl.postCategoryId = p.postCategoryId AND cl.lang = ${locale}
    LEFT JOIN postcategorytranslation cv
      ON cv.postCategoryId = p.postCategoryId AND cv.lang = 'vi'
    WHERE
      p.status = 'PUBLISHED'
      AND (p.publishedAt IS NULL OR p.publishedAt <= ${now})
    ORDER BY p.updatedAt DESC, p.publishedAt DESC, p.createdAt DESC
    LIMIT 5
  `) as any[];

  const recent: NewsPostCard[] = recentRows
    .map((r: any) => {
      const hasLocale = Boolean(r.slug_lang && r.title_lang);
      const useVi = !hasLocale && Boolean(r.slug_vi && r.title_vi);
      if (!hasLocale && !useVi) return null;
      const catSlugR = String((hasLocale ? r.cat_slug_lang : r.cat_slug_vi) ?? "").trim();
      const catNameR = String((hasLocale ? r.cat_name_lang : r.cat_name_vi) ?? "").trim();
      const categoryR =
        r.postCategoryId && catSlugR && catNameR
          ? { id: String(r.postCategoryId), slug: catSlugR, name: catNameR }
          : { id: "", slug: fallbackSlug, name: fallbackName };
      return {
        id: String(r.id),
        translationLang: hasLocale ? locale : "vi",
        slug: String((hasLocale ? r.slug_lang : r.slug_vi) ?? ""),
        title: String((hasLocale ? r.title_lang : r.title_vi) ?? ""),
        excerpt: String((hasLocale ? r.excerpt_lang : r.excerpt_vi) ?? ""),
        coverImage: (r.coverImage as string | null) ?? null,
        author: (r.author as string | null) ?? null,
        publishedAt: (r.publishedAt as Date | null) ?? null,
        updatedAt: r.updatedAt as Date,
        category: categoryR
      };
    })
    .filter(Boolean) as NewsPostCard[];

  return { category, post: detail, related, recent };
}

