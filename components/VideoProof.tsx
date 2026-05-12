"use client";

import { useMemo, useState } from "react";
import { videos, type VideoItem } from "@/lib/trust";
import { VideoModal } from "@/components/VideoModal";
import { LinkButton } from "@/components/Button";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

function IconPlay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M9 7l10 5-10 5V7z" fill="currentColor" />
    </svg>
  );
}

export function VideoProof({ items: itemsProp }: { items?: VideoItem[] }) {
  const t = useTranslations("home.videoProof");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const items = useMemo(() => itemsProp ?? videos, [itemsProp]);
  const [active, setActive] = useState<VideoItem | null>(null);
  const primary = items[0];
  const secondary = items.slice(1, 3);

  return (
    <section id="video" className="scroll-mt-24 mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 md:py-16">
      <h2 className="home-section-heading mt-2">{t("title")}</h2>
      
      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {primary ? (
          <button
            type="button"
            onClick={() => setActive(primary)}
            className="group text-left lg:col-span-2"
            aria-label={tCommon("openVideoAria", { title: primary.title })}
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-[0.99]">
              <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={primary.thumbnailSrc}
                  alt={primary.title}
                  className="aspect-[3/2] w-full object-cover opacity-95 transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex items-center justify-center rounded-2xl bg-white/90 p-3 text-emerald-700 shadow-sm transition-all group-hover:scale-[1.03]">
                    <IconPlay className="h-7 w-7" />
                  </span>
                </div>
                <span className="absolute right-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
                  {primary.duration}
                </span>
              </div>

              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{primary.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {t("primaryLabel")} · {primary.type === "youtube" ? t("youtube") : t("mp4")} · {t("clickToWatch")}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {t("featured")}
                </span>
              </div>
            </div>
          </button>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {secondary.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActive(v)}
              className="group text-left"
              aria-label={tCommon("openVideoAria", { title: v.title })}
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-[0.99]">
                <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={v.thumbnailSrc}
                    alt={v.title}
                    className="aspect-[3/2] w-full object-cover opacity-95 transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex items-center justify-center rounded-2xl bg-white/90 p-3 text-emerald-700 shadow-sm transition-all group-hover:scale-[1.03]">
                      <IconPlay className="h-6 w-6" />
                    </span>
                  </div>
                  <span className="absolute right-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
                    {v.duration}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-900">{v.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {v.type === "youtube" ? t("youtube") : t("mp4")} · {t("clickToWatch")}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <LinkButton
          href={`/${locale}/videos`}
          variant="ghost"
          size="sm"
          aria-label={t("viewMoreAria")}
          className="border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
        >
          {t("viewMore")} →
        </LinkButton>
      </div>

      <VideoModal video={active} onClose={() => setActive(null)} />
    </section>
  );
}


