"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import type { NewsCategory, NewsLocale, NewsPostCard } from "@/lib/news/types";

export function InsightsSection({
  locale,
  posts,
  categories
}: {
  locale: NewsLocale;
  posts: NewsPostCard[];
  categories: NewsCategory[];
}) {
  const t = useTranslations("ifrs.insights");

  const fmt = useMemo(
    () => new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "vi-VN", { day: "2-digit", month: "short", year: "numeric" }),
    [locale]
  );

  function postHref(p: NewsPostCard) {
    return p.category?.slug ? `/${locale}/news/${p.category.slug}/${p.slug}` : `/${locale}/news/${p.slug}`;
  }

  // Không có bài nào thì ẩn cả khu vực để trang chủ không bị trống
  if (!posts.length) return null;

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-title text-2xl font-semibold tracking-tight text-emerald-700 md:text-3xl lg:text-4xl">{t("title")}</h2>
              <p className="mt-4 max-w-2xl text-base leading-[1.75] text-slate-600">{t("subtitle")}</p>
            </div>
            <a
              href={`/${locale}/news`}
              className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 sm:inline-flex"
            >
              {t("viewAll")}
              <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </Reveal>

        {/* Danh mục tin tức — đổ từ cơ sở dữ liệu */}
        {categories.length ? (
          <Reveal>
            <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
              <a
                href={`/${locale}/news`}
                className="shrink-0 rounded-full border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-brand"
              >
                {t("cats.all")}
              </a>
              {categories.map((c) => (
                <a
                  key={c.id}
                  href={`/${locale}/news/${c.slug}`}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  {c.name}
                </a>
              ))}
            </div>
          </Reveal>
        ) : null}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((p) => {
            const dateValue = p.publishedAt ?? p.updatedAt;
            return (
              <Reveal key={p.id}>
                <article className="group h-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_18px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-brand">
                  <a href={postHref(p)} className="flex h-full flex-col focus-visible:outline-none">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      {p.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <span className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-slate-100" aria-hidden="true" />
                      )}
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" aria-hidden="true" />
                      {p.category?.name ? (
                        <span className="absolute left-3 top-3 rounded-full bg-emerald-600/95 px-3 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-sm">
                          {p.category.name}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                          <rect x="3" y="4.5" width="18" height="16" rx="2" />
                          <path d="M3 9h18M8 3v3M16 3v3" strokeLinecap="round" />
                        </svg>
                        <time>{fmt.format(dateValue)}</time>
                      </p>
                      <h3 className="mt-2.5 line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900 transition group-hover:text-emerald-800">
                        {p.title}
                      </h3>
                      {p.excerpt ? (
                        <p className="mt-2 flex-1 line-clamp-2 text-sm leading-relaxed text-slate-600">{p.excerpt}</p>
                      ) : (
                        <span className="flex-1" />
                      )}
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                        {t("readMore")}
                        <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Nút xem tất cả cho mobile */}
        <div className="mt-10 sm:hidden">
          <a
            href={`/${locale}/news`}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            {t("viewAll")}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
