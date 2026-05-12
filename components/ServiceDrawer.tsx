"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { ServiceId } from "@/lib/services";
import { Button } from "@/components/Button";

export function ServiceDrawer({
  open,
  serviceId,
  onClose,
  onConsult
}: {
  open: boolean;
  serviceId: ServiceId | null;
  onClose: () => void;
  onConsult: () => void;
}) {
  const t = useTranslations("ifrs.services");
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) {
      prevFocus.current = document.activeElement as HTMLElement | null;
      const id = window.setTimeout(() => closeRef.current?.focus(), 50);
      wasOpen.current = true;
      return () => window.clearTimeout(id);
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      window.setTimeout(() => {
        try {
          prevFocus.current?.focus?.();
        } catch {
          /* noop */
        }
      }, 0);
    }
  }, [open, serviceId]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !serviceId) return null;

  const prefix = `items.${serviceId}` as const;

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center md:items-center md:p-6" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[3px] transition-opacity"
        aria-label={t("drawer.close")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-drawer-title"
        className="relative z-10 flex max-h-[min(92vh,880px)] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.25rem] border border-slate-200/90 bg-white shadow-[0_-20px_60px_rgba(15,23,42,0.2)] md:rounded-3xl md:shadow-2xl"
      >
        <div className="flex shrink-0 justify-center pt-2 md:hidden" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-slate-200" />
        </div>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 pb-4 pt-3 md:px-6 md:pb-5 md:pt-5">
          <div className="min-w-0 pr-2">
            <h2 id="service-drawer-title" className="text-lg font-semibold leading-snug text-slate-900 md:text-xl">
              {t(`${prefix}.title`)}
            </h2>
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">{t(`${prefix}.subtitle`)}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="shrink-0 rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            onClick={onClose}
            aria-label={t("drawer.close")}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 md:px-6">
          <p className="text-base leading-[1.75] text-slate-600">{t(`${prefix}.desc`)}</p>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-700">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              <span>{t(`${prefix}.b1`)}</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              <span>{t(`${prefix}.b2`)}</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              <span>{t(`${prefix}.b3`)}</span>
            </li>
          </ul>
          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{t("drawer.fitFor")}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200/90 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
              {t(`${prefix}.t1`)}
            </span>
            <span className="rounded-full border border-slate-200/90 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
              {t(`${prefix}.t2`)}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:rounded-b-3xl md:pb-5">
          <Button
            type="button"
            className="w-full min-h-[48px] shadow-md shadow-emerald-900/10"
            variant="primary"
            size="md"
            onClick={() => {
              onConsult();
              onClose();
            }}
          >
            {t("drawer.cta")}
          </Button>
        </div>
      </div>
    </div>
  );
}
