"use client";

import { useEffect, useMemo, useRef } from "react";
import type { VideoItem } from "@/lib/trust";
import { useTranslations } from "next-intl";

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function toYouTubeEmbed(url: string) {
  try {
    const u = new URL(url);
    const id = u.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    // youtu.be short
    if (u.hostname.includes("youtu.be")) {
      const shortId = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${shortId}?autoplay=1&rel=0`;
    }
  } catch {
    // ignore
  }
  return url;
}

export function VideoModal({
  video,
  onClose
}: {
  video: VideoItem | null;
  onClose: () => void;
}) {
  const tCommon = useTranslations("common");
  const t = useTranslations("home.videoProof");
  const open = Boolean(video);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const embedUrl = useMemo(() => (video?.type === "youtube" ? toYouTubeEmbed(video.src) : ""), [video]);

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

  if (!video) return null;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label={video.title}>
      <button className="absolute inset-0 bg-slate-900/45" onClick={onClose} aria-label={tCommon("close")} />
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-4xl -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("modalLabel")}</p>
              <p className="truncate text-base font-semibold text-slate-900">{video.title}</p>
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

          <div className="p-5">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-950">
              {video.type === "youtube" ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video className="absolute inset-0 h-full w-full" src={video.src} controls autoPlay playsInline />
              )}
            </div>
            <p className="mt-3 text-xs text-slate-500">{t("closeNote")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


