import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryNav } from "@/components/news/CategoryNav";
import { NewsCard } from "@/components/news/NewsCard";
import { getCategories, getCategoryBySlug } from "@/lib/news/getCategories";
import { getPosts } from "@/lib/news/getPosts";
import type { NewsLocale } from "@/lib/news/types";

export const runtime = "nodejs";

export async function generateMetadata({
  params
}: {
  params: { locale: NewsLocale; categorySlug: string };
}): Promise<Metadata> {
  const { locale, categorySlug } = params;
  const t = await getTranslations({ locale, namespace: "news" });
  const cat = await getCategoryBySlug(locale, categorySlug);
  if (!cat) return { title: t("title") };

  const title = cat.seoTitle || cat.name || t("title");
  const description = cat.seoDesc || cat.description || t("subtitle");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/news/${categorySlug}`,
      languages: {
        vi: `/vi/news/${categorySlug}`,
        en: `/en/news/${categorySlug}`
      }
    }
  };
}

export default async function NewsCategoryPage({ params }: { params: { locale: NewsLocale; categorySlug: string } }) {
  const { locale, categorySlug } = params;
  const t = await getTranslations({ locale, namespace: "news" });

  const [categories, cat] = await Promise.all([getCategories(locale), getCategoryBySlug(locale, categorySlug)]);
  if (!cat) return notFound();

  const { posts } = await getPosts(locale, { categorySlug, limit: 30 });

  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cat.name,
    description: cat.seoDesc || cat.description || undefined,
    inLanguage: locale
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <nav className="text-sm font-semibold text-slate-600">
          <a href={`/${locale}`} className="hover:text-slate-900 hover:underline">
            {t("breadcrumbHome")}
          </a>{" "}
          <span className="text-slate-300">→</span>{" "}
          <a href={`/${locale}/news`} className="hover:text-slate-900 hover:underline">
            {t("breadcrumbNews")}
          </a>{" "}
          <span className="text-slate-300">→</span> <span className="text-slate-900">{cat.name}</span>
        </nav>

        <header className="mt-4 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{cat.name}</h1>
          {cat.description ? <p className="max-w-2xl text-base leading-7 text-slate-600">{cat.description}</p> : null}
        </header>

        <CategoryNav locale={locale} categories={categories} activeSlug={cat.slug} allLabel={t("all")} />

        <section className="mt-6">
          {posts.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <NewsCard key={p.id} locale={locale} post={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">{t("emptyCategory")}</div>
          )}
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </main>
      <Footer />
    </div>
  );
}

