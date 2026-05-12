"use client";

import { useTranslations } from "next-intl";
import { SERVICE_IDS, type ServiceId } from "@/lib/services";
import { Reveal } from "@/components/Reveal";

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
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {SERVICE_IDS.map((id) => (
            <Reveal key={id}>
              <article className="group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 p-6 shadow-[0_2px_20px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.02] transition duration-300 hover:-translate-y-1 hover:border-emerald-200/70 hover:shadow-[0_16px_48px_rgba(16,185,129,0.12)]">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100/90 bg-emerald-50/90 text-emerald-800 shadow-sm transition group-hover:border-emerald-200 group-hover:bg-emerald-50">
                  <ServiceIcon id={id} />
                </div>
                <h3 className="mt-5 text-lg font-semibold leading-snug tracking-tight text-slate-900">{t(`items.${id}.title`)}</h3>
                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-800/85">{t(`items.${id}.subtitle`)}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">{t(`items.${id}.desc`)}</p>
                <ul className="mt-5 space-y-2 text-xs leading-relaxed text-slate-600">
                  <li className="flex gap-2.5">
                    <span className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true">
                      ·
                    </span>
                    {t(`items.${id}.b1`)}
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true">
                      ·
                    </span>
                    {t(`items.${id}.b2`)}
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true">
                      ·
                    </span>
                    {t(`items.${id}.b3`)}
                  </li>
                </ul>
                <button
                  type="button"
                  className="mt-6 w-full rounded-full border border-slate-200/90 bg-white py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/80 hover:text-emerald-950 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  onClick={() => onOpenDetail(id)}
                >
                  {t("viewDetails")}
                </button>
              </article>
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
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-[1.75] text-slate-600">{subtitle}</p>
    </div>
  );
}
