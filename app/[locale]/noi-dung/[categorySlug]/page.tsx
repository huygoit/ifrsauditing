import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCategoryWithContents } from "@/lib/siteContent/getCategoryWithContents";
import type { SiteContentLocale } from "@/lib/siteContent/getSiteContentDetail";

export const runtime = "nodejs";

export async function generateMetadata({
  params
}: {
  params: { locale: SiteContentLocale; categorySlug: string };
}): Promise<Metadata> {
  const { locale, categorySlug } = params;
  const data = await getCategoryWithContents(locale, categorySlug);
  if (!data) return {};
  return {
    title: data.name,
    description: data.description || undefined,
    alternates: {
      canonical: `/${locale}/noi-dung/${categorySlug}`,
      languages: {
        vi: `/vi/noi-dung/${categorySlug}`,
        en: `/en/noi-dung/${categorySlug}`
      }
    }
  };
}

export default async function SiteContentCategoryPage({
  params
}: {
  params: { locale: SiteContentLocale; categorySlug: string };
}) {
  const { locale, categorySlug } = params;
  const t = await getTranslations({ locale, namespace: "siteContent" });

  const data = await getCategoryWithContents(locale, categorySlug);
  if (!data) return notFound();

  const emptyText = locale === "en" ? "No content in this category yet." : "Chưa có nội dung trong danh mục này.";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
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
          <div className="relative mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <nav className="text-sm font-semibold text-emerald-100/80">
              <a href={`/${locale}`} className="transition hover:text-white">
                {t("breadcrumbHome")}
              </a>{" "}
              <span className="text-emerald-200/40">→</span>{" "}
              <span className="text-white">{data.name}</span>
            </nav>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">{data.name}</h1>
            {data.description ? (
              <p className="mt-4 max-w-2xl text-base leading-[1.75] text-emerald-50/90 md:text-lg">{data.description}</p>
            ) : null}
          </div>
        </section>

        <section className="bg-white py-14 md:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            {data.items.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((item) => {
                  const href = `/${locale}/noi-dung/${item.category?.slug ?? categorySlug}/${item.slug}`;
                  return (
                    <a
                      key={item.id}
                      href={href}
                      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-left shadow-[0_2px_20px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.02] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
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
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-lg font-semibold leading-snug tracking-tight text-slate-900 line-clamp-2">{item.title}</h3>
                        {item.excerpt ? (
                          <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">{item.excerpt}</p>
                        ) : (
                          <span className="flex-1" />
                        )}
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
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
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">{emptyText}</div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
