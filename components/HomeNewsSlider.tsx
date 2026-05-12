"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { useTranslations } from "next-intl";
import type { HomeNewsItem } from "@/lib/home/getHomeData";

function formatPostDate(isoPublished: string | null, isoUpdated: string, locale: "vi" | "en") {
  const raw = isoPublished || isoUpdated;
  const d = new Date(raw);
  if (Number.isNaN(d.valueOf())) return "";
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

/**
 * Dải tin tức cuộn ngang — đặt phía trên khối chứng nhận / đối tác trên trang chủ.
 */
export function HomeNewsSlider({ locale, items }: { locale: "vi" | "en"; items: HomeNewsItem[] }) {
  const t = useTranslations("home.newsSlider");
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefix = locale === "en" ? "/en" : "/vi";

  if (!items?.length) return null;

  function scrollByDir(dir: -1 | 1) {
    const el = scrollRef.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.82) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  return (
    <section aria-label={t("aria")} className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/90">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="home-section-heading">{t("title")}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByDir(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
              aria-label={t("prev")}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollByDir(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
              aria-label={t("next")}
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
            <Link
              href={`${prefix}/news`}
              className="inline-flex items-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
            >
              {t("viewAll")}
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="mt-6 -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 no-scrollbar snap-x snap-mandatory scroll-smooth sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
        >
          {items.map((post) => {
            const href = `${prefix}/news/${post.categorySlug}/${post.slug}`;
            const dateLine = formatPostDate(post.publishedAt, post.updatedAt, locale);
            return (
              <article
                key={post.id}
                className="w-[min(85vw,300px)] shrink-0 snap-start sm:w-[280px]"
              >
                <Link
                  href={href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 text-emerald-700">
                        <Newspaper className="h-12 w-12 opacity-60" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    {dateLine ? (
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{dateLine}</p>
                    ) : null}
                    <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-slate-900 group-hover:text-emerald-800">
                      {post.title}
                    </h3>
                    {post.excerpt?.trim() ? (
                      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                    ) : null}
                    <span className="mt-3 text-sm font-semibold text-emerald-700">{t("readMore")} →</span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
