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

/** Segment URL khi bài chưa gán danh mục (vd: /noi-dung/tuyen-dung/{slug}). */
export const SITE_CONTENT_TYPE_PATH: Record<SiteContentType, string> = {
  SERVICE: "dich-vu",
  IFRS: "ifrs",
  RECRUITMENT: "tuyen-dung"
};

/** Đường dẫn URL theo loại nội dung; không khớp thì dùng dịch vụ. */
export function pathSlugForType(type: string | null | undefined): string {
  if (type && isSiteContentType(type)) return SITE_CONTENT_TYPE_PATH[type];
  return SITE_CONTENT_TYPE_PATH.SERVICE;
}

/** Đổi segment URL thành loại nội dung (null nếu không phải slug loại). */
export function typeFromPathSlug(slug: string | null | undefined): SiteContentType | null {
  const clean = (slug ?? "").trim();
  if (!clean) return null;
  for (const t of SITE_CONTENT_TYPES) {
    if (SITE_CONTENT_TYPE_PATH[t] === clean) return t;
  }
  return null;
}

/** Nhãn hiển thị theo loại + ngôn ngữ. */
export function typeLabel(type: SiteContentType, locale: "vi" | "en"): string {
  return SITE_CONTENT_TYPE_LABELS[type][locale];
}
