import { prisma } from "@/lib/db";
import type { Product } from "@/lib/products";
import type { VideoItem } from "@/lib/trust";
import type { Certification } from "@/lib/trust";
import { getFaqs as getPublicFaqs } from "@/lib/public/getFaqs";

export type HomeReview = {
  id: string;
  rating: number;
  tag: string;
  name: string;
  loc: string;
  date: string; // e.g. 01/2026
  text: string;
  images: string[];
};

export type HomeNewsItem = {
  id: string;
  categorySlug: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  author: string | null;
  publishedAt: string | null;
  updatedAt: string;
};

export type HomePartner = {
  id: string;
  name: string;
  shortDesc: string | null;
  logoSrc: string;
  link: string | null;
};

export type HomeFaqItem = {
  q: string;
  a: string;
  sectionKey: string | null;
};

/** Thẻ “Công dụng nổi bật” trên trang chủ (SiteContent + danh mục slug cố định). */
export type HomeBenefitHighlightItem = {
  id: string;
  categorySlug: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
};

/** Nhóm use-case trên home (cá nhân hoặc thương mại): tiêu đề/mô tả danh mục (tuỳ DB) + danh sách bài. */
export type HomeUseCasesPersonalBlock = {
  items: HomeBenefitHighlightItem[];
  heading: string | null;
  subheading: string | null;
};

export type HomeUseCasesCommercialBlock = HomeUseCasesPersonalBlock;

export type HomeData = {
  locale: "vi" | "en";
  productCategories: string[]; // includes "Tất cả"
  products: Product[];
  certifications: Certification[];
  partners: HomePartner[];
  faqs: HomeFaqItem[];
  videos: VideoItem[];
  reviews: HomeReview[];
  latestNews: HomeNewsItem[];
  benefitHighlights: HomeBenefitHighlightItem[];
  useCasesPersonal: HomeUseCasesPersonalBlock;
  useCasesCommercial: HomeUseCasesCommercialBlock;
};

function safeJsonArray(v: any): any[] {
  if (Array.isArray(v)) return v;
  return [];
}

function toMonthYear(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  return `${mm}/${yyyy}`;
}

/** Slug danh mục tin được hiển thị trên trang chủ (đường dẫn dạng /[locale]/news/tin-enso-chung-nhan/...) */
const HOME_PAGE_NEWS_CATEGORY_SLUG = "tin-enso-chung-nhan";

/** Slug (bất kỳ bản dịch) của danh mục SiteContent dùng cho khối “Công dụng nổi bật” trên trang chủ. */
const HOME_BENEFITS_SITE_CONTENT_CATEGORY_SLUG = "cong-dung-noi-bat";

/** Danh mục SiteContent cho nhóm “Không gian sống cá nhân và gia đình” (Use cases — nhóm 1). */
const HOME_USE_CASES_PERSONAL_CATEGORY_SLUG = "khong-gian-danh-cho-ca-nhan-gia-dinh";

/** Danh mục SiteContent cho nhóm “Thương mại & công nghiệp” (Use cases — nhóm 2). */
const HOME_USE_CASES_COMMERCIAL_CATEGORY_SLUG = "khong-gian-thuong-mai-cong-nghiep";

function mapSiteContentRowsToHomeHighlights(rows: any[]): HomeBenefitHighlightItem[] {
  return rows
    .map((r) => {
      const hasLocale = Boolean(r.slug_lang && r.title_lang);
      const useVi = !hasLocale && Boolean(r.slug_vi && r.title_vi);
      if (!hasLocale && !useVi) return null;
      const slug = String((hasLocale ? r.slug_lang : r.slug_vi) ?? "");
      const title = String((hasLocale ? r.title_lang : r.title_vi) ?? "");
      const excerpt = String((hasLocale ? r.excerpt_lang : r.excerpt_vi) ?? "");
      const catSlug = String((r.cat_slug_lang ?? r.cat_slug_vi ?? "")).trim();
      if (!slug || !title || !catSlug) return null;
      return {
        id: String(r.id),
        categorySlug: catSlug,
        slug,
        title,
        excerpt,
        coverImage: (r.coverImage as string | null) ?? null
      } satisfies HomeBenefitHighlightItem;
    })
    .filter(Boolean) as HomeBenefitHighlightItem[];
}

async function loadUseCasesSiteBlock(
  locale: "vi" | "en",
  now: Date,
  categorySlug: string
): Promise<HomeUseCasesPersonalBlock> {
  const empty: HomeUseCasesPersonalBlock = { items: [], heading: null, subheading: null };
  try {
    const metaRows = (await prisma.$queryRaw`
      SELECT
        NULLIF(TRIM(COALESCE(ct.name, cv.name)), '') AS title_res,
        NULLIF(TRIM(COALESCE(ct.description, cv.description)), '') AS sub_res
      FROM sitecontentcategory scc
      LEFT JOIN sitecontentcategorytranslation ct ON ct.siteContentCategoryId = scc.id AND ct.lang = ${locale}
      LEFT JOIN sitecontentcategorytranslation cv ON cv.siteContentCategoryId = scc.id AND cv.lang = 'vi'
      WHERE EXISTS (
        SELECT 1 FROM sitecontentcategorytranslation x
        WHERE x.siteContentCategoryId = scc.id AND x.slug = ${categorySlug}
      )
      LIMIT 1
    `) as Array<{ title_res: string | null; sub_res: string | null }>;
    const meta = metaRows[0];
    const block: HomeUseCasesPersonalBlock = { ...empty };
    if (meta?.title_res) block.heading = meta.title_res;
    if (meta?.sub_res) block.subheading = meta.sub_res;

    const itemRows = (await prisma.$queryRaw`
      SELECT
        sc.id,
        sc.coverImage,
        sc.sortOrder,
        pt.slug AS slug_lang,
        pt.title AS title_lang,
        pt.excerpt AS excerpt_lang,
        pv.slug AS slug_vi,
        pv.title AS title_vi,
        pv.excerpt AS excerpt_vi,
        ct.slug AS cat_slug_lang,
        cv.slug AS cat_slug_vi
      FROM sitecontent sc
      INNER JOIN sitecontentcategory scc ON scc.id = sc.siteContentCategoryId
      LEFT JOIN sitecontenttranslation pt ON pt.siteContentId = sc.id AND pt.lang = ${locale}
      LEFT JOIN sitecontenttranslation pv ON pv.siteContentId = sc.id AND pv.lang = 'vi'
      LEFT JOIN sitecontentcategorytranslation ct ON ct.siteContentCategoryId = scc.id AND ct.lang = ${locale}
      LEFT JOIN sitecontentcategorytranslation cv ON cv.siteContentCategoryId = scc.id AND cv.lang = 'vi'
      WHERE sc.status = 'PUBLISHED'
        AND (sc.publishedAt IS NULL OR sc.publishedAt <= ${now})
        AND EXISTS (
          SELECT 1 FROM sitecontentcategorytranslation sct
          WHERE sct.siteContentCategoryId = sc.siteContentCategoryId
            AND sct.slug = ${categorySlug}
        )
      ORDER BY sc.sortOrder ASC, sc.publishedAt DESC, sc.createdAt DESC
      LIMIT 24
    `) as Array<any>;

    block.items = mapSiteContentRowsToHomeHighlights(itemRows);
    return block;
  } catch {
    return empty;
  }
}

export async function getHomeData(locale: "vi" | "en"): Promise<HomeData> {
  const now = new Date();

  // Product categories (names)
  const categoryRows = (await prisma.$queryRaw`
    SELECT
      c.id,
      tl.name AS name_lang,
      tv.name AS name_vi
    FROM category c
    LEFT JOIN categorytranslation tl ON tl.categoryId = c.id AND tl.lang = ${locale}
    LEFT JOIN categorytranslation tv ON tv.categoryId = c.id AND tv.lang = 'vi'
    WHERE c.status = 'ACTIVE'
    ORDER BY c.sortOrder ASC, c.createdAt DESC
  `) as Array<{ id: string; name_lang: string | null; name_vi: string | null }>;

  const productCategories = [
    locale === "en" ? "All" : "Tất cả",
    ...categoryRows
      .map((r) => (r.name_lang?.trim() ? r.name_lang.trim() : r.name_vi?.trim() ? r.name_vi.trim() : ""))
      .filter(Boolean)
  ];

  // Products
  const productRows = (await prisma.$queryRaw`
    SELECT
      p.id,
      p.priceVnd,
      p.salePriceVnd,
      p.sizeTag,
      p.thumbnailSrc,
      p.badges,
      p.featured,
      p.sortOrder,

      ct.name AS cat_name_lang,
      cv.name AS cat_name_vi,

      pt.name AS name_lang,
      pt.shortDesc AS shortDesc_lang,
      pt.highlights AS highlights_lang,
      pt.usage AS usage_lang,

      pv.name AS name_vi,
      pv.shortDesc AS shortDesc_vi,
      pv.highlights AS highlights_vi,
      pv.usage AS usage_vi
    FROM product p
    JOIN category c ON c.id = p.categoryId
    LEFT JOIN categorytranslation ct ON ct.categoryId = c.id AND ct.lang = ${locale}
    LEFT JOIN categorytranslation cv ON cv.categoryId = c.id AND cv.lang = 'vi'
    LEFT JOIN producttranslation pt ON pt.productId = p.id AND pt.lang = ${locale}
    LEFT JOIN producttranslation pv ON pv.productId = p.id AND pv.lang = 'vi'
    WHERE p.status = 'ACTIVE'
    ORDER BY p.sortOrder ASC, p.createdAt DESC
  `) as Array<any>;

  const products: Product[] = productRows.map((r) => {
    const hasLocale = Boolean(r.name_lang);
    const name = (hasLocale ? r.name_lang : r.name_vi) ?? "";
    const shortDesc = (hasLocale ? r.shortDesc_lang : r.shortDesc_vi) ?? "";
    const usage = (hasLocale ? r.usage_lang : r.usage_vi) ?? "";
    const highlightsRaw = (hasLocale ? r.highlights_lang : r.highlights_vi) ?? [];
    const highlights = safeJsonArray(highlightsRaw).map(String).filter(Boolean);

    const category = (hasLocale ? r.cat_name_lang : r.cat_name_vi) ?? "";

    const badges = safeJsonArray(r.badges).map(String).filter(Boolean);
    const badge = badges[0] || (r.featured ? "Best seller" : undefined);

    const basePrice = Number(r.priceVnd ?? 0);
    const salePrice = r.salePriceVnd == null ? null : Number(r.salePriceVnd);
    const priceVnd = salePrice && salePrice > 0 && salePrice < basePrice ? salePrice : basePrice;
    const compareAtVnd = salePrice && salePrice > 0 && salePrice < basePrice ? basePrice : undefined;

    return {
      id: String(r.id),
      name: String(name),
      category: String(category || ""),
      shortDesc: String(shortDesc || ""),
      highlights,
      usage: String(usage || ""),
      sizeTag: String(r.sizeTag ?? ""),
      priceVnd,
      ...(compareAtVnd ? { compareAtVnd } : {}),
      ...(badge ? { badge: String(badge) } : {}),
      image: String(r.thumbnailSrc ?? "")
    };
  });

  // Certifications (use existing component shape: title/description + optional image)
  const certRows = (await prisma.$queryRaw`
    SELECT
      c.id,
      c.logoSrc,
      c.certificateImageSrc,
      c.sortOrder,
      tl.title AS title_lang,
      tl.description AS description_lang,
      tv.title AS title_vi,
      tv.description AS description_vi
    FROM certification c
    LEFT JOIN certificationtranslation tl ON tl.certificationId = c.id AND tl.lang = ${locale}
    LEFT JOIN certificationtranslation tv ON tv.certificationId = c.id AND tv.lang = 'vi'
    WHERE c.status = 'PUBLISHED'
    ORDER BY c.sortOrder ASC, c.createdAt DESC
  `) as Array<any>;

  const certifications: Certification[] = certRows
    .map((r) => {
      const hasLocale = Boolean(r.title_lang);
      const title = (hasLocale ? r.title_lang : r.title_vi) ?? "";
      if (!title) return null;
      return {
        id: String(r.id),
        title: String(title),
        logoSrc: String(r.logoSrc ?? ""),
        description: String(((hasLocale ? r.description_lang : r.description_vi) ?? "") as string),
        ...(r.certificateImageSrc ? { certificateImageSrc: String(r.certificateImageSrc) } : {})
      };
    })
    .filter(Boolean) as Certification[];

  // Partners
  const partnerRows = (await prisma.$queryRaw`
    SELECT
      p.id,
      p.logoSrc,
      p.link,
      p.sortOrder,
      tl.name AS name_lang,
      tl.shortDesc AS shortDesc_lang,
      tv.name AS name_vi,
      tv.shortDesc AS shortDesc_vi
    FROM partner p
    LEFT JOIN partnertranslation tl ON tl.partnerId = p.id AND tl.lang = ${locale}
    LEFT JOIN partnertranslation tv ON tv.partnerId = p.id AND tv.lang = 'vi'
    WHERE p.status = 'PUBLISHED'
    ORDER BY p.sortOrder ASC, p.createdAt DESC
  `) as Array<any>;

  const partners: HomePartner[] = partnerRows
    .map((r) => {
      const hasLocale = Boolean(r.name_lang);
      const name = (hasLocale ? r.name_lang : r.name_vi) ?? "";
      if (!name) return null;
      return {
        id: String(r.id),
        name: String(name),
        shortDesc: ((hasLocale ? r.shortDesc_lang : r.shortDesc_vi) ?? null) as string | null,
        logoSrc: String(r.logoSrc ?? ""),
        link: (r.link as string | null) ?? null
      } satisfies HomePartner;
    })
    .filter(Boolean) as HomePartner[];

  // Videos (VideoProof placement)
  const videoRows = (await prisma.$queryRaw`
    SELECT
      v.id,
      v.type,
      v.src,
      v.thumbnailSrc,
      v.duration,
      v.sortOrder,
      tl.title AS title_lang,
      tv.title AS title_vi
    FROM video v
    LEFT JOIN videotranslation tl ON tl.videoId = v.id AND tl.lang = ${locale}
    LEFT JOIN videotranslation tv ON tv.videoId = v.id AND tv.lang = 'vi'
    WHERE v.status = 'PUBLISHED' AND v.placement = 'VIDEO_PROOF'
    ORDER BY v.sortOrder ASC, v.createdAt DESC
  `) as Array<any>;

  const videos: VideoItem[] = videoRows
    .map((r) => {
      const hasLocale = Boolean(r.title_lang);
      const title = (hasLocale ? r.title_lang : r.title_vi) ?? "";
      if (!title) return null;
      return {
        id: String(r.id),
        title: String(title),
        type: String(r.type).toLowerCase() === "youtube" ? "youtube" : "mp4",
        src: String(r.src ?? ""),
        thumbnailSrc: String(r.thumbnailSrc ?? ""),
        duration: String(r.duration ?? "")
      } as VideoItem;
    })
    .filter(Boolean) as VideoItem[];

  // Reviews (approved)
  const reviewRows = (await prisma.$queryRaw`
    SELECT
      r.id,
      r.rating,
      r.avatar,
      r.location,
      r.images,
      r.createdAt,
      tl.name AS name_lang,
      tl.content AS content_lang,
      tv.name AS name_vi,
      tv.content AS content_vi
    FROM review r
    LEFT JOIN reviewtranslation tl ON tl.reviewId = r.id AND tl.lang = ${locale}
    LEFT JOIN reviewtranslation tv ON tv.reviewId = r.id AND tv.lang = 'vi'
    WHERE r.status = 'APPROVED'
    ORDER BY r.createdAt DESC
    LIMIT 6
  `) as Array<any>;

  const reviews: HomeReview[] = reviewRows
    .map((r) => {
      const hasLocale = Boolean(r.name_lang && r.content_lang);
      const name = (hasLocale ? r.name_lang : r.name_vi) ?? "";
      const text = (hasLocale ? r.content_lang : r.content_vi) ?? "";
      if (!name || !text) return null;
      const images = safeJsonArray(r.images).map(String).filter(Boolean);
      const loc = String(r.location ?? "");
      return {
        id: String(r.id),
        rating: Number(r.rating ?? 5),
        tag: loc || "Review",
        name: String(name),
        loc,
        date: toMonthYear(new Date(r.createdAt)),
        text: String(text),
        images
      };
    })
    .filter(Boolean) as HomeReview[];

  // Tin trang chủ: chỉ bài thuộc danh mục slug HOME_PAGE_NEWS_CATEGORY_SLUG (mọi bản dịch slug cùng một postCategoryId).
  const newsRows = (await prisma.$queryRaw`
    SELECT
      p.id,
      p.coverImage,
      p.author,
      p.publishedAt,
      p.updatedAt,
      ct.slug AS cat_slug_lang,
      cv.slug AS cat_slug_vi,
      pt.slug AS slug_lang,
      pt.title AS title_lang,
      pt.excerpt AS excerpt_lang,
      pv.slug AS slug_vi,
      pv.title AS title_vi,
      pv.excerpt AS excerpt_vi
    FROM post p
    INNER JOIN postcategory pc ON pc.id = p.postCategoryId
    LEFT JOIN postcategorytranslation ct ON ct.postCategoryId = pc.id AND ct.lang = ${locale}
    LEFT JOIN postcategorytranslation cv ON cv.postCategoryId = pc.id AND cv.lang = 'vi'
    LEFT JOIN posttranslation pt ON pt.postId = p.id AND pt.lang = ${locale}
    LEFT JOIN posttranslation pv ON pv.postId = p.id AND pv.lang = 'vi'
    WHERE p.status = 'PUBLISHED' AND (p.publishedAt IS NULL OR p.publishedAt <= ${now})
    AND EXISTS (
      SELECT 1 FROM postcategorytranslation pcs
      WHERE pcs.postCategoryId = p.postCategoryId
      AND pcs.slug = ${HOME_PAGE_NEWS_CATEGORY_SLUG}
    )
    ORDER BY p.updatedAt DESC, p.publishedAt DESC, p.createdAt DESC
    LIMIT 12
  `) as Array<any>;

  const fallbackCatSlug = locale === "en" ? "news" : "tin-tuc";
  const latestNews: HomeNewsItem[] = newsRows
    .map((r) => {
      const hasLocale = Boolean(r.slug_lang && r.title_lang);
      const useVi = !hasLocale && Boolean(r.slug_vi && r.title_vi);
      if (!hasLocale && !useVi) return null;
      const catSlug = String((r.cat_slug_lang ?? r.cat_slug_vi ?? "")).trim() || fallbackCatSlug;
      const updatedAt = new Date(r.updatedAt).toISOString();
      return {
        id: String(r.id),
        categorySlug: String(catSlug),
        slug: String((hasLocale ? r.slug_lang : r.slug_vi) ?? ""),
        title: String((hasLocale ? r.title_lang : r.title_vi) ?? ""),
        excerpt: String((hasLocale ? r.excerpt_lang : r.excerpt_vi) ?? ""),
        coverImage: (r.coverImage as string | null) ?? null,
        author: (r.author as string | null) ?? null,
        publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString() : null,
        updatedAt
      };
    })
    .filter(Boolean) as HomeNewsItem[];

  // FAQs (visible, locale-aware, fallback to VI). Keep homepage resilient if migration not applied yet.
  let faqs: HomeFaqItem[] = [];
  try {
    const rows = await getPublicFaqs(locale);
    faqs = rows.map((x) => ({ q: x.question, a: x.answer, sectionKey: x.sectionKey }));
  } catch {
    faqs = [];
  }

  let benefitHighlights: HomeBenefitHighlightItem[] = [];
  try {
    const benefitRows = (await prisma.$queryRaw`
      SELECT
        sc.id,
        sc.coverImage,
        sc.sortOrder,
        pt.slug AS slug_lang,
        pt.title AS title_lang,
        pt.excerpt AS excerpt_lang,
        pv.slug AS slug_vi,
        pv.title AS title_vi,
        pv.excerpt AS excerpt_vi,
        ct.slug AS cat_slug_lang,
        cv.slug AS cat_slug_vi
      FROM sitecontent sc
      INNER JOIN sitecontentcategory scc ON scc.id = sc.siteContentCategoryId
      LEFT JOIN sitecontenttranslation pt ON pt.siteContentId = sc.id AND pt.lang = ${locale}
      LEFT JOIN sitecontenttranslation pv ON pv.siteContentId = sc.id AND pv.lang = 'vi'
      LEFT JOIN sitecontentcategorytranslation ct ON ct.siteContentCategoryId = scc.id AND ct.lang = ${locale}
      LEFT JOIN sitecontentcategorytranslation cv ON cv.siteContentCategoryId = scc.id AND cv.lang = 'vi'
      WHERE sc.status = 'PUBLISHED'
        AND (sc.publishedAt IS NULL OR sc.publishedAt <= ${now})
        AND EXISTS (
          SELECT 1 FROM sitecontentcategorytranslation sct
          WHERE sct.siteContentCategoryId = sc.siteContentCategoryId
            AND sct.slug = ${HOME_BENEFITS_SITE_CONTENT_CATEGORY_SLUG}
        )
      ORDER BY sc.sortOrder ASC, sc.publishedAt DESC, sc.createdAt DESC
      LIMIT 12
    `) as Array<any>;

    benefitHighlights = benefitRows
      .map((r) => {
        const hasLocale = Boolean(r.slug_lang && r.title_lang);
        const useVi = !hasLocale && Boolean(r.slug_vi && r.title_vi);
        if (!hasLocale && !useVi) return null;
        const slug = String((hasLocale ? r.slug_lang : r.slug_vi) ?? "");
        const title = String((hasLocale ? r.title_lang : r.title_vi) ?? "");
        const excerpt = String((hasLocale ? r.excerpt_lang : r.excerpt_vi) ?? "");
        const catSlug = String((r.cat_slug_lang ?? r.cat_slug_vi ?? "")).trim();
        if (!slug || !title || !catSlug) return null;
        return {
          id: String(r.id),
          categorySlug: catSlug,
          slug,
          title,
          excerpt,
          coverImage: (r.coverImage as string | null) ?? null
        } satisfies HomeBenefitHighlightItem;
      })
      .filter(Boolean) as HomeBenefitHighlightItem[];
  } catch {
    benefitHighlights = [];
  }

  const [useCasesPersonal, useCasesCommercial] = await Promise.all([
    loadUseCasesSiteBlock(locale, now, HOME_USE_CASES_PERSONAL_CATEGORY_SLUG),
    loadUseCasesSiteBlock(locale, now, HOME_USE_CASES_COMMERCIAL_CATEGORY_SLUG)
  ]);

  return {
    locale,
    productCategories,
    products,
    certifications,
    partners,
    faqs,
    videos,
    reviews,
    latestNews,
    benefitHighlights,
    useCasesPersonal,
    useCasesCommercial
  };
}

