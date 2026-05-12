"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

const CARDS = ["c1", "c2", "c3", "c4"] as const;

export function InsightsSection() {
  const t = useTranslations("ifrs.insights");
  const pathname = usePathname();
  const homeBase = useMemo(() => {
    if (pathname?.startsWith("/en")) return "/en";
    if (pathname?.startsWith("/vi")) return "/vi";
    return "/vi";
  }, [pathname]);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-4 max-w-2xl text-base leading-[1.75] text-slate-600">{t("subtitle")}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <Reveal key={c}>
              <a
                href={`${homeBase}/news`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/90 to-white p-6 shadow-sm ring-1 ring-slate-900/[0.02] transition duration-300 hover:-translate-y-1 hover:border-emerald-200/70 hover:shadow-[0_14px_40px_rgba(16,185,129,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 md:p-7"
              >
                <h3 className="text-lg font-semibold leading-snug text-slate-900 transition group-hover:text-emerald-800">{t(`cards.${c}.title`)}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{t(`cards.${c}.desc`)}</p>
                <span className="mt-5 text-sm font-semibold text-emerald-700">{t(`cards.${c}.cta`)} →</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
