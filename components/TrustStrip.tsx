"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { ImageModal } from "@/components/ImageModal";
import type { Certification } from "@/lib/trust";
import type { HomePartner } from "@/lib/home/getHomeData";
import { useTranslations } from "next-intl";

type TrustBadge = {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  certificateSrc?: string;
};

export function TrustStrip({
  certifications,
  partners
}: {
  certifications?: Certification[];
  partners?: HomePartner[];
}) {
  const t = useTranslations("home.trustStrip");
  const badges: TrustBadge[] =
    certifications || partners
      ? [
          ...(certifications ?? []).map((c) => ({
            id: `cert:${c.id}`,
            title: c.title,
            subtitle: c.description || "",
            imageSrc: c.logoSrc,
            ...(c.certificateImageSrc ? { certificateSrc: c.certificateImageSrc } : {})
          })),
          ...(partners ?? []).map((p) => ({
            id: `partner:${p.id}`,
            title: p.name,
            subtitle: p.shortDesc || "",
            imageSrc: p.logoSrc
          }))
        ]
      : [
          {
            id: "ocop",
            title: t("fallback.ocop.title"),
            subtitle: t("fallback.ocop.subtitle"),
            imageSrc: "/trust/ocop.png",
            certificateSrc: "/certs/certs-1.png"
          },
          {
            id: "iso",
            title: t("fallback.iso.title"),
            subtitle: t("fallback.iso.subtitle"),
            imageSrc: "/trust/iso.png",
            certificateSrc: "/certs/certs-2.png"
          },
          {
            id: "acv",
            title: t("fallback.acv.title"),
            subtitle: t("fallback.acv.subtitle"),
            imageSrc: "/trust/acv.png"
          }
        ];

  const [active, setActive] = useState<{ title: string; src: string } | null>(null);

  return (
    <section aria-label={t("aria")} className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="home-section-heading">{t("label")}</h2>

        <div className="mt-4 -mx-4 overflow-x-auto px-4 no-scrollbar sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <div className="flex snap-x snap-mandatory gap-4 md:grid md:grid-cols-3">
            {badges.map((b) => (
              <article
                key={b.id}
                className="group w-[86%] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md md:w-auto"
              >
                <div className="bg-white">
                  <div className="aspect-[3/2] w-full overflow-hidden bg-white">
                    <img
                      src={b.imageSrc}
                      alt={b.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                    />
                  </div>

                  {b.certificateSrc ? (
                    <div className="border-t border-slate-200 px-4 py-3">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => setActive({ title: b.title, src: b.certificateSrc! })}
                      >
                        {t("viewCert")}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <ImageModal
        open={Boolean(active)}
        title={active?.title ?? t("modalTitleFallback")}
        src={active?.src ?? ""}
        onClose={() => setActive(null)}
      />
    </section>
  );
}


