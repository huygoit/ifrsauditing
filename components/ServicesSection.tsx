"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import type { SiteContentLocale } from "@/lib/siteContent/getSiteContentDetail";
import type { SiteContentCard } from "@/lib/siteContent/getSiteContents";

export function ServicesSection({ locale, services }: { locale: SiteContentLocale; services: SiteContentCard[] }) {
  const t = useTranslations("ifrs.services");

  // Không có dịch vụ trong CMS thì ẩn khu vực để trang chủ không bị trống
  if (!services.length) return null;

  return (
    <section id="dich-vu" className="relative scroll-mt-20 border-t border-slate-200/80 bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeadingBlock title={t("title")} subtitle={t("subtitle")} />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((item) => {
            const href = `/${locale}/noi-dung/${item.category?.slug ?? "dich-vu"}/${item.slug}`;
            return (
              <Reveal key={item.id}>
                <a
                  href={href}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-left shadow-[0_2px_20px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.02] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  <div className="relative w-full">
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
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-700/35 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden="true" />
                    </div>
                    <span className="absolute bottom-0 left-5 inline-flex h-12 w-12 translate-y-1/2 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-brand ring-2 ring-white transition duration-300 group-hover:scale-105">
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M4 8h16a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a1 1 0 011-1z" strokeLinejoin="round" />
                        <path d="M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6 pt-9">
                    <h3 className="text-lg font-semibold leading-snug tracking-tight text-slate-900 line-clamp-2">{item.title}</h3>
                    {item.excerpt ? (
                      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-2">{item.excerpt}</p>
                    ) : (
                      <span className="flex-1" />
                    )}

                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                      {t("viewDetails")}
                      <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SectionHeadingBlock({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold section-title tracking-tight text-emerald-700 md:text-3xl lg:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-[1.75] text-slate-600">{subtitle}</p>
    </div>
  );
}
