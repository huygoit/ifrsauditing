"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/Button";

export function RecruitmentCTA() {
  const t = useTranslations("ifrs.recruitment");

  return (
    <section id="tuyen-dung" className="relative scroll-mt-32 overflow-hidden border-t border-emerald-900/25 py-20 text-white md:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-950"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.18),transparent)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-base leading-[1.75] text-slate-200 md:text-lg md:leading-[1.75]">{t("subtitle")}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{t("note")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <LinkButton
              href="#lien-he"
              variant="primary"
              size="md"
              className="min-h-[48px] border border-emerald-400/30 bg-emerald-500 px-6 shadow-lg shadow-black/30 hover:bg-emerald-400"
            >
              {t("cta")}
            </LinkButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
