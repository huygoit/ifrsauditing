"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { PatternBg } from "@/components/PatternBg";
import { LinkButton } from "@/components/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SITE } from "@/lib/site";
import { useTranslations } from "next-intl";

const SLIDES = [
  { image: "/slides/img01.jpg", key: "about" },
  { image: "/slides/img02.jpg", key: "services" },
  { image: "/slides/img03.jpg", key: "careers" }
] as const;

export function Hero() {
  const t = useTranslations("ifrs.hero");
  const tc = useTranslations("ifrs");
  const reducedMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = useMemo(
    () =>
      SLIDES.map((slide) => ({
        ...slide,
        eyebrow: t(`slides.${slide.key}.eyebrow`),
        title: t(`slides.${slide.key}.title`),
        desc: t(`slides.${slide.key}.desc`),
        alt: t(`slides.${slide.key}.alt`)
      })),
    [t]
  );

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % SLIDES.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const goToPrevSlide = () => {
    setActiveSlide((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  };

  const goToNextSlide = () => {
    setActiveSlide((current) => (current + 1) % SLIDES.length);
  };

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 pb-16 pt-10 md:pb-20 md:pt-12 lg:py-8">
      <PatternBg variant="heroDark" />
      {/* Viền tối nhẹ — tăng chiều sâu luxury, không thêm số liệu */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/55 via-transparent to-slate-950/90"
        aria-hidden="true"
      />

      <div className="relative z-[2] mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-12 lg:items-center lg:gap-14 lg:px-8">
        <div className="lg:col-span-5">
          <div className="flex flex-wrap gap-2.5">
            <span className="rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-emerald-50/95 shadow-sm backdrop-blur-md">
              {t("badgeIndependence")}
            </span>
            <span className="rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-emerald-50/95 shadow-sm backdrop-blur-md">
              {t("badgeTransparency")}
            </span>
            <span className="rounded-full border border-amber-400/25 bg-amber-400/[0.08] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-amber-100 shadow-sm backdrop-blur-md">
              {t("badgeEfficiency")}
            </span>
          </div>

          <h1 className="mt-8 text-balance text-[1.85rem] font-bold leading-[1.14] tracking-tight text-white md:mt-9 md:text-[2.25rem] lg:text-[2.75rem] lg:leading-[1.12]">
            {t("headline")}
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.75] text-slate-200/95 md:text-lg md:leading-[1.78] lg:text-xl">
            {t("desc")}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <LinkButton
              href="#lien-he"
              variant="primary"
              size="md"
              className="min-h-[48px] border border-emerald-400/25 bg-emerald-500 px-6 shadow-lg shadow-emerald-950/40 ring-1 ring-white/10 transition hover:bg-emerald-400 hover:shadow-emerald-900/50"
            >
              {tc("ctaConsult")}
            </LinkButton>
            <LinkButton
              href="#dich-vu"
              variant="onDark"
              size="md"
              className="min-h-[48px] border-white/25 bg-white/[0.07] px-6 hover:border-white/35 hover:bg-white/[0.12]"
            >
              {tc("ctaExplore")}
            </LinkButton>
            <a
              href={`tel:${SITE.hotlineTel}`}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/18 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {SITE.hotlineDisplay}
            </a>
          </div>
        </div>

        <div className="relative lg:col-span-7 lg:self-start">
          <div className="pointer-events-none absolute -inset-5 rounded-[2rem] bg-emerald-400/10 blur-3xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] shadow-[0_30px_90px_rgba(0,0,0,0.42)] ring-1 ring-white/[0.08] backdrop-blur-md sm:rounded-[2rem]">
            <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/11] lg:aspect-[16/10]">
              {slides.map((slide, index) => (
                <Image
                  key={slide.image}
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className={[
                    "object-cover object-center transition duration-700 ease-out",
                    activeSlide === index ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                  ].join(" ")}
                />
              ))}
              {/* Tint tổng thể tạo chiều sâu — tránh ảnh quá sáng/trắng trông như mất hình trên desktop */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950/35 via-slate-950/10 to-emerald-950/30" aria-hidden="true" />
              {/* Đậm đáy cho caption — gom badge + tiêu đề về đây để không che mặt người */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/88 via-slate-950/10 to-transparent" aria-hidden="true" />

              {/* Caption gọn: badge + thanh nhấn brand + tiêu đề slide, đặt ở đáy ảnh */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/15 bg-slate-950/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100 shadow-sm backdrop-blur-md sm:px-3.5 sm:py-1.5 sm:text-[11px] sm:tracking-[0.16em]">
                    {slides[activeSlide].eyebrow}
                  </span>
                  <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-100 backdrop-blur-md sm:px-3.5 sm:py-1.5 sm:text-[11px] sm:tracking-[0.16em]">
                    {t("slideBadge")}
                  </span>
                </div>
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <span className="mt-1 h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-emerald-300 to-emerald-500 sm:h-9" aria-hidden="true" />
                  <h2 className="max-w-md text-pretty text-lg font-semibold leading-snug tracking-tight text-white [text-shadow:0_2px_12px_rgba(2,6,23,0.55)] sm:text-2xl md:text-[1.7rem]">
                    {slides[activeSlide].title}
                  </h2>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-slate-950/72 px-3 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center gap-2" aria-label={t("sliderAria")}>
                {slides.map((slide, index) => (
                  <button
                    key={slide.key}
                    type="button"
                    className={[
                      "h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:h-2.5",
                      activeSlide === index ? "w-7 bg-emerald-300 sm:w-9" : "w-2 bg-white/30 hover:bg-white/55 sm:w-2.5"
                    ].join(" ")}
                    aria-label={t("goToSlide", { index: index + 1 })}
                    aria-current={activeSlide === index ? "true" : undefined}
                    onClick={() => setActiveSlide(index)}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:border-white/30 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:h-10 sm:w-10"
                  aria-label={t("prevSlide")}
                  onClick={goToPrevSlide}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:border-white/30 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:h-10 sm:w-10"
                  aria-label={t("nextSlide")}
                  onClick={goToNextSlide}
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* Điểm tin cậy — luôn 3 chip trên 1 hàng, chữ không xuống dòng */}
          <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {[t("checklist1"), t("checklist2"), t("checklist3")].map((item) => (
              <li
                key={item}
                className="flex min-w-0 items-center justify-start gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-left text-[13px] font-medium text-slate-100 shadow-sm backdrop-blur-md transition hover:border-emerald-400/30 hover:bg-white/[0.08] sm:justify-center sm:text-center"
              >
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20" aria-hidden="true">
                  <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 10.5l3.5 3.5L16 5.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="whitespace-nowrap">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
