import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getContentsByType } from "@/lib/siteContent/getContentsByType";
import { getCategoriesByType } from "@/lib/siteContent/getCategoriesByType";
import type { SiteContentLocale } from "@/lib/siteContent/getSiteContentDetail";

export const runtime = "nodejs";

export async function generateMetadata({ params }: { params: { locale: SiteContentLocale } }): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "recruitment" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/tuyen-dung`,
      languages: { vi: `/vi/tuyen-dung`, en: `/en/tuyen-dung` }
    }
  };
}

function formatDate(locale: SiteContentLocale, d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString(locale === "en" ? "en-US" : "vi-VN", { year: "numeric", month: "short", day: "2-digit" });
}

export default async function RecruitmentPage({ params }: { params: { locale: SiteContentLocale } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "recruitment" });

  const [items, categories] = await Promise.all([
    getContentsByType(locale, { type: "RECRUITMENT", limit: 30 }),
    getCategoriesByType(locale, "RECRUITMENT")
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Banner xanh forest đồng bộ trang tin tức */}
        <section className="relative overflow-hidden border-b border-emerald-400/10 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[#212A31] via-[#124E66] to-[#161D22]" aria-hidden="true" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(65% 60% at 15% 10%, rgba(31,106,135,0.42), transparent 58%),
                radial-gradient(55% 55% at 90% 88%, rgba(18,78,102,0.25), transparent 55%)`
            }}
            aria-hidden="true"
          />
          {/* Icon cặp tài liệu mờ ở mép phải — nhận diện trang tuyển dụng */}
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute right-6 top-1/2 hidden h-36 w-36 -translate-y-1/2 text-emerald-300/15 md:block lg:right-12 lg:h-44 lg:w-44"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <path d="M4 8h16a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a1 1 0 011-1z" strokeLinejoin="round" />
            <path d="M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div className="relative mx-auto max-w-[1200px] px-4 py-8 sm:px-6 md:py-11 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/25 backdrop-blur-sm">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <path d="M4 8h16a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a1 1 0 011-1z" strokeLinejoin="round" />
                  <path d="M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">{t("title")}</h1>
            </div>
            <p className="mt-2.5 max-w-2xl text-sm leading-[1.7] text-emerald-50/90 md:text-base">{t("subtitle")}</p>
          </div>
        </section>

        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <section>
              {items.length ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {items.map((item) => {
                    const href = `/${locale}/noi-dung/${item.category?.slug ?? ""}/${item.slug}`;
                    const dateText = formatDate(locale, item.publishedAt ?? item.updatedAt);
                    return (
                      <a
                        key={item.id}
                        href={href}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_20px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.02] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                      >
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                          {item.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.coverImage}
                              alt={item.title}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <span className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-slate-100" aria-hidden="true" />
                          )}
                          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-950/0 to-slate-950/0" aria-hidden="true" />
                          {item.category?.name ? (
                            <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-emerald-800 shadow-sm backdrop-blur">
                              {item.category.name}
                            </span>
                          ) : null}
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          {dateText ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <rect x="3" y="4.5" width="18" height="16" rx="2" />
                                <path d="M3 9h18M8 3v3M16 3v3" strokeLinecap="round" />
                              </svg>
                              {dateText}
                            </span>
                          ) : null}
                          <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-slate-900 line-clamp-2">{item.title}</h3>
                          {item.excerpt ? (
                            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">{item.excerpt}</p>
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
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">{t("empty")}</div>
              )}
            </section>

            <aside className="space-y-6">
              {categories.length ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t("categoriesTitle")}</h2>
                  <ul className="mt-3 space-y-1">
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <a
                          href={`/${locale}/noi-dung/${c.slug}`}
                          className={`block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-emerald-50 hover:text-emerald-800 ${
                            c.isChild ? "pl-6 text-slate-600" : "text-slate-800"
                          }`}
                        >
                          {c.isChild ? "└─ " : ""}
                          {c.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-[#212A31] to-[#161D22] p-6 text-white shadow-lg">
                <h2 className="text-base font-bold leading-snug">{t("ctaTitle")}</h2>
                <p className="mt-2 text-sm leading-relaxed text-emerald-50/85">{t("ctaDesc")}</p>
                <a
                  href={`/${locale}#lien-he`}
                  className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
                >
                  {t("ctaButton")}
                </a>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
