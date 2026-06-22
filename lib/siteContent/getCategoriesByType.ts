import { prisma } from "@/lib/db";
import type { SiteContentLocale } from "@/lib/siteContent/getSiteContentDetail";
import type { SiteContentType } from "@/lib/siteContentTypes";

export type SiteCategoryLink = { slug: string; name: string; isChild: boolean };

/**
 * Danh mục ACTIVE theo `type`, sắp xếp cha → con. Tên theo `locale`, fallback VI.
 */
export async function getCategoriesByType(
  locale: SiteContentLocale,
  type: SiteContentType
): Promise<SiteCategoryLink[]> {
  const rows = (await prisma.$queryRaw`
    SELECT
      scc.id AS id,
      scc.parentId AS parentId,
      scc.sortOrder AS sortOrder,
      tl.name AS name_lang,
      tl.slug AS slug_lang,
      tv.name AS name_vi,
      tv.slug AS slug_vi
    FROM sitecontentcategory scc
    LEFT JOIN sitecontentcategorytranslation tl ON tl.siteContentCategoryId = scc.id AND tl.lang = ${locale}
    LEFT JOIN sitecontentcategorytranslation tv ON tv.siteContentCategoryId = scc.id AND tv.lang = 'vi'
    WHERE scc.type = ${type} AND scc.status = 'ACTIVE'
    ORDER BY scc.sortOrder ASC, scc.createdAt ASC
  `) as Array<{
    id: string;
    parentId: string | null;
    sortOrder: number;
    name_lang: string | null;
    slug_lang: string | null;
    name_vi: string | null;
    slug_vi: string | null;
  }>;

  const resolve = (r: (typeof rows)[number]) => {
    const name = (r.name_lang ?? r.name_vi ?? "").trim();
    const slug = (r.slug_lang ?? r.slug_vi ?? "").trim();
    return name && slug ? { name, slug } : null;
  };

  const childrenByParent = new Map<string, (typeof rows)[number][]>();
  for (const r of rows) {
    if (!r.parentId) continue;
    const arr = childrenByParent.get(r.parentId) ?? [];
    arr.push(r);
    childrenByParent.set(r.parentId, arr);
  }

  const out: SiteCategoryLink[] = [];
  for (const r of rows) {
    if (r.parentId) continue;
    const v = resolve(r);
    if (v) out.push({ ...v, isChild: false });
    for (const c of childrenByParent.get(r.id) ?? []) {
      const cv = resolve(c);
      if (cv) out.push({ ...cv, isChild: true });
    }
  }
  return out;
}
