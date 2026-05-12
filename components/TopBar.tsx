"use client";

import { SITE } from "@/lib/site";
import { useLocale, useTranslations } from "next-intl";

export function TopBar() {
  const t = useTranslations("ifrs");
  const locale = useLocale();
  const hours = locale === "en" ? SITE.workingHoursEn : SITE.workingHoursVi;

  return (
    <div className="border-b border-emerald-900/30 bg-gradient-to-r from-emerald-950 via-emerald-950 to-slate-950 text-[11px] text-emerald-100/90 sm:text-xs">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-5 gap-y-2 px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="max-w-full font-medium tracking-wide text-emerald-50/90">{hours}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <a
            href={`mailto:${SITE.email}`}
            className="rounded-md font-medium text-white underline-offset-4 transition hover:text-amber-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
            aria-label={t("topBar.emailAria")}
          >
            {SITE.email}
          </a>
          <a
            href={`tel:${SITE.hotlineTel}`}
            className="rounded-md font-semibold text-white tabular-nums underline-offset-4 transition hover:text-amber-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
            aria-label={t("topBar.phoneAria")}
          >
            {SITE.hotlineDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
