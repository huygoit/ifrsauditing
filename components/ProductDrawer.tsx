"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/lib/products";
import { formatVnd } from "@/lib/format";
import { useTranslations } from "next-intl";

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProductDrawer({
  product,
  onClose,
  onSelect
}: {
  product: Product | null;
  onClose: () => void;
  onSelect: (p: Product) => void;
}) {
  const tCommon = useTranslations("common");
  const t = useTranslations("home.productModal");
  const open = Boolean(product);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (!open) return;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    lastFocusedRef.current?.focus?.();
  }, [open]);

  if (!product) return null;
  const hasPrice = Number(product.priceVnd ?? 0) > 0;

  return (
    <div className="fixed inset-0 z-[70] md:hidden" role="dialog" aria-modal="true" aria-label={tCommon("quickViewAria", { name: product.name })}>
      <button className="absolute inset-0 bg-slate-900/35" onClick={onClose} aria-label={tCommon("close")} />

      <div className="absolute inset-x-0 bottom-0">
        <div className="rounded-t-3xl border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between px-5 pb-3 pt-4">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-500">
                {tCommon("usedFor")} {product.category}
              </p>
              <p className="truncate text-base font-semibold text-slate-900">{product.name}</p>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              aria-label={tCommon("close")}
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[78vh] overflow-auto px-5 pb-5">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-emerald-50">
              <img src={product.image} alt={`${product.name} – hạt khử mùi ENSO`} className="h-full w-full object-cover" />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                {product.sizeTag}
              </span>
              {hasPrice ? <span className="text-base font-semibold text-slate-900">{formatVnd(product.priceVnd)}</span> : null}
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-900">{t("highlights")}</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              {product.highlights.slice(0, 5).map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <IconCheck className="h-4 w-4" />
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-sm font-semibold text-slate-900">{t("usage")}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{product.usage}</p>

            <button
              type="button"
              onClick={() => onSelect(product)}
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              {t("selectThis")}
            </button>

            <p className="mt-3 text-xs text-slate-500">{t("tipDrawer")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


