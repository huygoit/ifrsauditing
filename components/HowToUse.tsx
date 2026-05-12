/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Ban, Clock, Leaf, Package, Play, Sparkles, Sun, Wind } from "lucide-react";
import { useTranslations } from "next-intl";

type VideoItem = {
  title: string;
  caption: string;
  type: "youtube" | "mp4";
  src: string; // YouTube URL or /public/videos/*.mp4
  thumbnailSrc: string;
};

function toYouTubeEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    const id = u.searchParams.get("v") ?? (u.hostname.includes("youtu.be") ? u.pathname.slice(1).split("?")[0] : "");
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : url;
  } catch {
    return url;
  }
}

function VideoModal({
  open,
  video,
  onClose
}: {
  open: boolean;
  video: VideoItem | null;
  onClose: () => void;
}) {
  const t = useTranslations("home.howToUse");
  const tCommon = useTranslations("common");
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
    <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true" aria-label={video.title}>
      <button className="absolute inset-0 bg-slate-900/45" onClick={onClose} aria-label={tCommon("close")} />
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-3xl -translate-x-1/2 -translate-y-1/2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("modalTitle")}</p>
              <p className="truncate text-base font-semibold text-slate-900">{video.title}</p>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              aria-label={tCommon("close")}
            >
              <span className="sr-only">{tCommon("close")}</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="p-5">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100">
              {video.type === "youtube" ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={toYouTubeEmbedUrl(video.src)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video className="absolute inset-0 h-full w-full" src={video.src} controls playsInline preload="metadata" />
              )}
            </div>
            <p className="mt-3 text-sm text-slate-600">{video.caption}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Step({
  Icon,
  title,
  tone
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  tone: "emerald" | "amber";
}) {
  const style =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-amber-50 text-amber-800";
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <span className={["mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-xl", style].join(" ")}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold leading-snug text-slate-900">{title}</p>
    </div>
  );
}

function InfoBox({
  tone,
  Icon,
  title,
  items
}: {
  tone: "emerald" | "amber" | "warn";
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
}) {
  const style =
    tone === "warn"
      ? "border-rose-200 bg-rose-50 text-rose-900"
      : tone === "emerald"
        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
        : "border-amber-200 bg-amber-50 text-amber-900";

  const iconStyle =
    tone === "warn"
      ? "bg-white text-rose-700"
      : tone === "emerald"
        ? "bg-white text-emerald-700"
        : "bg-white text-amber-800";

  return (
    <div className={["rounded-2xl border px-4 py-4 shadow-sm", style].join(" ")}>
      <div className="flex items-start gap-3">
        <span className={["mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60", iconStyle].join(" ")}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <ul className="mt-2 space-y-1 text-sm">
            {items.map((t) => (
              <li key={t} className="leading-relaxed">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function VideoThumb({
  tone,
  label,
  video,
  onOpen,
  ariaLabel
}: {
  tone: "emerald" | "amber";
  label: string;
  video: VideoItem;
  onOpen: () => void;
  ariaLabel: string;
}) {
  const ring = tone === "emerald" ? "hover:border-emerald-200" : "hover:border-amber-200";
  return (
    <button
      type="button"
      onClick={onOpen}
      className={["group w-full text-left rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all md:hover:-translate-y-1 md:hover:shadow-md", ring].join(" ")}
      aria-label={ariaLabel}
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-100">
        <img src={video.thumbnailSrc} alt={video.title} className="aspect-video w-full object-cover opacity-95 transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex items-center justify-center rounded-2xl bg-white/90 p-3 text-emerald-700 shadow-sm transition-all group-hover:scale-[1.03]">
            <Play className="h-6 w-6" aria-hidden="true" />
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-900">{label}</p>
      <p className="mt-1 text-xs text-slate-600">{video.caption}</p>
    </button>
  );
}

export function HowToUse() {
  const t = useTranslations("home.howToUse");
  const tCommon = useTranslations("common");
  const phoiNangVideoBase = useMemo(
    () => ({
      title: t("cardA.video.title"),
      caption: t("cardA.video.caption"),
      type: "youtube" as const,
      src: "https://www.youtube.com/watch?v=OUeOGCeoPIQ"
    }),
    [t]
  );
  const phoiNangCardA = useMemo(() => ({ ...phoiNangVideoBase, thumbnailSrc: "/video-thumbs/howto-sun.png" }) satisfies VideoItem, [phoiNangVideoBase]);
  const phoiNangCardB = useMemo(() => ({ ...phoiNangVideoBase, thumbnailSrc: "/video-thumbs/howto-no-sun.png" }) satisfies VideoItem, [phoiNangVideoBase]);

  const [active, setActive] = useState<VideoItem | null>(null);

  return (
    <section id="cach-dung" className="scroll-mt-24 mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 md:py-16">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="home-section-heading">{t("sectionTitle")}</h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">{t("sectionSubtitle")}</p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {/* CARD A */}
        <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all md:hover:-translate-y-1 md:hover:shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{t("cardA.tag")}</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Leaf className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Step tone="emerald" Icon={Package} title={t("cardA.steps.s1")} />
            <Step tone="emerald" Icon={Wind} title={t("cardA.steps.s2")} />
            <Step tone="emerald" Icon={Sparkles} title={t("cardA.steps.s3")} />
          </div>

          <div className="mt-4">
            <VideoThumb
              tone="emerald"
              label={t("cardA.videoLabel")}
              video={phoiNangCardA}
              onOpen={() => setActive(phoiNangCardA)}
              ariaLabel={tCommon("openVideoAria", { title: phoiNangCardA.title })}
            />
          </div>

          <div className="mt-4 grid gap-3">
            <InfoBox
              tone="emerald"
              Icon={Sun}
              title={t("cardA.sunBoxTitle")}
              items={[t("cardA.sunBoxItems.i1"), t("cardA.sunBoxItems.i2")]}
            />
            <InfoBox
              tone="warn"
              Icon={AlertTriangle}
              title={t("cardA.warnTitle")}
              items={[t("cardA.warnItems.i1"), t("cardA.warnItems.i2")]}
            />
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 shadow-sm">
              <p className="font-semibold text-slate-900">{t("cardA.lifeTitle")}</p>
              <ul className="mt-2 space-y-1">
                <li>{t("cardA.lifeItems.i1")}</li>
                <li>{t("cardA.lifeItems.i2")}</li>
                <li>{t("cardA.lifeItems.i3")}</li>
              </ul>
            </div>
          </div>
        </article>

        {/* CARD B */}
        <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all md:hover:-translate-y-1 md:hover:shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">{t("cardB.tag")}</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Step tone="amber" Icon={Wind} title={t("cardB.steps.s1")} />
            <Step tone="amber" Icon={Ban} title={t("cardB.steps.s2")} />
            <Step tone="amber" Icon={Leaf} title={t("cardB.steps.s3")} />
          </div>

          <div className="mt-4">
            <VideoThumb
              tone="amber"
              label={t("cardB.videoLabel")}
              video={phoiNangCardB}
              onOpen={() => setActive(phoiNangCardB)}
              ariaLabel={tCommon("openVideoAria", { title: phoiNangCardB.title })}
            />
          </div>

          <div className="mt-4 grid gap-3">
            <InfoBox
              tone="amber"
              Icon={Clock}
              title={t("cardB.timeTitle")}
              items={[t("cardB.timeItems.i1"), t("cardB.timeItems.i2")]}
            />
            <InfoBox
              tone="warn"
              Icon={Ban}
              title={t("cardB.noSunTitle")}
              items={[t("cardB.noSunItems.i1"), t("cardB.noSunItems.i2")]}
            />
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 shadow-sm">
              <p className="font-semibold text-slate-900">{t("cardB.whenScentLessTitle")}</p>
              <ul className="mt-2 space-y-1">
                <li>{t("cardB.whenScentLessItems.i1")}</li>
                <li>{t("cardB.whenScentLessItems.i2")}</li>
                <li>{t("cardB.whenScentLessItems.i3")}</li>
              </ul>              
            </div>
          </div>
        </article>
      </div>

      <VideoModal open={Boolean(active)} video={active} onClose={() => setActive(null)} />
    </section>
  );
}


