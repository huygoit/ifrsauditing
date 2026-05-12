"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function IconChevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export type FaqItem = { q: string; a: string };

export function FAQ({
  items: itemsProp,
  id,
  aliasId,
  variant = "section"
}: {
  items?: FaqItem[];
  id?: string;
  aliasId?: string;
  variant?: "section" | "card";
}) {
  const t = useTranslations("home.faq");
  const fallbackItems: FaqItem[] = [
    { q: t("items.q1.q"), a: t("items.q1.a") },
    { q: t("items.q2.q"), a: t("items.q2.a") },
    { q: t("items.q3.q"), a: t("items.q3.a") },
    { q: t("items.q4.q"), a: t("items.q4.a") },
    { q: t("items.q5.q"), a: t("items.q5.a") },
    { q: t("items.q6.q"), a: t("items.q6.a") }
  ];
  const items = itemsProp && itemsProp.length ? itemsProp : fallbackItems;

  const [open, setOpen] = useState<number | null>(0);

  const rootClass =
    variant === "card"
      ? "rounded-2xl border border-slate-200 bg-white p-6 shadow-md"
      : "mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 md:py-16";

  const listClass =
    variant === "card"
      ? "mt-5 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white"
      : "mt-7 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm";

  return (
    <section id={id ?? "faq"} className={`scroll-mt-24 ${rootClass}`}>
      {aliasId ? <span id={aliasId} className="block scroll-mt-24" /> : null}
      <h2 className="home-section-heading">
        {t("title")}
      </h2>
      <p className={variant === "card" ? "mt-2 text-sm leading-relaxed text-slate-600" : "mt-2 max-w-2xl text-sm leading-relaxed text-slate-600"}>
        {t("subtitle")}
      </p>

      <div className={listClass}>
        {items.map((it, idx) => {
          const isOpen = open === idx;
          return (
            <div key={it.q} className="p-0">
              <button
                type="button"
                className={["flex w-full items-center justify-between gap-6 text-left", variant === "card" ? "px-5 py-3.5" : "px-5 py-4"].join(" ")}
                onClick={() => setOpen(isOpen ? null : idx)}
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-slate-900">{it.q}</span>
                <IconChevron className={["h-5 w-5 text-slate-500 transition", isOpen ? "rotate-180" : ""].join(" ")} />
              </button>
              {isOpen ? (
                <div className={["px-5 text-sm leading-relaxed text-slate-600", variant === "card" ? "pb-4" : "pb-5"].join(" ")}>
                  {it.a}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}


