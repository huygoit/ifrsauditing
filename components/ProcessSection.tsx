"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

const STEPS = ["s1", "s2", "s3", "s4"] as const;

export function ProcessSection() {
  const t = useTranslations("ifrs.process");

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-4 max-w-2xl text-base leading-[1.75] text-slate-600">{t("subtitle")}</p>
        </Reveal>
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s}>
              <li className="relative flex h-full flex-col rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm transition hover:border-emerald-200/70 hover:shadow-md md:p-7">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600/90">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-900">{t(`steps.${s}.title`)}</h3>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
