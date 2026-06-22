"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

// Icon inline đồng bộ với TrustBar — nét mảnh, currentColor, hiển thị trắng trên chip gradient
const ICONS: Record<string, ReactNode> = {
  // Độc lập — cán cân khách quan
  c1: (
    <path
      d="M12 4v16m-7-3h14M12 6l-6 2 2.2 4.2a3.2 3.2 0 01-4.4 0L6 8m12-2l6 2-2.2 4.2a3.2 3.2 0 01-4.4 0L18 8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  // Minh bạch — con mắt rõ ràng
  c2: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </>
  ),
  // Hiệu quả — tia chớp
  c3: (
    <path d="M13 3L5 13h5l-1 8 8-10h-5l1-8z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  )
};

const CARDS = ["c1", "c2", "c3"] as const;

export function AboutSection() {
  const t = useTranslations("ifrs.about");

  return (
    <section id="gioi-thieu" className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold section-title tracking-tight text-emerald-700 md:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-5 max-w-3xl text-base leading-[1.75] text-slate-600">{t("body")}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CARDS.map((key) => (
            <Reveal key={key}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 p-6 shadow-[0_2px_20px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.02] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-brand md:p-7">
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-emerald-50/70 opacity-0 transition duration-300 group-hover:opacity-100" aria-hidden="true" />

                <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-brand ring-1 ring-emerald-400/20 transition duration-300 group-hover:scale-105">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                    {ICONS[key]}
                  </svg>
                </span>
                <h3 className="relative mt-5 text-lg font-semibold leading-snug text-slate-900">{t(`cards.${key}.title`)}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-slate-600">{t(`cards.${key}.desc`)}</p>
                <span className="relative mt-5 inline-block h-px w-12 bg-gradient-to-r from-emerald-500 to-transparent" aria-hidden="true" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
