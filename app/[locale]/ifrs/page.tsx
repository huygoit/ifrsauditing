import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsCard } from "@/components/news/NewsCard";
import { getPosts } from "@/lib/news/getPosts";
import type { NewsLocale } from "@/lib/news/types";

export const runtime = "nodejs";

const WHY_KEYS = ["i1", "i2", "i3", "i4"] as const;
const ROADMAP_KEYS = ["s1", "s2", "s3"] as const;
const DIFF_KEYS = ["r1", "r2", "r3", "r4"] as const;
const STAT_KEYS = ["s1", "s2", "s3"] as const;
const SERVICE_KEYS = ["i1", "i2", "i3"] as const;

export async function generateMetadata({ params }: { params: { locale: NewsLocale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "ifrsPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: {
      canonical: `/${params.locale}/ifrs`,
      languages: { vi: `/vi/ifrs`, en: `/en/ifrs` }
    }
  };
}

export default async function IfrsPage({ params }: { params: { locale: NewsLocale } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "ifrsPage" });

  const { posts } = await getPosts(locale, { categorySlug: "ifrs", limit: 9 });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero chuyên đề — nền xanh forest đồng bộ thương hiệu */}
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
          <div className="relative mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.08] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden="true" />
              {t("hero.eyebrow")}
            </span>
            <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">{t("hero.title")}</h1>
            <p className="mt-5 max-w-2xl text-base leading-[1.75] text-emerald-50/90 md:text-lg">{t("hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`/${locale}#lien-he`}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
              >
                {t("hero.ctaPrimary")}
              </a>
              <a
                href="#bai-viet"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t("hero.ctaSecondary")}
              </a>
            </div>
          </div>
        </section>

        {/* IFRS là gì + số liệu nhanh */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
              <h2 className="section-title text-2xl font-semibold tracking-tight text-emerald-700 md:text-3xl">{t("what.title")}</h2>
              <p className="mt-5 text-base leading-[1.85] text-slate-600">{t("what.body")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {STAT_KEYS.map((k) => (
                <div key={k} className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-emerald-50/60 to-white p-5 text-center shadow-[0_2px_16px_rgba(15,23,42,0.04)]">
                  <p className="whitespace-nowrap text-sm font-bold text-emerald-700">{t(`what.stats.${k}.value`)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(`what.stats.${k}.label`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vì sao cần IFRS */}
        <section className="border-t border-slate-200/80 bg-slate-50 py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-2xl font-semibold tracking-tight text-emerald-700 md:text-3xl">{t("why.title")}</h2>
            <p className="mt-4 max-w-2xl text-base leading-[1.75] text-slate-600">{t("why.subtitle")}</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {WHY_KEYS.map((k) => (
                <div key={k} className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-brand">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-brand ring-1 ring-emerald-400/20">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="mt-4 text-[15px] font-semibold text-slate-900">{t(`why.items.${k}.title`)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(`why.items.${k}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lộ trình áp dụng tại Việt Nam */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-2xl font-semibold tracking-tight text-emerald-700 md:text-3xl">{t("roadmap.title")}</h2>
            <p className="mt-4 max-w-2xl text-base leading-[1.75] text-slate-600">{t("roadmap.subtitle")}</p>
            <ol className="mt-10 grid gap-6 lg:grid-cols-3">
              {ROADMAP_KEYS.map((k) => (
                <li key={k} className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-1.5 text-sm font-bold text-white shadow-brand ring-1 ring-emerald-400/20">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                      <rect x="3" y="4.5" width="18" height="16" rx="2" />
                      <path d="M3 9h18M8 3v3M16 3v3" strokeLinecap="round" />
                    </svg>
                    {t(`roadmap.steps.${k}.period`)}
                  </span>
                  <p className="mt-4 text-lg font-semibold text-slate-900">{t(`roadmap.steps.${k}.title`)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(`roadmap.steps.${k}.desc`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Khác biệt VAS vs IFRS */}
        <section className="border-t border-slate-200/80 bg-slate-50 py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-2xl font-semibold tracking-tight text-emerald-700 md:text-3xl">{t("diff.title")}</h2>
            <p className="mt-4 max-w-2xl text-base leading-[1.75] text-slate-600">{t("diff.subtitle")}</p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_16px_rgba(15,23,42,0.04)]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-emerald-700 text-white">
                    <th className="px-4 py-3.5 font-semibold md:px-6">{t("diff.aspect")}</th>
                    <th className="px-4 py-3.5 font-semibold md:px-6">{t("diff.vas")}</th>
                    <th className="px-4 py-3.5 font-semibold md:px-6">{t("diff.ifrs")}</th>
                  </tr>
                </thead>
                <tbody>
                  {DIFF_KEYS.map((k, i) => (
                    <tr key={k} className={i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}>
                      <td className="px-4 py-3.5 font-medium text-slate-900 md:px-6">{t(`diff.rows.${k}.aspect`)}</td>
                      <td className="px-4 py-3.5 text-slate-600 md:px-6">{t(`diff.rows.${k}.vas`)}</td>
                      <td className="px-4 py-3.5 text-emerald-800 md:px-6">{t(`diff.rows.${k}.ifrs`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Dịch vụ IFRS Auditing hỗ trợ */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
              <h2 className="section-title text-2xl font-semibold tracking-tight text-emerald-700 md:text-3xl">{t("service.title")}</h2>
              <p className="mt-5 text-base leading-[1.85] text-slate-600">{t("service.desc")}</p>
              <a
                href={`/${locale}#dich-vu`}
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-brand ring-1 ring-emerald-400/20 transition hover:brightness-105"
              >
                {t("service.cta")}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
            <ul className="grid gap-3">
              {SERVICE_KEYS.map((k) => (
                <li key={k} className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium leading-relaxed text-slate-700">{t(`service.items.${k}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Bài viết chuyên sâu — đổ từ danh mục IFRS trong DB */}
        <section id="bai-viet" className="scroll-mt-20 border-t border-slate-200/80 bg-slate-50 py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="section-title text-2xl font-semibold tracking-tight text-emerald-700 md:text-3xl">{t("articles.title")}</h2>
                <p className="mt-4 max-w-2xl text-base leading-[1.75] text-slate-600">{t("articles.subtitle")}</p>
              </div>
              <a href={`/${locale}/news/ifrs`} className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 sm:inline-flex">
                {t("articles.viewAll")}
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {posts.length ? (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => (
                  <NewsCard key={p.id} locale={locale} post={p} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">{t("articles.empty")}</div>
            )}
          </div>
        </section>

        {/* CTA cuối trang */}
        <section className="relative overflow-hidden py-16 text-white md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#212A31] via-[#124E66] to-[#161D22]" aria-hidden="true" />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "radial-gradient(70% 60% at 20% 10%, rgba(31,106,135,0.42), transparent 60%)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-[1200px] px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mx-auto max-w-2xl text-2xl font-bold tracking-tight md:text-3xl">{t("cta.title")}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-[1.75] text-emerald-50/90">{t("cta.desc")}</p>
            <a
              href={`/${locale}#lien-he`}
              className="mt-8 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
            >
              {t("cta.button")}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
