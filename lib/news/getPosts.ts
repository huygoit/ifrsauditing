import { prisma } from "@/lib/db";
import type { NewsLocale, NewsPostCard } from "@/lib/news/types";
import { getCategoryBySlug } from "@/lib/news/getCategories";

export async function getPosts(
  locale: NewsLocale,
  opts?: { categorySlug?: string; limit?: number }
): Promise<{ categoryId: string | null; posts: NewsPostCard[] }> {
  const now = new Date();
  const limit = Math.max(1, Math.min(100, opts?.limit ?? 30));

  let categoryId: string | null = null;
  if (opts?.categorySlug) {
    const cat = await getCategoryBySlug(locale, opts.categorySlug);
    categoryId = cat?.id ?? null;
    if (!categoryId) return { categoryId: null, posts: [] };
  }

  const rows = (await prisma.$queryRaw`
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
      AND (${categoryId} IS NULL OR p.postCategoryId = ${categoryId})
    ORDER BY p.updatedAt DESC, p.publishedAt DESC, p.createdAt DESC
    LIMIT ${limit}
  `) as Array<{
    id: string;
    coverImage: string | null;
    author: string | null;
    publishedAt: Date | null;
    updatedAt: Date;
    postCategoryId: string | null;
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

  const fallbackCatSlug = locale === "en" ? "news" : "tin-tuc";
  const fallbackCatName = locale === "en" ? "News" : "Tin tức";

  const posts: NewsPostCard[] = rows
    .map((r) => {
      const hasLocale = Boolean(r.slug_lang && r.title_lang);
      const useVi = !hasLocale && Boolean(r.slug_vi && r.title_vi);
      if (!hasLocale && !useVi) return null;

      // Category translation fallback; use fallback slug/name when post has no category or category has no translation.
      const catSlug = String((r.cat_slug_lang ?? r.cat_slug_vi ?? "")).trim();
      const catName = String((r.cat_name_lang ?? r.cat_name_vi ?? "")).trim();
      const category =
        r.postCategoryId && catSlug && catName
          ? { id: r.postCategoryId, slug: catSlug, name: catName }
          : { id: r.postCategoryId ?? "", slug: fallbackCatSlug, name: fallbackCatName };

      return {
        id: r.id,
        translationLang: hasLocale ? locale : "vi",
        slug: (hasLocale ? r.slug_lang : r.slug_vi) ?? "",
        title: (hasLocale ? r.title_lang : r.title_vi) ?? "",
        excerpt: (hasLocale ? r.excerpt_lang : r.excerpt_vi) ?? "",
        coverImage: r.coverImage,
        author: r.author,
        publishedAt: r.publishedAt,
        updatedAt: r.updatedAt,
        category
      };
    })
    .filter(Boolean) as NewsPostCard[];

  return { categoryId, posts };
}

