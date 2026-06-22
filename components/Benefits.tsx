"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import type { HomeBenefitHighlightItem } from "@/lib/home/getHomeData";

type Props = {
  locale: "vi" | "en";
  items: HomeBenefitHighlightItem[];
};

function benefitHref(locale: "vi" | "en", it: HomeBenefitHighlightItem) {
  return `/${locale}/noi-dung/${encodeURIComponent(it.categorySlug)}/${encodeURIComponent(it.slug)}`;
}

/** Thẻ lớn: ảnh full + chữ overlay — “showcase”, không giống card tin. */
function BenefitSpotlightCard({
  it,
  locale,
  readMore,
  noImage,
  variant,
  stackFill
}: {
  it: HomeBenefitHighlightItem;
  locale: "vi" | "en";
  readMore: string;
  noImage: string;
  variant: "hero" | "compact";
  /** Một thẻ phụ duy nhất bên cạnh hero: kéo cao full cột. */
  stackFill?: boolean;
}) {
  const href = benefitHref(locale, it);
  const isHero = variant === "hero";
  const hasImage = Boolean(it.coverImage);

  return (
    <a
      href={href}
      className={[
        "group relative flex overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-lg shadow-slate-900/[0.06] outline-none ring-1 ring-slate-900/[0.03] transition-all duration-300",
        "hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/[0.07] focus-visible:ring-2 focus-visible:ring-emerald-500/45",
        isHero
          ? "h-full min-h-[280px] flex-col justify-end sm:min-h-[340px] lg:min-h-0"
          : stackFill
            ? "h-full min-h-[220px] flex-col justify-end sm:min-h-[260px] lg:min-h-0 lg:flex-1"
            : "min-h-[200px] flex-col justify-end sm:min-h-[220px]"
      ].join(" ")}
    >
      {it.coverImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={it.coverImage}
            alt=""
            className={[
              "absolute inset-0 h-full w-full object-cover transition duration-700 ease-out",
              "group-hover:scale-[1.06] group-hover:brightness-110"
            ].join(" ")}
            loading="lazy"
          />
          {/* Gradient đáy: cân bằng — tối vừa đủ để chữ trắng rõ, ảnh vẫn không đen đặc như bản đầu */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-950/86 via-slate-900/58 to-transparent opacity-[0.8] transition duration-300 group-hover:from-slate-950/90 group-hover:via-slate-900/62 group-hover:opacity-[0.84]"
            aria-hidden
          />
        </>
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50/90 to-slate-100"
          aria-hidden
        />
      )}

      {!it.coverImage ? (
        <div className="absolute inset-0 flex items-center justify-center pb-16 text-center text-xs font-medium text-emerald-700/45">
          {noImage}
        </div>
      ) : null}

      <div className={["relative z-[1] flex flex-col p-5 sm:p-6", isHero ? "lg:p-8" : ""].join(" ")}>
        <span
          className={[
            "inline-flex max-w-prose font-semibold tracking-tight",
            hasImage ? "text-white drop-shadow-[0_2px_12px_rgb(0_0_0/0.55)]" : "text-slate-900",
            isHero ? "text-xl leading-snug sm:text-2xl lg:text-3xl" : "text-base leading-snug sm:text-lg"
          ].join(" ")}
        >
          {it.title}
        </span>
        {it.excerpt ? (
          <p
            className={[
              "mt-2 max-w-prose text-pretty",
              hasImage ? "text-emerald-50/95 drop-shadow-[0_1px_8px_rgb(0_0_0/0.45)]" : "text-slate-600",
              isHero ? "line-clamp-3 text-sm leading-relaxed sm:line-clamp-4 sm:text-base" : "line-clamp-2 text-xs leading-relaxed sm:text-sm"
            ].join(" ")}
          >
            {it.excerpt}
          </p>
        ) : null}
        <span
          className={[
            "mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]",
            hasImage ? "text-emerald-200/95" : "text-emerald-700"
          ].join(" ")}
        >
          <Sparkles className={["h-3.5 w-3.5", hasImage ? "text-emerald-200" : "text-emerald-600"].join(" ")} aria-hidden />
          {readMore}
        </span>
      </div>
    </a>
  );
}

export function Benefits({ locale, items }: Props) {
  const t = useTranslations("home.benefits");

  const shell = (children: ReactNode, body: ReactNode) => (
    <section id="cong-dung" className="scroll-mt-24 relative overflow-hidden">
      {/* Nền nhạt đồng bộ hero: xanh lá rất nhẹ + trắng + xám lạnh */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/95 via-white to-slate-50" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-emerald-100/50 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-[360px] w-[360px] rounded-full bg-teal-100/40 blur-[90px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(18 78 102 / 0.2) 1px, transparent 0)`,
          backgroundSize: "28px 28px"
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {children}
        {body}
      </div>
    </section>
  );

  if (!items.length) {
    return shell(
      <header className="max-w-2xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 bg-emerald-50/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-800/90">
          {t("eyebrow")}
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-emerald-700 md:text-4xl">{t("title")}</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">{t("subtitle")}</p>
      </header>,
      <p className="mt-10 rounded-2xl border border-dashed border-emerald-200/70 bg-white/80 px-5 py-10 text-center text-sm leading-relaxed text-slate-600">
        {t("empty")}
      </p>
    );
  }

  const [hero, ...rest] = items;
  const topRight = rest.slice(0, 2);
  const more = rest.slice(2);

  return shell(
    <header className="max-w-2xl">
      <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 bg-emerald-50/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-800/90">
        {t("eyebrow")}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-emerald-700 md:text-4xl">{t("title")}</h2>
      <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">{t("subtitle")}</p>
    </header>,
    <>
      {/* Bento: 1 ô lớn + tối đa 2 ô phụ cột phải; phần còn lại hàng riêng */}
      <div className="mt-12 grid gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5 lg:min-h-[420px]">
        <div className="min-h-0 lg:col-span-8 lg:row-span-2">
          <BenefitSpotlightCard
            it={hero}
            locale={locale}
            readMore={t("readMore")}
            noImage={t("noImage")}
            variant="hero"
          />
        </div>
        {topRight.map((it, idx) => (
          <div
            key={it.id}
            className={
              rest.length === 1
                ? "min-h-0 lg:col-span-4 lg:row-span-2 lg:flex lg:flex-col"
                : "min-h-0 lg:col-span-4 lg:row-span-1"
            }
          >
            <BenefitSpotlightCard
              it={it}
              locale={locale}
              readMore={t("readMore")}
              noImage={t("noImage")}
              variant="compact"
              stackFill={rest.length === 1 && idx === 0}
            />
          </div>
        ))}
      </div>

      {more.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:mt-5 lg:grid-cols-3 lg:gap-5">
          {more.map((it) => (
            <BenefitSpotlightCard
              key={it.id}
              it={it}
              locale={locale}
              readMore={t("readMore")}
              noImage={t("noImage")}
              variant="compact"
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
