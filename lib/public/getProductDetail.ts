import { prisma } from "@/lib/db";
import { renderProductDescriptionToSafeHtml } from "@/lib/markdown";
import type { Product } from "@/lib/products";

type Locale = "vi" | "en";

/** Một ảnh trong gallery (có alt phục vụ SEO / a11y) */
export type ProductGalleryItem = { src: string; alt: string };

export type ProductDetailData = {
  product: Product;
  related: Product[];
  orderOptions: Array<{ value: string; label: string }>;
  /** Danh sách URL (tương thích code cũ) */
  galleryImages: string[];
  galleryItems: ProductGalleryItem[];
  /** HTML mô tả chi tiết (TipTap hoặc Markdown → đã sanitize) */
  descriptionHtml: string;
  seoTitle: string | null;
  seoDesc: string | null;
};

function safeJsonArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String).filter(Boolean) : [];
}

function mapRowToProduct(row: any): Product {
  const hasLocale = Boolean(row.name_lang);
  const name = (hasLocale ? row.name_lang : row.name_vi) ?? "";
  const shortDesc = (hasLocale ? row.shortDesc_lang : row.shortDesc_vi) ?? "";
  const usage = (hasLocale ? row.usage_lang : row.usage_vi) ?? "";
  const highlights = safeJsonArray(hasLocale ? row.highlights_lang : row.highlights_vi);
  const category = (hasLocale ? row.cat_name_lang : row.cat_name_vi) ?? "";

  const badges = safeJsonArray(row.badges);
  const badge = badges[0] || (row.featured ? "Best seller" : undefined);
  const basePrice = Number(row.priceVnd ?? 0);
  const salePrice = row.salePriceVnd == null ? null : Number(row.salePriceVnd);
  const priceVnd = salePrice && salePrice > 0 && salePrice < basePrice ? salePrice : basePrice;
  const compareAtVnd = salePrice && salePrice > 0 && salePrice < basePrice ? basePrice : undefined;

  return {
    id: String(row.id),
    name: String(name),
    category: String(category),
    shortDesc: String(shortDesc),
    highlights,
    usage: String(usage),
    sizeTag: String(row.sizeTag ?? ""),
    priceVnd,
    ...(compareAtVnd ? { compareAtVnd } : {}),
    ...(badge ? { badge: String(badge) } : {}),
    image: String(row.thumbnailSrc ?? ""),
    ...(row.featured ? { featured: true as const } : {})
  };
}

export async function getProductDetail(locale: Locale, id: string): Promise<ProductDetailData | null> {
  const rows = (await prisma.$queryRaw`
    SELECT
      p.id,
      p.categoryId,
      p.priceVnd,
      p.salePriceVnd,
      p.sizeTag,
      p.thumbnailSrc,
      p.badges,
      p.featured,
      p.sortOrder,
      p.createdAt,

      ct.name AS cat_name_lang,
      cv.name AS cat_name_vi,

      pt.name AS name_lang,
      pt.shortDesc AS shortDesc_lang,
      pt.highlights AS highlights_lang,
      pt.usage AS usage_lang,
      pt.descriptionMarkdown AS desc_md_lang,
      pt.seoTitle AS seo_title_lang,
      pt.seoDesc AS seo_desc_lang,

      pv.name AS name_vi,
      pv.shortDesc AS shortDesc_vi,
      pv.highlights AS highlights_vi,
      pv.usage AS usage_vi,
      pv.descriptionMarkdown AS desc_md_vi,
      pv.seoTitle AS seo_title_vi,
      pv.seoDesc AS seo_desc_vi
    FROM product p
    JOIN category c ON c.id = p.categoryId
    LEFT JOIN categorytranslation ct ON ct.categoryId = c.id AND ct.lang = ${locale}
    LEFT JOIN categorytranslation cv ON cv.categoryId = c.id AND cv.lang = 'vi'
    LEFT JOIN producttranslation pt ON pt.productId = p.id AND pt.lang = ${locale}
    LEFT JOIN producttranslation pv ON pv.productId = p.id AND pv.lang = 'vi'
    WHERE p.status = 'ACTIVE' AND p.id = ${id}
    LIMIT 1
  `) as Array<any>;

  const row = rows[0];
  if (!row) return null;

  const product = mapRowToProduct(row);

  const hasLocale = Boolean(row.name_lang);
  const mdRaw = (hasLocale ? row.desc_md_lang : row.desc_md_vi) ?? "";
  const descriptionHtml = renderProductDescriptionToSafeHtml(String(mdRaw ?? ""));

  const seoTitle = ((hasLocale ? row.seo_title_lang : row.seo_title_vi) ?? null) as string | null;
  const seoDesc = ((hasLocale ? row.seo_desc_lang : row.seo_desc_vi) ?? null) as string | null;

  const imgRows = await prisma.productImage.findMany({
    where: { productId: id },
    orderBy: { sortOrder: "asc" },
    select: { src: true, alt: true }
  });
  const thumb = product.image?.trim();
  const fallbackAlt = product.name;
  const galleryItems: ProductGalleryItem[] = imgRows.length
    ? imgRows
        .map((r) => ({ src: String(r.src ?? "").trim(), alt: String(r.alt ?? "").trim() || fallbackAlt }))
        .filter((g) => g.src)
    : thumb
      ? [{ src: thumb, alt: fallbackAlt }]
      : [];
  const galleryImages = galleryItems.map((g) => g.src);

  const relatedRows = (await prisma.$queryRaw`
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
    WHERE p.status = 'ACTIVE' AND p.categoryId = ${row.categoryId} AND p.id <> ${id}
    ORDER BY p.sortOrder ASC, p.createdAt DESC
    LIMIT 4
  `) as Array<any>;

  const related = relatedRows.map(mapRowToProduct);
  const orderOptions = [product, ...related].map((p) => ({ value: p.name, label: `${p.name} — ${p.sizeTag}` }));

  return { product, related, orderOptions, galleryImages, galleryItems, descriptionHtml, seoTitle, seoDesc };
}
