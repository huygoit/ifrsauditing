"use client";

import { PatternBg } from "@/components/PatternBg";
import { LinkButton } from "@/components/Button";
import { SITE } from "@/lib/site";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("ifrs.hero");
  const tc = useTranslations("ifrs");

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 pb-20 pt-12 md:pb-28 md:pt-16 lg:pb-32 lg:pt-20">
      <PatternBg variant="heroDark" />
      {/* Viền tối nhẹ — tăng chiều sâu luxury, không thêm số liệu */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/55 via-transparent to-slate-950/90"
        aria-hidden="true"
      />

      <div className="relative z-[2] mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <div className="lg:col-span-6">
          <div className="flex flex-wrap gap-2.5">
            <span className="rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-emerald-50/95 shadow-sm backdrop-blur-md">
              {t("badgeIndependence")}
            </span>
            <span className="rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-emerald-50/95 shadow-sm backdrop-blur-md">
              {t("badgeTransparency")}
            </span>
            <span className="rounded-full border border-amber-400/25 bg-amber-400/[0.08] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-amber-100 shadow-sm backdrop-blur-md">
              {t("badgeEfficiency")}
            </span>
          </div>

          <h1 className="mt-8 text-balance text-4xl font-bold leading-[1.06] tracking-tight text-white md:mt-10 md:text-5xl lg:text-6xl">
            {t("headline")}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-[1.75] text-slate-200/95 md:text-lg md:leading-[1.75]">
            {t("desc")}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <LinkButton
              href="#lien-he"
              variant="primary"
              size="md"
              className="min-h-[48px] border border-emerald-400/25 bg-emerald-500 px-6 shadow-lg shadow-emerald-950/40 ring-1 ring-white/10 transition hover:bg-emerald-400 hover:shadow-emerald-900/50"
            >
              {tc("ctaConsult")}
            </LinkButton>
            <LinkButton
              href="#dich-vu"
              variant="onDark"
              size="md"
              className="min-h-[48px] border-white/25 bg-white/[0.07] px-6 hover:border-white/35 hover:bg-white/[0.12]"
            >
              {tc("ctaExplore")}
            </LinkButton>
            <a
              href={`tel:${SITE.hotlineTel}`}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/18 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {SITE.hotlineDisplay}
            </a>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] ring-1 ring-white/[0.06] backdrop-blur-md sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200/90">{t("dashboardTitle")}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200/95">{t("dashboardSub")}</p>
              <div className="mt-5 space-y-0 text-[13px] leading-snug text-slate-200/95">
                <div className="flex items-center justify-between border-b border-white/10 py-2.5">
                  <span>{t("checklist1")}</span>
                  <span className="text-emerald-300" aria-hidden="true">
                    ✓
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 py-2.5">
                  <span>{t("checklist2")}</span>
                  <span className="text-emerald-300" aria-hidden="true">
                    ✓
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span>{t("checklist3")}</span>
                  <span className="text-amber-200/80" aria-hidden="true">
                    …
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-white/12 bg-gradient-to-br from-emerald-900/40 to-slate-950/55 p-5 shadow-inner ring-1 ring-emerald-500/15 backdrop-blur-md">
                <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-100/80">{t("visualKpi1")}</p>
                <p className="mt-2.5 text-lg font-semibold leading-snug tracking-tight text-white md:text-xl">{t("visualKpi1Lead")}</p>
                <div className="mt-4 h-px w-full bg-gradient-to-r from-emerald-400/40 via-white/10 to-transparent" aria-hidden="true" />
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.22)] backdrop-blur-md">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{t("visualKpi2")}</p>
                <p className="mt-2 text-lg font-semibold leading-snug tracking-tight text-white">{t("visualKpi3")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
