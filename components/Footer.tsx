 "use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail } from "lucide-react";
import { HOTLINE, ZALO_URL, ADDRESS, EMAIL } from "@/lib/constants";
import { useTranslations } from "next-intl";

function SocialLink({
  href,
  label,
  d
}: {
  href: string;
  label: string;
  d: string;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-slate-700 transition hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition group-hover:border-slate-300 group-hover:bg-slate-50 group-hover:text-emerald-700">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d={d} fill="currentColor" opacity="0.75" />
        </svg>
      </span>
      <span className="underline-offset-4 group-hover:underline">{label}</span>
    </a>
  );
}

export function Footer() {
  const tFooter = useTranslations("home.footer");
  const pathname = usePathname();
  const homeBase = useMemo(() => {
    if (pathname?.startsWith("/en")) return "/en";
    if (pathname?.startsWith("/vi")) return "/vi";
    return "/";
  }, [pathname]);

  function resolveHref(href: string) {
    if (href.startsWith("#")) return `${homeBase}${href}`;
    return href;
  }

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* BRAND */}
          <div>
            <a href={homeBase} className="inline-flex items-center gap-3 rounded-xl">
              <img src="/logo.png" alt="ENSO – Hạt khử mùi" className="h-9 w-auto" />
            </a>
            <p className="mt-4 text-sm font-semibold text-slate-900">{tFooter("brandTitle")}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {tFooter("brandSubtitle")}
            </p>
          </div>

          {/* LIÊN HỆ */}
          <div className="text-sm text-slate-600">
            <p className="text-sm font-semibold text-slate-900">{tFooter("contactTitle")}</p>
            <div className="mt-3 space-y-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </span>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(ADDRESS + ", Vietnam")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-slate-800 underline-offset-4 hover:text-emerald-700 hover:underline"
                >
                  {ADDRESS}, Vietnam
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>
                <a href={`tel:${HOTLINE}`} className="font-medium text-slate-800 underline-offset-4 hover:text-emerald-700 hover:underline">
                  {HOTLINE.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
                <a href={`mailto:${EMAIL}`} className="font-medium text-slate-800 underline-offset-4 hover:text-emerald-700 hover:underline">
                  {EMAIL}
                </a>
              </div>
              <p className="mt-2 flex items-center gap-2 pl-11">
                {tFooter("zaloLabel")}{" "}
                <a className="font-semibold text-slate-900 underline-offset-4 hover:text-emerald-700 hover:underline" href={ZALO_URL} target="_blank" rel="noreferrer">
                  {tFooter("zaloChatNow")}
                </a>
              </p>
            </div>
          </div>

          {/* HỖ TRỢ */}
          <div className="text-sm text-slate-600">
            <p className="text-sm font-semibold text-slate-900">{tFooter("supportTitle")}</p>
            <div className="mt-3 grid gap-2">
              {[
                { label: tFooter("supportLinks.howToUse"), href: resolveHref("#cach-dung") },
                { label: tFooter("supportLinks.faq"), href: resolveHref("#faq") },
                { label: tFooter("supportLinks.becomeDealer"), href: resolveHref("#lien-he") }
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="inline-flex w-fit rounded-xl text-sm font-semibold text-slate-700 underline-offset-4 transition hover:text-emerald-700 hover:underline focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* KẾT NỐI */}
          <div>
            <p className="text-sm font-semibold text-slate-900">{tFooter("connectTitle")}</p>
            <div className="mt-3 grid gap-1">
              <SocialLink
                href="https://www.facebook.com/people/H%E1%BA%A1t-kh%E1%BB%AD-m%C3%B9i-ENSO/61556722591113/"
                label="Facebook"
                d="M14 8h2V5h-2c-2 0-3 1-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8c0-.6.2-1 1-1z"
              />
              
              <SocialLink
                href="https://youtube.com/@ensodana?si=ugl9m3fs1B-LUQeJ"
                label={tFooter("youtubeLabel")}
                d="M21 8s0-2-2-2H5C3 6 3 8 3 8v8s0 2 2 2h14c2 0 2-2 2-2V8zm-11 9V7l7 5-7 5z"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} ENSO</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <a
                  href={resolveHref("#lien-he")}
                className="rounded-xl font-semibold text-slate-700 underline-offset-4 transition hover:text-emerald-700 hover:underline focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                {tFooter("policies.shipping")}
              </a>
              <span className="text-slate-300">|</span>
              <a
                  href={resolveHref("#lien-he")}
                className="rounded-xl font-semibold text-slate-700 underline-offset-4 transition hover:text-emerald-700 hover:underline focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                {tFooter("policies.returns")}
              </a>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-600">
            {tFooter("ecoNote")}
          </p>
        </div>
      </div>
    </footer>
  );
}


