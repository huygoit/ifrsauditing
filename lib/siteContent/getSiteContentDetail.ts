import { prisma } from "@/lib/db";

export type SiteContentLocale = "vi" | "en";

export type SiteContentDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  author: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  contentHtml: string;
  contentJson: unknown | null;
  seoTitle: string | null;
  seoDesc: string | null;
  category: { slug: string; name: string };
};

/**
 * Chi tiết nội dung website: slug danh mục khớp bất kỳ bản dịch nào; nội dung bài theo `lang` (EN thiếu thì thử VI).
 */
export async function getSiteContentDetail(
  locale: SiteContentLocale,
  categorySlug: string,
  contentSlug: string
): Promise<SiteContentDetail | null> {
  const now = new Date();
  const cat = (categorySlug ?? "").trim();
  const slug = (contentSlug ?? "").trim();
  if (!cat || !slug) return null;

  async function query(lang: SiteContentLocale) {
    const rows = (await prisma.$queryRaw`
      SELECT
        sc.id,
        sc.coverImage,
        sc.author,
        sc.publishedAt,
        sc.updatedAt,
        st.slug AS tr_slug,
        st.title AS tr_title,
        st.excerpt AS tr_excerpt,
        st.contentMarkdown AS tr_html,
        st.contentJson AS tr_json,
        st.seoTitle AS tr_seoTitle,
        st.seoDesc AS tr_seoDesc,
        COALESCE(ct_lang.slug, ct_vi.slug) AS cat_slug,
        COALESCE(ct_lang.name, ct_vi.name) AS cat_name
      FROM sitecontent sc
      INNER JOIN sitecontenttranslation st
        ON st.siteContentId = sc.id AND st.lang = ${lang} AND st.slug = ${slug}
      INNER JOIN sitecontentcategory scc ON scc.id = sc.siteContentCategoryId
      LEFT JOIN sitecontentcategorytranslation ct_lang
        ON ct_lang.siteContentCategoryId = scc.id AND ct_lang.lang = ${locale}
      LEFT JOIN sitecontentcategorytranslation ct_vi
        ON ct_vi.siteContentCategoryId = scc.id AND ct_vi.lang = 'vi'
      WHERE sc.status = 'PUBLISHED'
        AND (sc.publishedAt IS NULL OR sc.publishedAt <= ${now})
        AND EXISTS (
          SELECT 1 FROM sitecontentcategorytranslation cx
          WHERE cx.siteContentCategoryId = scc.id AND cx.slug = ${cat}
        )
      LIMIT 1
    `) as Array<{
      id: string;
      coverImage: string | null;
      author: string | null;
      publishedAt: Date | null;
      updatedAt: Date;
      tr_slug: string;
      tr_title: string;
      tr_excerpt: string | null;
      tr_html: string | null;
      tr_json: unknown | null;
      tr_seoTitle: string | null;
      tr_seoDesc: string | null;
      cat_slug: string | null;
      cat_name: string | null;
    }>;
    return rows[0] ?? null;
  }

  const row = (await query(locale)) ?? (locale === "en" ? await query("vi") : null);
  if (!row) return null;
  const catSlug = String(row.cat_slug ?? "").trim();
  const catName = String(row.cat_name ?? "").trim();
  if (!catSlug || !catName) return null;

  return {
    id: String(row.id),
    slug: String(row.tr_slug ?? ""),
    title: String(row.tr_title ?? ""),
    excerpt: String(row.tr_excerpt ?? ""),
    coverImage: row.coverImage ?? null,
    author: row.author ?? null,
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt,
    contentHtml: String(row.tr_html ?? ""),
    contentJson: row.tr_json ?? null,
    seoTitle: row.tr_seoTitle ?? null,
    seoDesc: row.tr_seoDesc ?? null,
    category: { slug: catSlug, name: catName }
  };
}
