import type { SiteContentLocale } from "@/lib/siteContent/getSiteContentDetail";
import type { SiteContentCard } from "@/lib/siteContent/getSiteContents";
import { getContentsByType } from "@/lib/siteContent/getContentsByType";

/**
 * Dịch vụ nổi bật cho trang chủ: nội dung thuộc danh mục có type=SERVICE.
 */
export async function getServiceHighlights(locale: SiteContentLocale, limit = 6): Promise<SiteContentCard[]> {
  return getContentsByType(locale, { type: "SERVICE", limit });
}
