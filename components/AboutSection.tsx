"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

export function AboutSection() {
  const t = useTranslations("ifrs.about");
  const cards = ["c1", "c2", "c3"] as const;

  return (
    <section id="gioi-thieu" className="scroll-mt-32 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-5 max-w-3xl text-base leading-[1.75] text-slate-600">{t("body")}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <Reveal key={c}>
              <div className="h-full rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 p-6 shadow-[0_2px_20px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.02] transition hover:-translate-y-0.5 hover:border-emerald-200/60 hover:shadow-lg md:p-7">
                <h3 className="text-lg font-semibold leading-snug text-slate-900">{t(`cards.${c}.title`)}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{t(`cards.${c}.desc`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
