"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

export function TrustBar() {
  const t = useTranslations("ifrs.trustBar");
  const keys = ["i1", "i2", "i3", "i4"] as const;

  return (
    <section className="border-y border-slate-200/80 bg-slate-50 py-12 md:py-16" aria-labelledby="trust-bar-title">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h2 id="trust-bar-title" className="sr-only">
          {t("title")}
        </h2>
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {keys.map((k) => (
            <Reveal key={k}>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_16px_rgba(15,23,42,0.04)] transition hover:border-emerald-200/50 hover:shadow-md md:p-6">
                <p className="text-sm font-semibold leading-snug text-slate-900">{t(`items.${k}.title`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
