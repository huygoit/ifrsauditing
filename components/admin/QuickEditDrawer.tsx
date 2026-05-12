"use client";

import { useEffect, useRef } from "react";
import type { Lang } from "@prisma/client";
import { tAdmin } from "@/lib/admin/i18n";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export function QuickEditDrawer({
  open,
  title,
  subtitle,
  children,
  onClose,
  width = "default"
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  width?: "default" | "wide" | "half";
}) {
  const lang: Lang =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "vi";
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-slate-900/35" onClick={onClose} aria-label={tAdmin(lang, "common.close")} />
      <div
        className={cn(
          "absolute inset-y-0 right-0",
          width === "half" ? "w-1/2 min-w-[320px] max-w-[50vw]" : width === "wide" ? "w-[92%] max-w-3xl" : "w-[92%] max-w-lg"
        )}
      >
        <div className="flex h-full flex-col border-l border-slate-200 bg-white shadow-soft">
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang, "common.quick_edit")}</p>
              <p className="truncate text-lg font-semibold text-slate-900">{title}</p>
              {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className={cn(
                "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm",
                "transition hover:bg-slate-50 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              )}
              aria-label={tAdmin(lang, "common.close")}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-auto p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}


