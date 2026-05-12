import { MetadataRoute } from "next";
import { SEO } from "@/lib/seo.config";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SEO.siteUrl;
  const locales = ["vi", "en"] as const;

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${base}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    });
    entries.push({
      url: `${base}/${locale}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    });
    entries.push({
      url: `${base}/${locale}/videos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    });
  }

  try {
    const catRows = (await prisma.$queryRaw`
      SELECT slug FROM postcategorytranslation WHERE lang = 'vi'
    `) as Array<{ slug: string | null }>;

    const postRows = (await prisma.$queryRaw`
      SELECT pt.slug AS slug, cv.slug AS catSlug, p.updatedAt
      FROM post p
      JOIN posttranslation pt ON pt.postId = p.id AND pt.lang = 'vi'
      LEFT JOIN postcategorytranslation cv ON cv.postCategoryId = p.postCategoryId AND cv.lang = 'vi'
      WHERE p.status = 'PUBLISHED' AND (p.publishedAt IS NULL OR p.publishedAt <= NOW())
    `) as Array<{ slug: string; catSlug: string | null; updatedAt: Date }>;

    for (const locale of locales) {
      for (const c of catRows) {
        const slug = c.slug;
        if (slug)
          entries.push({
            url: `${base}/${locale}/news/${slug}`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8
          });
      }
      for (const row of postRows) {
        const cat = row.catSlug ?? "tin-tuc";
        if (row.slug)
          entries.push({
            url: `${base}/${locale}/news/${cat}/${row.slug}`,
            lastModified: row.updatedAt ? new Date(row.updatedAt) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7
          });
      }
    }
  } catch {
    // DB may be unavailable during build
  }

  return entries;
}
