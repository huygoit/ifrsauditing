"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { PatternBg } from "@/components/PatternBg";

export function IFRSHighlight() {
  const t = useTranslations("ifrs.ifrsHighlight");
  const rows = ["r1", "r2", "r3", "r4"] as const;

  return (
    <section id="ifrs" className="relative scroll-mt-32 overflow-hidden border-t border-slate-200/80 py-20 md:py-28">
      <PatternBg variant="emerald" />
      <div className="relative mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-5 text-base leading-[1.75] text-slate-600">{t("body")}</p>
        </Reveal>
        <Reveal>
          <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-8">
            <p className="text-sm font-semibold text-emerald-800">{t("matrixTitle")}</p>
            <ul className="mt-5 divide-y divide-slate-100">
              {rows.map((r) => (
                <li key={r} className="flex items-center justify-between gap-4 py-3.5 text-sm first:pt-0">
                  <span className="font-medium text-slate-800">{t(`matrixRows.${r}.label`)}</span>
                  <span className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
                    {t(`matrixRows.${r}.status`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
