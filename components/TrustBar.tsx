"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

// Icon theo từng giá trị cốt lõi — nét mảnh, dùng currentColor để ăn theo màu chip
const ICONS: Record<string, ReactNode> = {
  i1: (
    <path
      d="M9 11a3 3 0 100-6 3 3 0 000 6zm7 0a3 3 0 100-6m-1 12v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1m14 0v-1a4 4 0 00-3-3.87"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  i2: (
    <path
      d="M12 3l2.5 5 5.5.8-4 3.9.95 5.5L12 16.5 7.1 18.1 8 12.7l-4-3.9L9.5 8 12 3z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  i3: (
    <path
      d="M4 12a8 8 0 0114-5.3L20 8m0 0V4m0 4h-4M20 12a8 8 0 01-14 5.3L4 16m0 0v4m0-4h4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  i4: (
    <path
      d="M12 21a9 9 0 100-18 9 9 0 000 18zm-9-9h18M12 3c2.5 2.4 3.8 5.5 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.5-3.8-9S9.5 5.4 12 3z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
};

export function TrustBar() {
  const t = useTranslations("ifrs.trustBar");
  const keys = ["i1", "i2", "i3", "i4"] as const;

  return (
    <section className="border-y border-slate-200/80 bg-gradient-to-b from-slate-50 to-white py-14 md:py-20" aria-labelledby="trust-bar-title">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 id="trust-bar-title" className="section-title text-2xl font-semibold tracking-tight text-emerald-700 md:text-3xl">
            {t("title")}
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:gap-6 md:mt-12 md:grid-cols-2 lg:grid-cols-4">
          {keys.map((k, index) => (
            <Reveal key={k}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-brand">
                {/* Số thứ tự mờ ở góc — tạo nhịp, không gây rối */}
                <span className="pointer-events-none absolute -right-1 top-1 text-5xl font-bold leading-none text-slate-900/[0.04] transition group-hover:text-emerald-700/[0.07]" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {/* Quầng sáng brand hiện khi hover */}
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-emerald-50/70 opacity-0 transition duration-300 group-hover:opacity-100" aria-hidden="true" />

                <div className="relative">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-brand ring-1 ring-emerald-400/20 transition duration-300 group-hover:scale-105">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                      {ICONS[k]}
                    </svg>
                  </span>
                  <p className="mt-4 text-[15px] font-semibold leading-snug text-slate-900">{t(`items.${k}.title`)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
