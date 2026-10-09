import { prisma } from "@/lib/db";
import { isSiteContentType, pathSlugForType, typeFromPathSlug, typeLabel } from "@/lib/siteContentTypes";

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

type DetailRow = {
  id: string;
  coverImage: string | null;
  author: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  content_type: string | null;
  tr_slug: string;
  tr_title: string;
  tr_excerpt: string | null;
  tr_html: string | null;
  tr_json: unknown | null;
  tr_seoTitle: string | null;
  tr_seoDesc: string | null;
  cat_slug: string | null;
  cat_name: string | null;
};

/** Gắn nhãn/slug danh mục; bài chưa gán danh mục thì dùng slug theo loại (tuyen-dung, dich-vu…). */
function mapDetailRow(locale: SiteContentLocale, row: DetailRow): SiteContentDetail | null {
  const type = isSiteContentType(row.content_type) ? row.content_type : null;
  const fallbackSlug = pathSlugForType(type);
  const fallbackName = type ? typeLabel(type, locale) : fallbackSlug;

  const catSlug = String(row.cat_slug ?? fallbackSlug).trim();
  const catName = String(row.cat_name ?? fallbackName).trim();
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

/**
 * Chi tiết nội dung website: slug danh mục khớp bất kỳ bản dịch nào;
 * hoặc segment theo loại (vd: tuyen-dung) khi bài chưa gán danh mục.
 * Nội dung bài theo `lang` (EN thiếu thì thử VI).
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

  // Segment tuyen-dung/dich-vu/ifrs: cho phép bài chưa gán danh mục cùng loại
  const uncategorizedType = typeFromPathSlug(cat);
  const uncategorizedTypeValue = uncategorizedType ?? "";

  async function query(lang: SiteContentLocale) {
    const rows = (await prisma.$queryRaw`
      SELECT
        sc.id,
        sc.coverImage,
        sc.author,
        sc.publishedAt,
        sc.updatedAt,
        sc.type AS content_type,
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
      LEFT JOIN sitecontentcategory scc ON scc.id = sc.siteContentCategoryId
      LEFT JOIN sitecontentcategorytranslation ct_lang
        ON ct_lang.siteContentCategoryId = scc.id AND ct_lang.lang = ${locale}
      LEFT JOIN sitecontentcategorytranslation ct_vi
        ON ct_vi.siteContentCategoryId = scc.id AND ct_vi.lang = 'vi'
      WHERE sc.status = 'PUBLISHED'
        AND (sc.publishedAt IS NULL OR sc.publishedAt <= ${now})
        AND (
          EXISTS (
            SELECT 1 FROM sitecontentcategorytranslation cx
            WHERE cx.siteContentCategoryId = sc.siteContentCategoryId AND cx.slug = ${cat}
          )
          OR (
            sc.siteContentCategoryId IS NULL
            AND ${uncategorizedTypeValue} <> ''
            AND sc.type = ${uncategorizedTypeValue}
          )
        )
      LIMIT 1
    `) as DetailRow[];
    return rows[0] ?? null;
  }

  const row = (await query(locale)) ?? (locale === "en" ? await query("vi") : null);
  if (!row) return null;
  return mapDetailRow(locale, row);
}

/**
 * Tìm bài đã xuất bản theo slug nội dung (không cần biết danh mục).
 * Dùng để chuyển hướng URL thiếu segment danh mục.
 */
export async function getSiteContentBySlug(
  locale: SiteContentLocale,
  contentSlug: string
): Promise<SiteContentDetail | null> {
  const now = new Date();
  const slug = (contentSlug ?? "").trim();
  if (!slug) return null;

  async function query(lang: SiteContentLocale) {
    const rows = (await prisma.$queryRaw`
      SELECT
        sc.id,
        sc.coverImage,
        sc.author,
        sc.publishedAt,
        sc.updatedAt,
        sc.type AS content_type,
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
      LEFT JOIN sitecontentcategory scc ON scc.id = sc.siteContentCategoryId
      LEFT JOIN sitecontentcategorytranslation ct_lang
        ON ct_lang.siteContentCategoryId = scc.id AND ct_lang.lang = ${locale}
      LEFT JOIN sitecontentcategorytranslation ct_vi
        ON ct_vi.siteContentCategoryId = scc.id AND ct_vi.lang = 'vi'
      WHERE sc.status = 'PUBLISHED'
        AND (sc.publishedAt IS NULL OR sc.publishedAt <= ${now})
      LIMIT 1
    `) as DetailRow[];
    return rows[0] ?? null;
  }

  const row = (await query(locale)) ?? (locale === "en" ? await query("vi") : null);
  if (!row) return null;
  return mapDetailRow(locale, row);
}
