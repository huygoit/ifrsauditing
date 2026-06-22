import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CategoryNav } from "@/components/news/CategoryNav";
import type { NewsCategory, NewsLocale, NewsPostCard } from "@/lib/news/types";

function formatDate(locale: NewsLocale, d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "vi-VN", { year: "numeric", month: "short", day: "2-digit" });
}

export async function NewsSidebar({
  locale,
  categories,
  activeSlug,
  recentPosts
}: {
  locale: NewsLocale;
  categories: NewsCategory[];
  activeSlug: string | null;
  recentPosts: NewsPostCard[];
}) {
  const t = await getTranslations({ locale, namespace: "news" });

  return (
    <aside className="space-y-6 lg:sticky lg:top-28">
      {/* Danh mục — chỉ hiện ở desktop (mobile đã có thanh ngang phía trên) */}
      <div className="hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_16px_rgba(15,23,42,0.04)] lg:block">
        <p className="section-title text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">{t("categoriesTitle")}</p>
        <div className="mt-4">
          <CategoryNav locale={locale} categories={categories} activeSlug={activeSlug} allLabel={t("all")} variant="vertical" />
        </div>
      </div>

      {/* Bài viết mới */}
      {recentPosts.length ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_16px_rgba(15,23,42,0.04)]">
          <p className="section-title text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">{t("recentPosts")}</p>
          <ul className="mt-4 space-y-4">
            {recentPosts.map((p) => {
              const href = p.category?.slug ? `/${locale}/news/${p.category.slug}/${p.slug}` : `/${locale}/news/${p.slug}`;
              const dateText = formatDate(locale, p.publishedAt ?? p.updatedAt);
              return (
                <li key={p.id}>
                  <Link href={href} className="group flex gap-3">
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {p.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <span className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-slate-100" aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-sm font-semibold leading-snug text-slate-800 transition group-hover:text-emerald-700">
                        {p.title}
                      </span>
                      {dateText ? <span className="mt-1 block text-xs text-slate-500">{dateText}</span> : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {/* CTA tư vấn — nền xanh forest đồng bộ thương hiệu */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-400/10 p-6 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#212A31] via-[#124E66] to-[#161D22]" aria-hidden="true" />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(70% 60% at 20% 10%, rgba(31,106,135,0.42), transparent 60%)" }}
          aria-hidden="true"
        />
        <div className="relative">
          <p className="text-lg font-semibold leading-snug">{t("ctaTitle")}</p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-50/85">{t("ctaDesc")}</p>
          <Link
            href={`/${locale}#lien-he`}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
          >
            {t("ctaButton")}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  );
}
