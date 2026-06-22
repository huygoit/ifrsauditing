"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

// Icon inline đồng bộ toàn site cho từng bước quy trình
const ICONS: Record<string, ReactNode> = {
  // Tiếp nhận nhu cầu — bong bóng hội thoại
  s1: (
    <path
      d="M4 5h16v11H9l-4 3v-3H4V5z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  ),
  // Đánh giá phạm vi & rủi ro — kính lúp
  s2: (
    <>
      <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  // Triển khai — bánh răng
  s3: (
    <>
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1m0-12.8l-2.1 2.1M7.7 16.3l-2.1 2.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </>
  ),
  // Báo cáo & hỗ trợ — tài liệu có dấu tích
  s4: (
    <>
      <path d="M7 3h7l4 4v14H7V3z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.5 13l2 2 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
};

const STEPS = ["s1", "s2", "s3", "s4"] as const;

export function ProcessSection() {
  const t = useTranslations("ifrs.process");

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="section-title text-2xl font-semibold tracking-tight text-emerald-700 md:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-4 max-w-2xl text-base leading-[1.75] text-slate-600">{t("subtitle")}</p>
        </Reveal>

        <ol className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Đường nối ngang chạy qua các chip icon — chỉ hiện ở desktop */}
          <span
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[3.25rem] hidden h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400/70 to-emerald-200 lg:block"
            aria-hidden="true"
          />

          {STEPS.map((key, i) => (
            <Reveal key={key}>
              <li className="group relative flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_2px_18px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-brand md:p-7">
                {/* Số bước cỡ lớn dạng watermark — đặt trong mép card để không bị cắt */}
                <span
                  className="pointer-events-none absolute right-3 top-2 select-none text-7xl font-bold leading-none text-emerald-700/[0.07] transition group-hover:text-emerald-700/[0.12]"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>

                <span className="relative z-[1] inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-brand ring-4 ring-white transition duration-300 group-hover:scale-105">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                    {ICONS[key]}
                  </svg>
                </span>

                <p className="relative mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">{t("stepLabel", { n: `0${i + 1}` })}</p>
                <h3 className="relative mt-1 text-lg font-semibold leading-snug text-slate-900">{t(`steps.${key}.title`)}</h3>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-slate-600">{t(`steps.${key}.desc`)}</p>

                {/* Mũi tên nối sang bước kế tiếp */}
                {i < STEPS.length - 1 ? (
                  <span
                    className="absolute right-0 top-[2.25rem] z-[2] hidden h-8 w-8 translate-x-1/2 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-600 shadow-sm lg:flex"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                ) : null}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
