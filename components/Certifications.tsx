"use client";

import { useMemo, useState } from "react";
import { certifications, type Certification } from "@/lib/trust";
import { ImageModal } from "@/components/ImageModal";
import { Button } from "@/components/Button";
import { useTranslations } from "next-intl";

export function Certifications({ items: itemsProp }: { items?: Certification[] }) {
  const t = useTranslations("home.certifications");
  const items = useMemo(() => itemsProp ?? certifications, [itemsProp]);
  const [active, setActive] = useState<Certification | null>(null);

  return (
    <section id="chung-nhan" className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 md:py-16">
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{t("title")}</h2>
      <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
        {t("subtitle")}
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">{t("whyTitle")}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {t("whyDesc")}
        </p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <article
            key={c.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                <img src={c.logoSrc} alt={c.title} className="h-7 w-auto opacity-90 grayscale" loading="lazy" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-slate-900">{c.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.description}</p>
              </div>
            </div>

            {c.certificateImageSrc ? (
              <div className="mt-4">
                <Button type="button" variant="secondary" size="sm" onClick={() => setActive(c)}>
                  {t("view")}
                </Button>
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <ImageModal
        open={Boolean(active?.certificateImageSrc)}
        title={active?.title ?? t("modalFallbackTitle")}
        src={active?.certificateImageSrc ?? ""}
        onClose={() => setActive(null)}
      />
    </section>
  );
}


