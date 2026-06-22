"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

// Icon inline đồng bộ toàn site — chip gradient brand, icon trắng nét mảnh
const ICONS: Record<string, ReactNode> = {
  // Chuyên gia thực chiến
  i1: (
    <>
      <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20a7 7 0 0114 0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  // Tư vấn đúng trọng tâm — tâm điểm
  i2: (
    <>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </>
  ),
  // Đồng hành xuyên suốt — vòng đời
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
  // Tối ưu chi phí — chồng tiền
  i4: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  // Pháp lý Việt Nam — khiên bảo chứng
  i5: (
    <>
      <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  // FDI & nội địa — toàn cầu
  i6: (
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

const ITEMS = ["i1", "i2", "i3", "i4", "i5", "i6"] as const;

export function WhyChoose() {
  const t = useTranslations("ifrs.why");

  return (
    <section className="border-t border-slate-200/80 bg-slate-50 py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold section-title tracking-tight text-emerald-700 md:text-3xl lg:text-4xl">{t("title")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((key) => (
            <Reveal key={key}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_2px_18px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.02] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-brand md:p-7">
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-emerald-50/70 opacity-0 transition duration-300 group-hover:opacity-100" aria-hidden="true" />

                <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-brand ring-1 ring-emerald-400/20 transition duration-300 group-hover:scale-105">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                    {ICONS[key]}
                  </svg>
                </span>
                <h3 className="relative mt-5 text-lg font-semibold leading-snug text-slate-900">{t(`items.${key}.title`)}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-slate-600">{t(`items.${key}.desc`)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
