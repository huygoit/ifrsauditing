"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { formatVnd } from "@/lib/format";
import { useTranslations } from "next-intl";

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100" />
      <div className="mt-4">
        <div className="min-w-0">
          <div className="h-4 w-2/3 rounded bg-slate-100" />
          <div className="mt-2 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
          <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="h-4 w-24 rounded bg-slate-100" />
        <div className="h-4 w-16 rounded bg-slate-100" />
      </div>
      <div className="mt-4 grid gap-2">
        <div className="h-11 w-full rounded-full bg-slate-100" />
        <div className="h-7 w-24 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  const cls =
    label === "Best seller"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : label === "-20%"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : label === "Combo tiết kiệm"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span className={["inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm", cls].join(" ")}>
      {label}
    </span>
  );
}

export function ProductGrid({
  locale,
  products,
  onBuyNow,
  loading = false
}: {
  locale: "vi" | "en";
  products: Product[];
  onBuyNow: (p: Product) => void;
  loading?: boolean;
}) {
  const tCommon = useTranslations("common");
  const router = useRouter();

  function goProductDetail(p: Product) {
    router.push(`/${locale}/products/${p.id}`);
  }
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label={tCommon("loadingProducts")}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p, idx) => (
        (() => {
          const hasPrice = Number(p.priceVnd ?? 0) > 0;
          return (
        <article
          key={p.id}
          className="group relative flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          role="link"
          tabIndex={0}
          onClick={() => goProductDetail(p)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              goProductDetail(p);
            }
          }}
          aria-label={tCommon("openProductDetailAria", { name: p.name })}
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-emerald-50">
            <img src={p.image} alt={`${p.name} – hạt khử mùi ENSO`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
            {p.badge ? (
              <div className="absolute left-3 top-3">
                <Badge label={p.badge} />
              </div>
            ) : idx < 2 ? (
              <div className="absolute left-3 top-3">
                <Badge label="Best seller" />
              </div>
            ) : null}
          </div>

          <div className="mt-4 min-w-0">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900">{p.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 line-clamp-2">{p.shortDesc}</p>
            <p className="mt-1 truncate text-xs font-semibold text-slate-500">
              {tCommon("usedFor")} {p.category}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            {hasPrice ? (
              <div className="min-w-0">
                <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                  <p className="text-base font-semibold text-slate-900">{formatVnd(p.priceVnd)}</p>
                  {p.compareAtVnd && p.compareAtVnd > p.priceVnd ? (
                    <p className="text-xs font-semibold text-slate-500 line-through">{formatVnd(p.compareAtVnd)}</p>
                  ) : null}
                  {p.compareAtVnd && p.compareAtVnd > p.priceVnd ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      {tCommon("savePct", { pct: Math.round((1 - p.priceVnd / p.compareAtVnd) * 100) })}
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{tCommon("priceIncludes")}</p>
              </div>
            ) : (
              <div />
            )}
          </div>

          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBuyNow(p);
              }}
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              {tCommon("contactNow")}
            </button>
            <span className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold text-emerald-700">
              {tCommon("viewDetails")} →
            </span>
          </div>
        </article>
          );
        })()
      ))}
    </div>
  );
}


