"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

// Icon inline đồng bộ toàn site cho từng lĩnh vực
const ICONS: Record<string, ReactNode> = {
  // Doanh nghiệp FDI — toàn cầu
  i1: (
    <path
      d="M12 21a9 9 0 100-18 9 9 0 000 18zm-9-9h18M12 3c2.5 2.4 3.8 5.5 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.5-3.8-9S9.5 5.4 12 3z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  // Sản xuất — nhà máy
  i2: (
    <path
      d="M3 21h18M4 21V11l5 3v-3l5 3V8l5 3v10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  // Thương mại – dịch vụ — túi mua sắm
  i3: (
    <>
      <path d="M6 8h12l-1 12.5H7L6 8z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 8a3 3 0 016 0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  // Xây dựng – bất động sản — toà nhà
  i4: (
    <>
      <path d="M5 21V5a1 1 0 011-1h7a1 1 0 011 1v16M14 21V9h4a1 1 0 011 1v11M3 21h18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 8h3M8 12h3M8 16h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  // Doanh nghiệp cần kiểm toán BCTC — bảng kẹp có dấu tích
  i5: (
    <>
      <path d="M6 5h12v16H6z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 4h6v3H9z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 13l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  // Chuẩn hóa kế toán / thuế — tài liệu
  i6: (
    <>
      <path d="M7 3h7l4 4v14H7V3z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M10 12h5M10 16h4M10 8h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  )
};

const ITEMS = ["i1", "i2", "i3", "i4", "i5", "i6"] as const;

export function IndustriesSection() {
  const t = useTranslations("ifrs.industries");

  return (
    <section className="border-t border-slate-200/80 bg-slate-50 py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="section-title text-2xl font-semibold tracking-tight text-emerald-700 md:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-4 max-w-2xl text-base leading-[1.75] text-slate-600">{t("subtitle")}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((key) => (
            <Reveal key={key}>
              <article className="group relative flex h-full items-start gap-4 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_2px_18px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-brand md:p-7">
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-emerald-50/70 opacity-0 transition duration-300 group-hover:opacity-100" aria-hidden="true" />

                <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-brand ring-1 ring-emerald-400/20 transition duration-300 group-hover:scale-105">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                    {ICONS[key]}
                  </svg>
                </span>
                <div className="relative min-w-0 flex-1">
                  <h3 className="text-lg font-semibold leading-snug text-slate-900">{t(`items.${key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(`items.${key}.desc`)}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
