export type NewsLocale = "vi" | "en";

export type NewsCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  seoTitle: string;
  seoDesc: string;
  sortOrder: number;
  status: string;
  translationLang: NewsLocale;
};

export type NewsPostCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  author: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  category: { id: string; slug: string; name: string } | null;
  translationLang: NewsLocale;
};

export type NewsPostDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  author: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  contentHtml: string;
  contentJson: any | null;
  seoTitle: string;
  seoDesc: string;
  category: NewsCategory | null;
  translationLang: NewsLocale;
};

