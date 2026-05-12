"use client";

import { useMemo, useState } from "react";
import { formatVnd } from "@/lib/format";
import { PatternBg } from "@/components/PatternBg";
import { useTranslations } from "next-intl";

export type ComboPlan = {
  id: string;
  name: string;
  badge?: string;
  priceVnd: number;
  compareAtVnd?: number; // total price if bought individually
  items: string[];
  emphasize?: boolean;
};

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PricingCombo({
  plans,
  onSelect
}: {
  plans: ComboPlan[];
  onSelect: (plan: ComboPlan) => void;
}) {
  const t = useTranslations("home.pricing");
  const tCommon = useTranslations("common");
  const trust = [t("trust.cod"), t("trust.return"), t("trust.advice")];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => plans.find((p) => p.id === selectedId) ?? null, [plans, selectedId]);

  return (
    <section id="combo" className="relative mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 md:py-16">
      <PatternBg variant="pricing" className="rounded-[40px]" />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{t("title")}</h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {plans.map((p) => (
          (() => {
            const canSave = Boolean(p.compareAtVnd && p.compareAtVnd > p.priceVnd);
            const savePct = canSave ? Math.round((1 - p.priceVnd / (p.compareAtVnd as number)) * 100) : null;
            const badge = p.emphasize ? t("bestSave") : p.badge;

            return (
          <div
            key={p.id}
            className={[
              "rounded-2xl border bg-white/90 p-6 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-md",
              p.emphasize ? "border-emerald-200 shadow-md ring-1 ring-emerald-100" : "border-slate-200"
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{p.name}</h3>
                {badge ? (
                  <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {badge}
                  </p>
                ) : null}
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-slate-900">{formatVnd(p.priceVnd)}</p>
                {canSave ? (
                  <p className="mt-1 text-xs font-semibold text-slate-500 line-through">{formatVnd(p.compareAtVnd as number)}</p>
                ) : null}
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {p.items.map((it) => (
                <li key={it} className="flex gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-50 text-slate-700">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M20 6L9 17l-5-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>

            {canSave && savePct !== null ? (
              <p className="mt-4 text-xs font-semibold text-emerald-700">{tCommon("saveVsRetail", { pct: savePct })}</p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              {trust.map((t) => (
                <span key={t} className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  {t}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedId(p.id);
                onSelect(p);
              }}
              className={[
                "mt-5 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold shadow-sm transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                p.emphasize
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
              ].join(" ")}
            >
              {t("selectPlan")}
            </button>
          </div>
            );
          })()
        ))}
      </div>

      {selected ? (
        <div className="fixed inset-x-0 bottom-[76px] z-[55] md:bottom-6">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-md backdrop-blur">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{t("selected", { name: selected.name })}</p>
                <p className="mt-0.5 text-xs text-slate-600">
                  {formatVnd(selected.priceVnd)}
                  {selected.compareAtVnd && selected.compareAtVnd > selected.priceVnd ? (
                    <>
                      {" "}
                      · {tCommon("savePct", { pct: Math.round((1 - selected.priceVnd / selected.compareAtVnd) * 100) })}
                    </>
                  ) : null}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="#lien-he"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  {t("goToOrder")}
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  aria-label={tCommon("close")}
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}


