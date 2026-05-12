export type SiteLang = "vi" | "en";

export function parseSiteLang(input: unknown): SiteLang {
  return input === "en" ? "en" : "vi";
}

type SiteKey =
  | "news.title"
  | "news.subtitle"
  | "news.back_home"
  | "news.updated_at"
  | "news.empty"
  | "news.back_all"
  | "news.content_updating";

const DICT: Record<SiteLang, Record<SiteKey, string>> = {
  vi: {
    "news.title": "Tin tức",
    "news.subtitle": "Cập nhật mới nhất từ ENSO.",
    "news.back_home": "← Về trang chủ",
    "news.updated_at": "Cập nhật:",
    "news.empty": "Chưa có tin tức.",
    "news.back_all": "← Tất cả tin tức",
    "news.content_updating": "Tin tức đang được cập nhật."
  },
  en: {
    "news.title": "News",
    "news.subtitle": "Latest updates from ENSO.",
    "news.back_home": "← Back to home",
    "news.updated_at": "Updated:",
    "news.empty": "No news yet.",
    "news.back_all": "← All news",
    "news.content_updating": "This article is being updated."
  }
};

export function tSite(lang: SiteLang, key: SiteKey) {
  return DICT[lang][key];
}

