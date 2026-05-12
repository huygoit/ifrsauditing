"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

const KEYS = ["i1", "i2", "i3", "i4", "i5", "i6"] as const;

export function IndustriesSection() {
  const t = useTranslations("ifrs.industries");

  return (
    <section className="border-t border-slate-200/80 bg-slate-50 py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-4 max-w-2xl text-base leading-[1.75] text-slate-600">{t("subtitle")}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {KEYS.map((k) => (
            <Reveal key={k}>
              <article className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_2px_18px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-emerald-200/50 hover:shadow-md md:p-7">
                <h3 className="text-lg font-semibold leading-snug text-slate-900">{t(`items.${k}.title`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(`items.${k}.desc`)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
