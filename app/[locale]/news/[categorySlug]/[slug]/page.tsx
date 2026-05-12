import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RelatedPosts } from "@/components/news/RelatedPosts";
import { CategoryNav } from "@/components/news/CategoryNav";
import { getCategories } from "@/lib/news/getCategories";
import { getPostBySlug } from "@/lib/news/getPostBySlug";
import { renderTiptapJsonToSafeHtml } from "@/lib/editor/renderTiptapJson";
import type { NewsLocale } from "@/lib/news/types";

export const runtime = "nodejs";

export async function generateMetadata({
  params
}: {
  params: { locale: NewsLocale; categorySlug: string; slug: string };
}): Promise<Metadata> {
  const { locale, categorySlug, slug } = params;
  const t = await getTranslations({ locale, namespace: "news" });
  const data = await getPostBySlug(locale, categorySlug, slug);
  if (!data) return { title: t("title") };

  const title = data.post.seoTitle || data.post.title || t("title");
  const description = data.post.seoDesc || data.post.excerpt || t("subtitle");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/news/${categorySlug}/${slug}`,
      languages: {
        vi: `/vi/news/${categorySlug}/${slug}`,
        en: `/en/news/${categorySlug}/${slug}`
      }
    },
    openGraph: {
      title,
      description,
      images: data.post.coverImage ? [data.post.coverImage] : undefined,
      type: "article"
    }
  };
}

function formatDate(locale: NewsLocale, d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString(locale === "en" ? "en-US" : "vi-VN", { year: "numeric", month: "short", day: "2-digit" });
}

export default async function NewsDetailPage({ params }: { params: { locale: NewsLocale; categorySlug: string; slug: string } }) {
  const { locale, categorySlug, slug } = params;
  const t = await getTranslations({ locale, namespace: "news" });

  const data = await getPostBySlug(locale, categorySlug, slug);
  if (!data) return notFound();

  const { post, related, recent, category } = data;
  const categories = await getCategories(locale);

  const html = renderTiptapJsonToSafeHtml({ contentJson: post.contentJson, htmlFallback: post.contentHtml });
  const dateText = formatDate(locale, post.publishedAt ?? post.updatedAt);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt ? post.publishedAt.toISOString() : undefined,
    dateModified: post.updatedAt.toISOString(),
    author: post.author ? [{ "@type": "Person", name: post.author }] : undefined,
    articleSection: category?.name ?? undefined,
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
          {category ? (
            <>
              <span className="text-slate-300">→</span>{" "}
              <a href={`/${locale}/news/${category.slug}`} className="hover:text-slate-900 hover:underline">
                {category.name}
              </a>
            </>
          ) : null}{" "}
          <span className="text-slate-300">→</span> <span className="text-slate-900">{post.title}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <article>
            <header>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{post.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-slate-600">
                {dateText ? <span>{t("publishedAt")} {dateText}</span> : null}
                {dateText && post.author ? <span className="text-slate-300">·</span> : null}
                {post.author ? <span>{post.author}</span> : null}
                {category?.name ? (
                  <>
                    <span className="text-slate-300">·</span>
                    <a href={`/${locale}/news/${category.slug}`} className="text-emerald-700 hover:text-emerald-800 hover:underline">
                      {category.name}
                    </a>
                  </>
                ) : null}
              </div>
              {post.excerpt ? <p className="mt-4 text-base leading-7 text-slate-600">{post.excerpt}</p> : null}
            </header>

            {post.coverImage ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.coverImage} alt={post.title} className="h-auto w-full object-cover" />
              </div>
            ) : null}

            <section className="mt-8">
              {html ? (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
              ) : (
                <p className="text-sm text-slate-600">{t("contentUpdating")}</p>
              )}
            </section>

            <div className="mt-10 border-t border-slate-200 pt-8" />
            <RelatedPosts locale={locale} title={t("relatedPosts")} posts={related} />

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
          </article>

          {/* Sidebar (desktop only) */}
          <aside className="hidden lg:block">
            <div className="sticky top-[88px] grid gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("breadcrumbNews")}</p>
                <CategoryNav locale={locale} categories={categories} activeSlug={category?.slug ?? null} allLabel={t("all")} variant="vertical" />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{t("recentPosts")}</p>
                <div className="mt-3 grid gap-2">
                  {recent.map((p) => (
                    <a
                      key={p.id}
                      href={p.category?.slug ? `/${locale}/news/${p.category.slug}/${p.slug}` : `/${locale}/news/${p.slug}`}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <span className="line-clamp-2">{p.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

