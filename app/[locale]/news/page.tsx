import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryNav } from "@/components/news/CategoryNav";
import { NewsCard } from "@/components/news/NewsCard";
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
      <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{t("title")}</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">{t("subtitle")}</p>
        </header>

        <CategoryNav locale={locale} categories={categories} activeSlug={null} allLabel={t("all")} />

        <section className="mt-6">
          {postsRes.posts.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {postsRes.posts.map((p) => (
                <NewsCard key={p.id} locale={locale} post={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">{t("empty")}</div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

