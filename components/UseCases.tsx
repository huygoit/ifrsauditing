"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { HomeBenefitHighlightItem, HomeUseCasesPersonalBlock } from "@/lib/home/getHomeData";

function contentHref(locale: "vi" | "en", it: HomeBenefitHighlightItem) {
  return `/${locale}/noi-dung/${encodeURIComponent(it.categorySlug)}/${encodeURIComponent(it.slug)}`;
}

/** Một nhóm use-case lấy từ SiteContent: tiêu đề/mô tả danh mục + lưới thẻ (ảnh nhỏ + tiêu đề + trích). */
function UseCasesSiteBlock({
  locale,
  block,
  titleFallback,
  subtitleFallback,
  emptyMessage,
  ctaLabel,
  noThumbLabel
}: {
  locale: "vi" | "en";
  block: HomeUseCasesPersonalBlock;
  titleFallback: string;
  subtitleFallback: string;
  emptyMessage: string;
  ctaLabel: string;
  noThumbLabel: string;
}) {
  const title = block.heading?.trim() ? block.heading.trim() : titleFallback;
  const subtitle = block.subheading?.trim() ? block.subheading.trim() : subtitleFallback;

  if (!block.items.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-2">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">{title}</h3>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">{subtitle}</p>
          </div>
        </div>
        <p className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center text-sm leading-relaxed text-slate-600">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">{title}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {block.items.map((it) => (
          <a
            key={it.id}
            href={contentHref(locale, it)}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm outline-none transition-all hover:-translate-y-1 hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 ring-1 ring-inset ring-emerald-100/80">
                {it.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.coverImage}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.05]"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="px-1 text-center text-[9px] font-semibold uppercase leading-tight tracking-wide text-emerald-800/50">
                    {noThumbLabel}
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-semibold text-slate-900 transition group-hover:text-emerald-900">{it.title}</h4>
                {it.excerpt ? (
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 line-clamp-4">{it.excerpt}</p>
                ) : null}
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                  {ctaLabel}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function UseCases({
  locale,
  personal,
  commercial
}: {
  locale: "vi" | "en";
  personal: HomeUseCasesPersonalBlock;
  commercial: HomeUseCasesPersonalBlock;
}) {
  const t = useTranslations("home.useCases");

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 md:py-16">
      <h2 className="home-section-heading">{t("title")}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{t("subtitle")}</p>

      <div className="mt-7 grid gap-5">
        <UseCasesSiteBlock
          locale={locale}
          block={personal}
          titleFallback={t("groups.g1.title")}
          subtitleFallback={t("groups.g1.subtitle")}
          emptyMessage={t("personalEmpty")}
          ctaLabel={t("personalCta")}
          noThumbLabel={t("noThumb")}
        />
        <UseCasesSiteBlock
          locale={locale}
          block={commercial}
          titleFallback={t("groups.g2.title")}
          subtitleFallback={t("groups.g2.subtitle")}
          emptyMessage={t("commercialEmpty")}
          ctaLabel={t("personalCta")}
          noThumbLabel={t("noThumb")}
        />
      </div>
    </section>
  );
}
