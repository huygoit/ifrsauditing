"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ImageModal({
  open,
  title,
  src,
  onClose
}: {
  open: boolean;
  title: string;
  src: string;
  onClose: () => void;
}) {
  const tCommon = useTranslations("common");
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!open) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    setZoomed(false);
    lastFocusedRef.current?.focus?.();
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-slate-900/45" onClick={onClose} aria-label={tCommon("close")} />
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-3xl -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tCommon("certification")}</p>
              <p className="truncate text-base font-semibold text-slate-900">{title}</p>
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

          <div className="max-h-[72vh] overflow-auto p-5">
            <button
              type="button"
              className="block w-full"
              onClick={() => setZoomed((z) => !z)}
              aria-label={zoomed ? tCommon("zoomOut") : tCommon("zoomIn")}
            >
              <img
                src={src}
                alt={title}
                className={[
                  "mx-auto max-h-[62vh] w-full rounded-2xl border border-slate-200 bg-white object-contain shadow-sm transition-transform duration-300",
                  zoomed ? "scale-110 cursor-zoom-out" : "scale-100 cursor-zoom-in"
                ].join(" ")}
                loading="lazy"
              />
            </button>
            <p className="mt-3 text-xs text-slate-500">
              {tCommon("clickImageTo", { action: zoomed ? tCommon("zoomOut").toLowerCase() : tCommon("zoomIn").toLowerCase() })}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}


