import { prisma } from "@/lib/db";
import type { SiteContentLocale } from "@/lib/siteContent/getSiteContentDetail";

export type ServiceMenuChild = { slug: string; name: string };
export type ServiceMenuItem = { slug: string; name: string; children: ServiceMenuChild[] };

/**
 * Cây menu "Dịch vụ" cho header: danh mục cha/con có type=SERVICE, status=ACTIVE.
 * Bản dịch theo `locale`, thiếu thì fallback sang VI. Bỏ qua mục không có slug.
 */
export async function getServiceMenu(locale: SiteContentLocale): Promise<ServiceMenuItem[]> {
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
    LEFT JOIN sitecontentcategorytranslation tl
      ON tl.siteContentCategoryId = scc.id AND tl.lang = ${locale}
    LEFT JOIN sitecontentcategorytranslation tv
      ON tv.siteContentCategoryId = scc.id AND tv.lang = 'vi'
    WHERE scc.type = 'SERVICE' AND scc.status = 'ACTIVE'
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

  const childrenByParent = new Map<string, ServiceMenuChild[]>();
  for (const r of rows) {
    if (!r.parentId) continue;
    const v = resolve(r);
    if (!v) continue;
    const arr = childrenByParent.get(r.parentId) ?? [];
    arr.push(v);
    childrenByParent.set(r.parentId, arr);
  }

  const items: ServiceMenuItem[] = [];
  for (const r of rows) {
    if (r.parentId) continue;
    const v = resolve(r);
    if (!v) continue;
    items.push({ ...v, children: childrenByParent.get(r.id) ?? [] });
  }
  return items;
}
