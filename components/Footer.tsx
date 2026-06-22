"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { IfrsBrandLogo } from "@/components/IfrsBrandLogo";
import { SITE } from "@/lib/site";

function IconMail({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M4 6h16v12H4V6zm0 0l8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.9-1.9c.3-.3.7-.4 1.1-.3 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.4 21 3 13.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.4 0 .8-.3 1.1l-1.9 1.9z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function IconPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10zm0-9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations("ifrs.footer");
  const pathname = usePathname();
  const homeBase = useMemo(() => {
    if (pathname?.startsWith("/en")) return "/en";
    if (pathname?.startsWith("/vi")) return "/vi";
    return "/vi";
  }, [pathname]);

  function h(target: string) {
    return `${homeBase}${target}`;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#2E3944] to-[#161D22] text-slate-100/90">
      {/* Vầng sáng teal nhẹ ở mép trên cho liền mạch với hero/header */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48"
        style={{ backgroundImage: "radial-gradient(60% 100% at 18% 0%, rgba(18,78,102,0.28), transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href={homeBase} className="inline-flex flex-col items-start rounded-xl text-white outline-none ring-offset-2 ring-offset-emerald-950 transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-amber-400/60">
              <IfrsBrandLogo className="h-9 w-auto sm:h-10" />
              <span className="mt-2 text-xs text-emerald-100/65">{t("brandTitle")}</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-emerald-100/65">{t("brandDesc")}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">{t("servicesTitle")}</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a className="text-emerald-100/65 transition hover:text-emerald-300" href={h("#dich-vu")}>
                  {t("links.services")}
                </a>
              </li>
              <li>
                <a className="text-emerald-100/65 transition hover:text-emerald-300" href={h("#ifrs")}>
                  IFRS / VAS
                </a>
              </li>
              <li>
                <a className="text-emerald-100/65 transition hover:text-emerald-300" href={h("#tuyen-dung")}>
                  {t("links.careers")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">{t("infoTitle")}</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a className="text-emerald-100/65 transition hover:text-emerald-300" href={h("#gioi-thieu")}>
                  {t("links.about")}
                </a>
              </li>
              <li>
                <a className="text-emerald-100/65 transition hover:text-emerald-300" href={`${homeBase}/news`}>
                  {t("links.news")}
                </a>
              </li>
              <li>
                <a className="text-emerald-100/65 transition hover:text-emerald-300" href={h("#lien-he")}>
                  {t("links.privacy")}
                </a>
              </li>
              <li>
                <a className="text-emerald-100/65 transition hover:text-emerald-300" href={h("#lien-he")}>
                  {t("links.terms")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">{t("contactTitle")}</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-emerald-300">
                  <IconPhone className="h-4 w-4 shrink-0" />
                </span>
                <a href={`tel:${SITE.hotlineTel}`} className="font-medium text-emerald-50 hover:text-white">
                  {SITE.hotlineDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-emerald-300">
                  <IconMail className="h-4 w-4 shrink-0" />
                </span>
                <a href={`mailto:${SITE.email}`} className="font-medium text-emerald-50 hover:text-white">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-emerald-300">
                  <IconPin className="h-4 w-4 shrink-0" />
                </span>
                <span className="text-emerald-100/65">{SITE.hqAddressVi}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-emerald-100/45">
          <p>{t("copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
