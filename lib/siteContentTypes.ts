// Loại nội dung gắn ở danh mục (SiteContentCategory.type).
// Dùng chung cho admin (dropdown) và API (validate).

export const SITE_CONTENT_TYPES = ["SERVICE", "IFRS", "RECRUITMENT"] as const;

export type SiteContentType = (typeof SITE_CONTENT_TYPES)[number];

export const DEFAULT_SITE_CONTENT_TYPE: SiteContentType = "SERVICE";

export function isSiteContentType(v: unknown): v is SiteContentType {
  return typeof v === "string" && (SITE_CONTENT_TYPES as readonly string[]).includes(v);
}

export const SITE_CONTENT_TYPE_LABELS: Record<SiteContentType, { vi: string; en: string }> = {
  SERVICE: { vi: "Dịch vụ", en: "Service" },
  IFRS: { vi: "IFRS", en: "IFRS" },
  RECRUITMENT: { vi: "Tuyển dụng", en: "Recruitment" }
};
