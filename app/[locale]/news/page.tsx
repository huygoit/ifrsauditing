import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryNav } from "@/components/news/CategoryNav";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsSidebar } from "@/components/news/NewsSidebar";
import { getCategories } from "@/lib/news/getCategories";
import { getPosts } from "@/lib/news/getPosts";
import type { NewsLocale } from "@/lib/news/types";

export const runtime = "nodejs";

export async function generateMetadata({ params }: { params: { locale: NewsLocale } }): Promise<Metadata> {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: "news" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/news`,
      languages: {
        vi: `/vi/news`,
        en: `/en/news`
      }
    }
  };
}

export default async function NewsHomePage({ params }: { params: { locale: NewsLocale } }) {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: "news" });

  const [categories, postsRes] = await Promise.all([getCategories(locale), getPosts(locale, { limit: 30 })]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Banner xanh forest đồng bộ hero/header */}
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
          {/* Icon tờ báo mờ ở mép phải — nhận diện ngay là trang tin tức */}
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute right-6 top-1/2 hidden h-36 w-36 -translate-y-1/2 text-emerald-300/15 md:block lg:right-12 lg:h-44 lg:w-44"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <path d="M4 5h13a1 1 0 011 1v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" strokeLinejoin="round" />
            <path d="M18 8h1.5a1 1 0 011 1v9a2 2 0 01-2 2" strokeLinejoin="round" />
            <path d="M6.5 8.5h8M6.5 12h8M6.5 15.5h5" strokeLinecap="round" />
          </svg>

          <div className="relative mx-auto max-w-[1200px] px-4 py-8 sm:px-6 md:py-11 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/25 backdrop-blur-sm">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <path d="M4 5h13a1 1 0 011 1v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" strokeLinejoin="round" />
                  <path d="M18 8h1.5a1 1 0 011 1v9a2 2 0 01-2 2" strokeLinejoin="round" />
                  <path d="M6.5 8.5h8M6.5 12h8M6.5 15.5h5" strokeLinecap="round" />
                </svg>
              </span>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">{t("title")}</h1>
            </div>
            <p className="mt-2.5 max-w-2xl text-sm leading-[1.7] text-emerald-50/90 md:text-base">{t("subtitle")}</p>
          </div>
        </section>

        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          {/* Thanh danh mục ngang — chỉ cho mobile/tablet, desktop dùng sidebar */}
          <div className="lg:hidden">
            <CategoryNav locale={locale} categories={categories} activeSlug={null} allLabel={t("all")} />
          </div>

          <div className="mt-8 grid gap-8 lg:mt-0 lg:grid-cols-[1fr_320px]">
            <section>
              {postsRes.posts.length ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {postsRes.posts.map((p) => (
                    <NewsCard key={p.id} locale={locale} post={p} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">{t("empty")}</div>
              )}
            </section>

            <NewsSidebar locale={locale} categories={categories} activeSlug={null} recentPosts={postsRes.posts.slice(0, 5)} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

