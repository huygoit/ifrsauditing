import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSiteContentDetail } from "@/lib/siteContent/getSiteContentDetail";
import { renderTiptapJsonToSafeHtml } from "@/lib/editor/renderTiptapJson";
import type { SiteContentLocale } from "@/lib/siteContent/getSiteContentDetail";

export const runtime = "nodejs";

export async function generateMetadata({
  params
}: {
  params: { locale: SiteContentLocale; categorySlug: string; slug: string };
}): Promise<Metadata> {
  const { locale, categorySlug, slug } = params;
  const t = await getTranslations({ locale, namespace: "siteContent" });
  const data = await getSiteContentDetail(locale, categorySlug, slug);
  if (!data) return { title: t("breadcrumbSection") };

  const title = data.seoTitle || data.title || t("breadcrumbSection");
  const description = data.seoDesc || data.excerpt || "";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/noi-dung/${categorySlug}/${slug}`,
      languages: {
        vi: `/vi/noi-dung/${categorySlug}/${slug}`,
        en: `/en/noi-dung/${categorySlug}/${slug}`
      }
    },
    openGraph: {
      title,
      description,
      images: data.coverImage ? [data.coverImage] : undefined,
      type: "article"
    }
  };
}

function formatDate(locale: SiteContentLocale, d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString(locale === "en" ? "en-US" : "vi-VN", { year: "numeric", month: "short", day: "2-digit" });
}

export default async function SiteContentDetailPage({
  params
}: {
  params: { locale: SiteContentLocale; categorySlug: string; slug: string };
}) {
  const { locale, categorySlug, slug } = params;
  const t = await getTranslations({ locale, namespace: "siteContent" });

  const data = await getSiteContentDetail(locale, categorySlug, slug);
  if (!data) return notFound();

  const html = renderTiptapJsonToSafeHtml({ contentJson: data.contentJson, htmlFallback: data.contentHtml });
  const dateText = formatDate(locale, data.publishedAt ?? data.updatedAt);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    image: data.coverImage ? [data.coverImage] : undefined,
    datePublished: data.publishedAt ? data.publishedAt.toISOString() : undefined,
    dateModified: data.updatedAt.toISOString(),
    author: data.author ? [{ "@type": "Person", name: data.author }] : undefined,
    articleSection: data.category.name,
    inLanguage: locale
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 lg:px-8">
        <nav className="text-sm font-semibold text-slate-600">
          <a href={`/${locale}`} className="hover:text-slate-900 hover:underline">
            {t("breadcrumbHome")}
          </a>{" "}
          <span className="text-slate-300">→</span> <span className="text-slate-500">{t("breadcrumbSection")}</span>{" "}
          <span className="text-slate-300">→</span> <span className="text-slate-900">{data.title}</span>
        </nav>

        <article className="mt-8">
          <header>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{data.category.name}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{data.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-slate-600">
              {dateText ? (
                <span>
                  {t("publishedAt")} {dateText}
                </span>
              ) : null}
              {dateText && data.author ? <span className="text-slate-300">·</span> : null}
              {data.author ? <span>{data.author}</span> : null}
            </div>
            {data.excerpt ? <p className="mt-4 text-base leading-7 text-slate-600">{data.excerpt}</p> : null}
          </header>

          {data.coverImage ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.coverImage} alt={data.title} className="h-auto w-full object-cover" />
            </div>
          ) : null}

          <section className="mt-8">
            {html ? (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <p className="text-sm text-slate-600">{t("contentUpdating")}</p>
            )}
          </section>

          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        </article>
      </main>
      <Footer />
    </div>
  );
}
