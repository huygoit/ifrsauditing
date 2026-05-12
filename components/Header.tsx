"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { HOTLINE } from "@/lib/constants";
import { LinkButton } from "@/components/Button";
import { useTranslations } from "next-intl";

type NavItem = { label: string; href: string };

/** Trang chủ theo locale (/vi, /en) — dùng cho anchor sau khi đóng menu mobile (Safari iOS hay không cuộn nếu chỉ dùng href). */
function isLocaleHomePath(pathname: string | null, homeBase: string) {
  if (!pathname) return false;
  if (homeBase === "/") return pathname === "/" || pathname === "";
  return pathname === homeBase || pathname === `${homeBase}/`;
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  const tNav = useTranslations("nav");
  const tHomeHeader = useTranslations("home.header");
  const tCommon = useTranslations("common");
  const nav = useMemo<NavItem[]>(
    () => [
      { label: tNav("home"), href: "/" },
      { label: tNav("products"), href: "#san-pham" },
      { label: tNav("benefits"), href: "#cong-dung" },
      { label: tNav("howToUse"), href: "#cach-dung" },
      { label: tNav("video"), href: "#video" },
      { label: tNav("news"), href: "/news" },
      { label: tNav("faq"), href: "#faq" }
    ],
    [tNav]
  );
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hash, setHash] = useState("");

  const currentLocale = useMemo<"vi" | "en">(() => {
    if (pathname?.startsWith("/en")) return "en";
    return "vi";
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setHash(window.location.hash || "");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const homeBase = useMemo(() => {
    // Public site uses next-intl with /vi and /en prefixes.
    // When we are on /[locale]/news, anchor links must point back to home.
    if (pathname?.startsWith("/en")) return "/en";
    if (pathname?.startsWith("/vi")) return "/vi";
    return "/";
  }, [pathname]);

  const switchLocaleHref = useMemo(() => {
    const basePath = pathname || "/";
    const search = searchParams?.toString() ? `?${searchParams.toString()}` : "";

    function stripLocalePrefix(p: string) {
      if (p === "/vi" || p.startsWith("/vi/")) return p.slice(3) || "/";
      if (p === "/en" || p.startsWith("/en/")) return p.slice(3) || "/";
      return p || "/";
    }

    const rest = stripLocalePrefix(basePath);
    return (next: "vi" | "en") => `/${next}${rest === "/" ? "" : rest}${search}${hash}`;
  }, [pathname, searchParams, hash]);

  function resolveHref(href: string) {
    if (href.startsWith("#")) return `${homeBase}${href}`;
    // Allow writing locale-agnostic paths like "/news" and auto-prefix locale.
    if (href.startsWith("/") && !href.startsWith("/vi") && !href.startsWith("/en") && homeBase !== "/") return `${homeBase}${href}`;
    return href;
  }

  /** Anchor trong trang: chặn mặc định, đóng drawer, cuộn có delay — tránh lỗi iOS khi body vừa bỏ overflow:hidden */
  function onNavAnchorClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    setOpen(false);
    const id = href.slice(1);
    const full = `${homeBase}${href}`;
    const onHome = isLocaleHomePath(pathname, homeBase);

    const run = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        try {
          window.history.replaceState(null, "", full);
        } catch {
          /* noop */
        }
      } else {
        window.location.href = full;
      }
    };

    if (onHome) {
      window.setTimeout(run, 220);
    } else {
      window.location.assign(full);
    }
  }

  function IconFlagVi({ className }: { className?: string }) {
    // Vietnam flag — square.
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect x="0" y="0" width="24" height="24" fill="#DA251D" />
        <path
          d="M12 6.1l1.45 3.1 3.35.3-2.54 2.15.78 3.25L12 13.3 9 14.9l.78-3.25L7.24 9.5l3.35-.3L12 6.1z"
          fill="#FFDD00"
        />
      </svg>
    );
  }

  function IconFlagEn({ className }: { className?: string }) {
    // UK flag (Union Jack) — square.
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <defs>
          <clipPath id="header-flag-en-clip">
            <rect x="0" y="0" width="24" height="24" />
          </clipPath>
        </defs>
        <g clipPath="url(#header-flag-en-clip)">
          <rect x="0" y="0" width="24" height="24" fill="#012169" />
          {/* white diagonals */}
          <path d="M-2 2 L26 30" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="butt" />
          <path d="M-2 22 L26 -6" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="butt" />
          {/* red diagonals */}
          <path d="M-2 2 L26 30" stroke="#C8102E" strokeWidth="3" strokeLinecap="butt" />
          <path d="M-2 22 L26 -6" stroke="#C8102E" strokeWidth="3" strokeLinecap="butt" />
          {/* white cross */}
          <path d="M12 0 V24" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="butt" />
          <path d="M0 12 H24" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="butt" />
          {/* red cross */}
          <path d="M12 0 V24" stroke="#C8102E" strokeWidth="4" strokeLinecap="butt" />
          <path d="M0 12 H24" stroke="#C8102E" strokeWidth="4" strokeLinecap="butt" />
        </g>
      </svg>
    );
  }

  function LangSwitch({ onAfterClick }: { onAfterClick?: () => void }) {
    function Btn({ locale }: { locale: "vi" | "en" }) {
      const active = currentLocale === locale;
      return (
        <a
          href={switchLocaleHref(locale)}
          onClick={onAfterClick}
          className={[
            "inline-flex h-9 w-9 items-center justify-center rounded-full transition",
            "ring-1 ring-inset shadow-sm",
            active
              ? "bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 ring-emerald-200 shadow-md"
              : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
          ].join(" ")}
          aria-label={locale === "vi" ? tCommon("lang.switchToVi") : tCommon("lang.switchToEn")}
          title={locale === "vi" ? tCommon("lang.vi") : tCommon("lang.en")}
        >
          {locale === "vi" ? <IconFlagVi className="h-5 w-5" /> : <IconFlagEn className="h-5 w-5" />}
        </a>
      );
    }

    return (
      <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
        <Btn locale="vi" />
        <Btn locale="en" />
      </div>
    );
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Always open at the top on mobile.
    window.setTimeout(() => mobileScrollRef.current?.scrollTo?.({ top: 0 }), 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href={homeBase} className="flex items-center gap-2 rounded-xl">
          <img src="/logo.png" alt="ENSO – Hạt khử mùi" className="h-8 w-auto" />
          <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 sm:inline">
            {tHomeHeader("productPill")}
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex" aria-label={tCommon("mainNav")}>
          {nav.map((item) => (
            <a
              key={item.href}
              href={resolveHref(item.href)}
              className="rounded-xl transition hover:text-slate-900"
              onClick={(e) => onNavAnchorClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LinkButton href={`tel:${HOTLINE}`} variant="secondary" size="sm">
            {tHomeHeader("hotline")}
          </LinkButton>
          <LangSwitch />
          <LinkButton href={resolveHref("#lien-he")} variant="primary" size="sm">
            {tCommon("contactNow")}
          </LinkButton>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
          aria-label={tCommon("openMenu")}
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <IconMenu className="h-5 w-5" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[1000] md:hidden" role="dialog" aria-modal="true" aria-label={tHomeHeader("menuDialog")}>
          <button
            type="button"
            className="absolute inset-0 z-0 bg-slate-900/30"
            aria-label={tHomeHeader("close")}
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-10 flex h-screen w-[86%] max-w-sm flex-col border-l border-slate-200 bg-white shadow-soft h-[100dvh]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <img src="/logo.png" alt="ENSO – Hạt khử mùi" className="h-8 w-auto" />
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50"
                aria-label={tHomeHeader("closeMenu")}
                onClick={() => setOpen(false)}
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            <div ref={mobileScrollRef} className="flex-1 min-h-0 overflow-y-auto px-6 py-5 overscroll-contain">
              <div className="space-y-2">
                {nav.map((item) => (
                  <a
                    key={item.href}
                    href={resolveHref(item.href)}
                    className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    onClick={(e) => {
                      if (item.href.startsWith("#")) onNavAnchorClick(e, item.href);
                      else setOpen(false);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-end">
                <LangSwitch onAfterClick={() => setOpen(false)} />
              </div>

              <div className="mt-6 grid gap-3">
                <LinkButton href={`tel:${HOTLINE}`} variant="secondary" size="sm">
                  {tHomeHeader("callHotline", { hotline: HOTLINE })}
                </LinkButton>
                <LinkButton href={resolveHref("#lien-he")} variant="primary" size="sm" onClick={() => setOpen(false)}>
                  {tCommon("contactNow")}
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}


