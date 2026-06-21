"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { FEATURED_SERVICE_IDS, type ServiceId } from "@/lib/services";
import { Reveal } from "@/components/Reveal";

// Ảnh minh hoạ cho từng dịch vụ — đổi path tại đây nếu thay ảnh mới
const SERVICE_IMAGES: Record<ServiceId, string> = {
  audit: "/images/service/Auditing-3.jpeg",
  tax: "/images/service/tuvan.png",
  accounting: "/images/service/lapbaocao.png",
  valuation: "/images/service/thamdinhgia.jpg",
  advisory: "/images/service/tuvangiaiphap.jpeg",
  training: "/images/service/daotaotuyendung.jpg",
  transferPricing: "/images/service/1.png",
  ifrsVas: "/images/service/2.png"
};

function ServiceIcon({ id, className }: { id: ServiceId; className?: string }) {
  const c = className ?? "h-6 w-6 text-emerald-700";
  switch (id) {
    case "audit":
      return (
        <svg viewBox="0 0 24 24" className={c} aria-hidden="true">
          <path
            d="M9 12l2 2 4-4M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "tax":
      return (
        <svg viewBox="0 0 24 24" className={c} aria-hidden="true">
          <path d="M7 7h10v10H7z" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 11h6M9 14h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "accounting":
      return (
        <svg viewBox="0 0 24 24" className={c} aria-hidden="true">
          <path d="M8 6h12M8 12h12M8 18h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "valuation":
      return (
        <svg viewBox="0 0 24 24" className={c} aria-hidden="true">
          <path d="M4 19V5M4 19h16M8 15l3-3 3 2 4-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "transferPricing":
      return (
        <svg viewBox="0 0 24 24" className={c} aria-hidden="true">
          <path d="M7 17V7M12 17v-5M17 17V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "advisory":
      return (
        <svg viewBox="0 0 24 24" className={c} aria-hidden="true">
          <path
            d="M12 3l7 4v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V7l7-4z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "training":
      return (
        <svg viewBox="0 0 24 24" className={c} aria-hidden="true">
          <path d="M4 10l8-4 8 4-8 4-8-4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M4 10v6l8 3 8-3v-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "ifrsVas":
      return (
        <svg viewBox="0 0 24 24" className={c} aria-hidden="true">
          <path d="M6 4h12v16H6z" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function ServicesSection({ onOpenDetail }: { onOpenDetail: (id: ServiceId) => void }) {
  const t = useTranslations("ifrs.services");

  return (
    <section id="dich-vu" className="relative scroll-mt-32 border-t border-slate-200/80 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeadingBlock title={t("title")} subtitle={t("subtitle")} />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_SERVICE_IDS.map((id) => (
            <Reveal key={id}>
              <button
                type="button"
                onClick={() => onOpenDetail(id)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-left shadow-[0_2px_20px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.02] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={SERVICE_IMAGES[id]}
                    alt={t(`items.${id}.title`)}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-950/0 to-slate-950/0" aria-hidden="true" />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-700/35 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden="true" />
                  <span className="absolute bottom-0 left-5 inline-flex h-12 w-12 translate-y-1/2 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-brand ring-2 ring-white transition duration-300 group-hover:scale-105">
                    <ServiceIcon id={id} className="h-6 w-6 text-white" />
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 pt-9">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-slate-900">{t(`items.${id}.title`)}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-2">{t(`items.${id}.desc`)}</p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                    {t("viewDetails")}
                    <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeadingBlock({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold section-title tracking-tight text-emerald-700 md:text-3xl lg:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-[1.75] text-slate-600">{subtitle}</p>
    </div>
  );
}
