"use client";

import { useMemo, useState } from "react";
import type { VideoItem } from "@/lib/trust";
import { VideoModal } from "@/components/VideoModal";
import { useTranslations } from "next-intl";

function IconPlay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M9 7l10 5-10 5V7z" fill="currentColor" />
    </svg>
  );
}

export function VideosGallery({ items }: { items: VideoItem[] }) {
  const tCommon = useTranslations("common");
  const t = useTranslations("home.videoProof");
  const [active, setActive] = useState<VideoItem | null>(null);

  const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  return (
    <>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {safeItems.map((v) => (
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
                    <IconPlay className="h-7 w-7" />
                  </span>
                </div>
                {v.duration ? (
                  <span className="absolute right-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
                    {v.duration}
                  </span>
                ) : null}
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

      <VideoModal video={active} onClose={() => setActive(null)} />
    </>
  );
}

