"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/Button";

export function RecruitmentCTA() {
  const t = useTranslations("ifrs.recruitment");

  return (
    <section id="tuyen-dung" className="relative overflow-hidden border-t border-emerald-400/10 py-10 text-white md:py-14">
      {/* Nền slate tối với dải teal đồng bộ với hero */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#212A31] via-[#124E66] to-[#161D22]"
        aria-hidden="true"
      />
      {/* Vầng sáng teal tạo chiều sâu, giống hero */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(65% 60% at 15% 10%, rgba(31,106,135,0.42), transparent 58%),
            radial-gradient(55% 55% at 90% 88%, rgba(18,78,102,0.25), transparent 55%)`
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-base leading-[1.75] text-emerald-50/90 md:text-lg md:leading-[1.75]">{t("subtitle")}</p>
          <p className="mt-4 text-sm leading-relaxed text-emerald-100/70">{t("note")}</p>
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
