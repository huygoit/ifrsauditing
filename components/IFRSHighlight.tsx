"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { PatternBg } from "@/components/PatternBg";

export function IFRSHighlight() {
  const t = useTranslations("ifrs.ifrsHighlight");
  const needs = ["n1", "n2", "n3", "n4", "n5"] as const;

  return (
    <section id="ifrs" className="relative scroll-mt-32 overflow-hidden border-t border-slate-200/80 py-20 md:py-28">
      <PatternBg variant="emerald" />
      <div className="relative mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold section-title tracking-tight text-emerald-700 md:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-5 text-base leading-[1.75] text-slate-600">{t("body")}</p>
        </Reveal>
        <Reveal>
          <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-8">
            <p className="text-base font-semibold text-emerald-800">{t("needTitle")}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{t("needHint")}</p>
            <ul className="mt-5 space-y-3.5">
              {needs.map((n) => (
                <li key={n} className="flex gap-3.5">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-brand" aria-hidden="true">
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M4 10.5l3.5 3.5L16 5.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{t(`needs.${n}.label`)}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{t(`needs.${n}.desc`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
