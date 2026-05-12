"use client";

import type { ProductCategory } from "@/lib/products";
import { useTranslations } from "next-intl";

export type ProductSort = "ban-chay" | "moi" | "gia-tang" | "gia-giam";

function IconSearch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M10.5 18a7.5 7.5 0 115.2-12.9A7.5 7.5 0 0110.5 18z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M16.5 16.5L21 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CategoryFilter({
  categories,
  active,
  onChange,
  query,
  onQueryChange,
  sort,
  onSortChange,
  onQuickFilter
}: {
  categories: ProductCategory[];
  active: ProductCategory;
  onChange: (c: ProductCategory) => void;
  query: string;
  onQueryChange: (v: string) => void;
  sort: ProductSort;
  onSortChange: (v: ProductSort) => void;
  onQuickFilter: (v: "car" | "shoe" | "wc" | "combo") => void;
}) {
  const t = useTranslations("home.search");
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const isActive = c === active;
            return (
              <button
                key={c}
                type="button"
                onClick={() => onChange(c)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:shadow-sm"
                ].join(" ")}
                aria-pressed={isActive}
              >
                {c}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 md:w-[460px]">
          <label className="sr-only" htmlFor="search">
            {t("label")}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IconSearch className="h-5 w-5" />
            </span>
            <input
              id="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t("placeholder")}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
            {query ? (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                aria-label={t("clear")}
              >
                <IconX className="h-4 w-4" />
              </button>
            ) : null}
          </div>

         
        </div>
      </div>
    </div>
  );
}


