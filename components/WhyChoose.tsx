"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

const KEYS = ["i1", "i2", "i3", "i4", "i5", "i6"] as const;

function MiniIcon({ n }: { n: number }) {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100/90 bg-emerald-50/90 text-emerald-800 shadow-sm">
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        {n === 1 ? (
          <path d="M12 3l7 4v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V7l7-4z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        ) : n === 2 ? (
          <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        ) : n === 3 ? (
          <path d="M6 18L18 6M8 6h10v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        ) : n === 4 ? (
          <path d="M7 17V7M12 17v-5M17 17V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        ) : n === 5 ? (
          <path d="M12 21s8-4 8-10V5l-8-3-8 3v6c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        ) : (
          <path d="M4 19V5M4 19h16M8 15l3-3 3 2 4-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        )}
      </svg>
    </span>
  );
}

export function WhyChoose() {
  const t = useTranslations("ifrs.why");

  return (
    <section className="border-t border-slate-200/80 bg-slate-50 py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">{t("title")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {KEYS.map((k, idx) => (
            <Reveal key={k}>
              <article className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_2px_18px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.02] transition duration-300 hover:-translate-y-1 hover:border-emerald-200/70 hover:shadow-[0_14px_40px_rgba(16,185,129,0.1)] md:p-7">
                <MiniIcon n={idx + 1} />
                <h3 className="mt-5 text-lg font-semibold leading-snug text-slate-900">{t(`items.${k}.title`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(`items.${k}.desc`)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
