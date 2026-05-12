"use client";

import { HOTLINE, ZALO_URL } from "@/lib/constants";
import { PatternBg } from "@/components/PatternBg";
import { LinkButton } from "@/components/Button";
import { BadgeCheck, Clock, Leaf, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

function IconStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2.7l2.86 5.8 6.4.93-4.63 4.52 1.09 6.38L12 17.98 6.28 20.33l1.09-6.38L2.74 9.43l6.4-.93L12 2.7z"
        fill="currentColor"
      />
    </svg>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      {children}
    </span>
  );
}

export function Hero({ ratingText }: { ratingText?: string }) {
  const t = useTranslations("home.hero");
  const tCommon = useTranslations("common");

  return (
    <section className="relative overflow-hidden">
      <PatternBg variant="hero" />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-16 lg:px-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              <IconStar className="h-4 w-4 text-emerald-600" />
              {ratingText ?? t("rating")}
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              {t("customersTrusted")}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 md:text-5xl">
            <span className="text-emerald-700">{t("headlineHighlight")}</span>, {t("headlineRest")}
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            {t("desc")}
          </p>

          <ul className="mt-6 grid gap-3 text-sm text-slate-700 sm:max-w-lg">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <BadgeCheck className="h-6 w-6" aria-hidden="true" />
              </span>
              <span>
                <span className="font-semibold text-slate-900">{t("bullets.b1Title")}</span> — {t("bullets.b1Desc")}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Leaf className="h-6 w-6" aria-hidden="true" />
              </span>
              <span>
                <span className="font-semibold text-slate-900">{t("bullets.b2Title")}</span> — {t("bullets.b2Desc")}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Truck className="h-6 w-6" aria-hidden="true" />
              </span>
              <span>
                <span className="font-semibold text-slate-900">{t("bullets.b3Title")}</span> — {t("bullets.b3Desc")}
              </span>
            </li>
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="#lien-he" variant="primary" size="md">
              {t("cta.contactNow")}
            </LinkButton>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <a
                href={`tel:${HOTLINE}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-900 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:shadow-md active:translate-y-0 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 sm:w-auto"
                aria-label={tCommon("callHotlineAria", { hotline: HOTLINE })}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-800">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.9-1.9c.3-.3.7-.4 1.1-.3 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.4 21 3 13.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.4 0 .8-.3 1.1l-1.9 1.9z"
                      fill="currentColor"
                      opacity="0.9"
                    />
                  </svg>
                </span>
                <span className="tracking-wide">{HOTLINE}</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-900">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  {t("cta.hours")}
                </span>
              </a>
            </div>
            <LinkButton href={ZALO_URL} target="_blank" rel="noreferrer" variant="ghost" size="md">
              {tCommon("chatZalo")}
            </LinkButton>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            <Badge>{t("badges.b1")}</Badge>
            <Badge>{t("badges.b2")}</Badge>
            <Badge>{t("badges.b3")}</Badge>
            <Badge>{t("badges.b4")}</Badge>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">{t("claims.c1")}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{t("claims.c2")}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{t("claims.c3")}</span>
          </div>

        </div>

        <div className="relative">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-emerald-50">
              <img src="/products/product-01.jpg" alt={t("imageAlt")} className="h-full w-full object-cover" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                {t("imageChips.c1")}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                {t("imageChips.c2")}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                {t("imageChips.c3")}
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-6 -top-6 hidden h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl md:block" />
        </div>
      </div>
    </section>
  );
}


