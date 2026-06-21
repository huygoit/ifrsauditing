"use client";

import { SITE } from "@/lib/site";
import { useLocale, useTranslations } from "next-intl";

export function TopBar() {
  const t = useTranslations("ifrs");
  const locale = useLocale();
  const hours = locale === "en" ? SITE.workingHoursEn : SITE.workingHoursVi;

  return (
    <div className="border-b border-emerald-900/30 bg-gradient-to-r from-emerald-950 via-emerald-950 to-slate-950 text-[13px] text-emerald-100/90 sm:text-sm">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-5 gap-y-2 px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="flex max-w-full items-center gap-1.5 font-medium tracking-wide text-emerald-50/90">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-amber-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {hours}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex items-center gap-1.5 rounded-md font-medium text-white underline-offset-4 transition hover:text-amber-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
            aria-label={t("topBar.emailAria")}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-amber-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {SITE.email}
          </a>
          <a
            href={`tel:${SITE.hotlineTel}`}
            className="inline-flex items-center gap-1.5 rounded-md font-semibold text-white tabular-nums underline-offset-4 transition hover:text-amber-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
            aria-label={t("topBar.phoneAria")}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-amber-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M6.6 3h3l1.5 4.5-2 1.5a13 13 0 006 6l1.5-2 4.5 1.5v3a2 2 0 01-2.2 2A17 17 0 014 5.2 2 2 0 016.6 3z" strokeLinejoin="round" />
            </svg>
            {SITE.hotlineDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
