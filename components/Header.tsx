"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LinkButton } from "@/components/Button";
import { IfrsBrandLogo } from "@/components/IfrsBrandLogo";
import { TopBar } from "@/components/TopBar";
import { SITE } from "@/lib/site";
import { useTranslations } from "next-intl";
import type { ServiceMenuItem } from "@/lib/siteContent/getServiceMenu";

type NavItem = { label: string; href: string };

// Cache menu dịch vụ theo ngôn ngữ để không gọi lại API mỗi lần điều hướng
const serviceMenuCache: Partial<Record<"vi" | "en", ServiceMenuItem[]>> = {};

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

function IconChevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [serviceMenu, setServiceMenu] = useState<ServiceMenuItem[]>([]);
  const [mobileSvcOpen, setMobileSvcOpen] = useState(false);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("ifrs");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hash, setHash] = useState("");

  const currentLocale = useMemo<"vi" | "en">(() => {
    if (pathname?.startsWith("/en")) return "en";
    return "vi";
  }, [pathname]);

  useEffect(() => {
    const cached = serviceMenuCache[currentLocale];
    if (cached) {
      setServiceMenu(cached);
      return;
    }
    let alive = true;
    fetch(`/api/service-menu?lang=${currentLocale}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((j) => {
        const items: ServiceMenuItem[] = Array.isArray(j?.items) ? j.items : [];
        serviceMenuCache[currentLocale] = items;
        if (alive) setServiceMenu(items);
      })
      .catch(() => {
        if (alive) setServiceMenu([]);
      });
    return () => {
      alive = false;
    };
  }, [currentLocale]);

  const nav = useMemo<NavItem[]>(
    () => [
      { label: t("nav.home"), href: "/" },
      { label: t("nav.services"), href: "#dich-vu" },
      { label: t("nav.ifrs"), href: "/ifrs" },
      { label: t("nav.insights"), href: "/news" },
      { label: t("nav.careers"), href: "/tuyen-dung" },
      { label: t("nav.contact"), href: "#lien-he" }
    ],
    [t]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setHash(window.location.hash || "");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const homeBase = useMemo(() => {
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
    if (href.startsWith("/") && !href.startsWith("/vi") && !href.startsWith("/en") && homeBase !== "/") return `${homeBase}${href}`;
    return href;
  }

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

    if (onHome) window.setTimeout(run, 220);
    else window.location.assign(full);
  }

  function IconFlagVi({ className }: { className?: string }) {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect x="0" y="0" width="24" height="24" fill="#DA251D" />
        <path d="M12 6.1l1.45 3.1 3.35.3-2.54 2.15.78 3.25L12 13.3 9 14.9l.78-3.25L7.24 9.5l3.35-.3L12 6.1z" fill="#FFDD00" />
      </svg>
    );
  }

  function IconFlagEn({ className }: { className?: string }) {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <defs>
          <clipPath id="hdr-en-clip">
            <rect x="0" y="0" width="24" height="24" />
          </clipPath>
        </defs>
        <g clipPath="url(#hdr-en-clip)">
          <rect x="0" y="0" width="24" height="24" fill="#012169" />
          <path d="M-2 2 L26 30" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="butt" />
          <path d="M-2 22 L26 -6" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="butt" />
          <path d="M-2 2 L26 30" stroke="#C8102E" strokeWidth="3" strokeLinecap="butt" />
          <path d="M-2 22 L26 -6" stroke="#C8102E" strokeWidth="3" strokeLinecap="butt" />
          <path d="M12 0 V24" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="butt" />
          <path d="M0 12 H24" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="butt" />
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
              ? "bg-gradient-to-br from-emerald-400/30 via-emerald-500/20 to-emerald-600/30 ring-emerald-400/40"
              : "bg-white/5 text-slate-200 ring-white/10 hover:bg-white/10"
          ].join(" ")}
          aria-label={locale === "vi" ? tCommon("lang.switchToVi") : tCommon("lang.switchToEn")}
          title={locale === "vi" ? tCommon("lang.vi") : tCommon("lang.en")}
        >
          {locale === "vi" ? <IconFlagVi className="h-5 w-5" /> : <IconFlagEn className="h-5 w-5" />}
        </a>
      );
    }

    return (
      <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 shadow-sm backdrop-blur-sm">
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
    window.setTimeout(() => mobileScrollRef.current?.scrollTo?.({ top: 0 }), 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="sticky top-0 z-50">
      <TopBar />
      <header className="border-b border-emerald-400/10 bg-[#212A31]/90 shadow-[0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a
            href={homeBase}
            className="group/logo flex items-center rounded-lg py-0.5 pl-0 pr-1 outline-none ring-offset-2 ring-offset-slate-950 transition hover:opacity-[0.92] focus-visible:ring-2 focus-visible:ring-amber-400/70"
          >
            <IfrsBrandLogo priority className="h-[52px] w-auto sm:h-[60px] md:h-[68px]" />
          </a>

          <nav className="hidden items-center gap-1 text-sm text-slate-200/95 md:flex md:gap-1 lg:gap-2" aria-label={tCommon("mainNav")}>
            {nav.map((item) => {
              const isServices = item.href === "#dich-vu" && serviceMenu.length > 0;
              if (isServices) {
                return (
                  <div key={item.href} className="group/svc relative">
                    <a
                      href={resolveHref(item.href)}
                      className="group/nav relative inline-flex items-center gap-1 rounded-lg px-2.5 py-2 font-medium transition hover:text-white"
                      onClick={(e) => onNavAnchorClick(e, item.href)}
                      aria-haspopup="true"
                    >
                      <span className="relative z-[1] text-white/95">{item.label}</span>
                      <IconChevron className="relative z-[1] h-3.5 w-3.5 text-white/70 transition duration-300 group-hover/svc:rotate-180" />
                      <span
                        className="absolute bottom-1 left-3 right-3 h-[2px] origin-center scale-x-0 rounded-full bg-gradient-to-r from-amber-400/90 to-amber-500/70 transition duration-300 group-hover/svc:scale-x-100"
                        aria-hidden="true"
                      />
                    </a>

                    <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition duration-200 group-hover/svc:visible group-hover/svc:translate-y-0 group-hover/svc:opacity-100 group-focus-within/svc:visible group-focus-within/svc:translate-y-0 group-focus-within/svc:opacity-100">
                      <div className="relative max-w-[min(94vw,1040px)] overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-emerald-950/15 ring-1 ring-black/5">
                        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600" aria-hidden="true" />
                        <div className="flex flex-wrap gap-x-10 gap-y-6">
                          {serviceMenu.map((parent) => (
                            <div key={parent.slug} className="w-64">
                              <a
                                href={resolveHref(`/noi-dung/${parent.slug}`)}
                                className="flex items-start gap-2 text-sm font-bold leading-snug tracking-tight text-emerald-700 transition hover:text-emerald-800"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                                <span>{parent.name}</span>
                              </a>
                              {parent.children.length ? (
                                <ul className="mt-2 space-y-0.5 border-l border-slate-100 pl-3">
                                  {parent.children.map((child) => (
                                    <li key={child.slug}>
                                      <a
                                        href={resolveHref(`/noi-dung/${child.slug}`)}
                                        className="block rounded-lg px-2 py-1.5 text-[13px] font-medium leading-snug text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800"
                                      >
                                        {child.name}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={item.href}
                  href={resolveHref(item.href)}
                  className="group/nav relative rounded-lg px-2.5 py-2 font-medium transition hover:text-white"
                  onClick={(e) => {
                    if (item.href.startsWith("#")) onNavAnchorClick(e, item.href);
                  }}
                >
                  <span className="relative z-[1] text-white/95">{item.label}</span>
                  <span
                    className="absolute bottom-1 left-3 right-3 h-[2px] origin-center scale-x-0 rounded-full bg-gradient-to-r from-amber-400/90 to-amber-500/70 transition duration-300 group-hover/nav:scale-x-100"
                    aria-hidden="true"
                  />
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <LangSwitch />
            <LinkButton
              href={resolveHref("#lien-he")}
              variant="primary"
              size="sm"
              className="border border-emerald-400/20 bg-emerald-500 px-5 shadow-md shadow-emerald-950/30 ring-1 ring-white/10 hover:bg-emerald-400"
            >
              {t("ctaConsult")}
            </LinkButton>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 p-2.5 text-white shadow-sm transition hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 md:hidden"
            aria-label={tCommon("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(true)}
          >
            <IconMenu className="h-5 w-5" />
          </button>
        </div>

        {open ? (
          <div className="fixed inset-0 z-[1000] md:hidden" role="dialog" aria-modal="true" aria-label={t("header.menuAria")}>
            <button type="button" className="absolute inset-0 z-0 bg-slate-950/70 backdrop-blur-sm" aria-label={tCommon("close")} onClick={() => setOpen(false)} />
            <div
              id="mobile-nav"
              className="fixed inset-y-0 right-0 z-10 flex h-[100dvh] w-[88%] max-w-sm flex-col border-l border-emerald-400/10 bg-[#212A31] text-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <IfrsBrandLogo className="h-8 w-auto" />
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 p-2 text-white"
                  aria-label={tCommon("close")}
                  onClick={() => setOpen(false)}
                >
                  <IconX className="h-5 w-5" />
                </button>
              </div>

              <div ref={mobileScrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                <div className="space-y-1">
                  {nav.map((item) => {
                    const isServices = item.href === "#dich-vu" && serviceMenu.length > 0;
                    if (isServices) {
                      return (
                        <div key={item.href} className="rounded-xl">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-white hover:bg-white/5"
                            onClick={() => setMobileSvcOpen((v) => !v)}
                            aria-expanded={mobileSvcOpen}
                          >
                            <span>{item.label}</span>
                            <IconChevron className={`h-4 w-4 text-white/70 transition ${mobileSvcOpen ? "rotate-180" : ""}`} />
                          </button>
                          {mobileSvcOpen ? (
                            <div className="mb-1 ml-3 border-l border-white/10 pl-3">
                              {serviceMenu.map((parent) => (
                                <div key={parent.slug} className="py-1">
                                  <a
                                    href={resolveHref(`/noi-dung/${parent.slug}`)}
                                    className="block rounded-lg px-2 py-2 text-[13px] font-bold text-emerald-300 hover:bg-white/5"
                                    onClick={() => setOpen(false)}
                                  >
                                    {parent.name}
                                  </a>
                                  {parent.children.map((child) => (
                                    <a
                                      key={child.slug}
                                      href={resolveHref(`/noi-dung/${child.slug}`)}
                                      className="block rounded-lg px-2 py-2 text-[13px] font-medium text-white/80 hover:bg-white/5"
                                      onClick={() => setOpen(false)}
                                    >
                                      {child.name}
                                    </a>
                                  ))}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    }

                    return (
                      <a
                        key={item.href}
                        href={resolveHref(item.href)}
                        className="block rounded-xl px-3 py-3 text-sm font-semibold text-white hover:bg-white/5"
                        onClick={(e) => {
                          if (item.href.startsWith("#")) onNavAnchorClick(e, item.href);
                          else setOpen(false);
                        }}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </div>
                <div className="mt-6 flex justify-end">
                  <LangSwitch onAfterClick={() => setOpen(false)} />
                </div>
                <div className="mt-6 grid gap-3">
                  <LinkButton href={`tel:${SITE.hotlineTel}`} variant="onDark" size="sm">
                    {SITE.hotlineDisplay}
                  </LinkButton>
                  <LinkButton href={resolveHref("#lien-he")} variant="primary" size="sm" className="bg-emerald-500 hover:bg-emerald-400" onClick={() => setOpen(false)}>
                    {t("ctaConsult")}
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </header>
    </div>
  );
}
