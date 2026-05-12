"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type AdminVideo = {
  title: string;
  type: "YOUTUBE" | "MP4";
  src: string;
};

function youtubeEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}?autoplay=1&rel=0`;
    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
  } catch {
    // ignore
  }
  return url;
}

export function VideoPreviewModal({
  open,
  video,
  onClose
}: {
  open: boolean;
  video: AdminVideo | null;
  onClose: () => void;
}) {
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

  if (!open || !video) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label={video.title}>
      <button className="absolute inset-0 bg-slate-900/45" onClick={onClose} aria-label="Đóng" />
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-4xl -translate-x-1/2 -translate-y-1/2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <p className="truncate text-base font-semibold text-slate-900">{video.title}</p>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              aria-label="Đóng"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="p-5">
            <div className="relative overflow-hidden rounded-2xl bg-slate-100">
              {video.type === "YOUTUBE" ? (
                <iframe
                  className="aspect-video w-full"
                  src={youtubeEmbedUrl(video.src)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video className="aspect-video w-full" src={video.src} controls playsInline preload="metadata" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}


