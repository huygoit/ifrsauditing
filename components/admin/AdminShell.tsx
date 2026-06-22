"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { tAdmin } from "@/lib/admin/i18n";

type NavItem = { href: string; label: string };
type NavEntry = { type: "link"; href: string; label: string } | { type: "group"; groupLabel: string; defaultCollapsed: boolean; children: NavItem[] };

const NAV: NavEntry[] = [
  { type: "link", href: "/admin", label: "admin.nav.dashboard" },
  // Tạm ẩn: Quản lý sản phẩm, Combo, Chứng nhận (bỏ comment để bật lại)
  // {
  //   type: "group",
  //   groupLabel: "admin.nav.products_management",
  //   defaultCollapsed: true,
  //   children: [
  //     { href: "/admin/categories", label: "admin.nav.categories" },
  //     { href: "/admin/products", label: "admin.nav.products" }
  //   ]
  // },
  // { type: "link", href: "/admin/combos", label: "admin.nav.combos" },
  // { type: "link", href: "/admin/certifications", label: "admin.nav.certifications" },
  { type: "link", href: "/admin/partners", label: "admin.nav.partners" },
  { type: "link", href: "/admin/videos", label: "admin.nav.videos" },
  {
    type: "group",
    groupLabel: "admin.nav.news_management",
    defaultCollapsed: true,
    children: [
      { href: "/admin/post-categories", label: "admin.nav.post_categories" },
      { href: "/admin/posts", label: "admin.nav.posts" }
    ]
  },
  {
    type: "group",
    groupLabel: "admin.nav.site_content_management",
    defaultCollapsed: true,
    children: [
      { href: "/admin/site-content-categories", label: "admin.nav.site_content_categories" },
      { href: "/admin/site-contents", label: "admin.nav.site_contents" }
    ]
  },
  { type: "link", href: "/admin/faq", label: "admin.nav.faq" },
  { type: "link", href: "/admin/reviews", label: "admin.nav.reviews" },
  { type: "link", href: "/admin/orders", label: "admin.nav.orders" },
  { type: "link", href: "/admin/settings", label: "admin.nav.settings" },
  { type: "link", href: "/admin/users", label: "admin.nav.users" },
  { type: "link", href: "/admin/audit", label: "admin.nav.audit" }
];

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function LangSwitch() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const lang = sp.get("lang") === "en" ? "en" : "vi";
  const next = useMemo(() => (lang === "vi" ? "en" : "vi"), [lang]);
  const href = useMemo(() => {
    const params = new URLSearchParams(sp.toString());
    params.set("lang", next);
    return `${pathname}?${params.toString()}`;
  }, [pathname, sp, next]);

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      aria-label={tAdmin(lang as any, "common.language")}
    >
      {lang.toUpperCase()} → {next.toUpperCase()}
    </Link>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const lang = sp.get("lang") === "en" ? "en" : "vi";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    NAV.forEach((e) => {
      if (e.type === "group") init[e.groupLabel] = !e.defaultCollapsed;
    });
    return init;
  });

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <Link href={`/admin?lang=${lang}`} className="inline-flex items-center gap-2 rounded-xl">
              <img src="/brand/ifrs-auditing-logo.png" alt="IFRS Auditing" className="h-7 w-auto" />
              <span className="text-sm font-semibold">Admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <LangSwitch />
            <form
              action="#"
              onSubmit={(e) => e.preventDefault()}
              className="hidden sm:block"
              aria-label="Search (coming soon)"
            >
              <input
                className="w-72 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                placeholder="Search… (Ctrl/Cmd+K)"
                disabled
              />
            </form>
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/admin/auth/logout", { method: "POST" });
                window.location.href = "/admin/login";
              }}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside
          className={cn(
            "rounded-2xl border border-slate-200 bg-white p-3 shadow-sm",
            "lg:sticky lg:top-[72px] lg:h-[calc(100vh-96px)] lg:overflow-auto",
            mobileOpen ? "block" : "hidden lg:block"
          )}
        >
          <nav className="grid gap-1" aria-label="Admin">
            {NAV.map((entry, idx) => {
              if (entry.type === "link") {
                const active = pathname === entry.href;
                const href = `${entry.href}?lang=${lang}`;
                return (
                  <Link
                    key={entry.href}
                    href={href}
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm font-semibold transition",
                      active ? "bg-emerald-50 text-emerald-800" : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {tAdmin(lang, entry.label as any)}
                  </Link>
                );
              }
              const isOpen = groupOpen[entry.groupLabel] ?? false;
              const hasActive = entry.children.some((c) => pathname === c.href);
              return (
                <div key={entry.groupLabel} className="grid gap-1">
                  <button
                    type="button"
                    onClick={() => setGroupOpen((p) => ({ ...p, [entry.groupLabel]: !p[entry.groupLabel] }))}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition",
                      hasActive ? "bg-emerald-50/70 text-emerald-800" : "text-slate-700 hover:bg-slate-50"
                    )}
                    aria-expanded={isOpen}
                  >
                    <span>{tAdmin(lang, entry.groupLabel as any)}</span>
                    <svg
                      className={cn("h-4 w-4 transition", isOpen ? "rotate-180" : "")}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {isOpen
                    ? entry.children.map((c) => {
                        const active = pathname === c.href;
                        const href = `${c.href}?lang=${lang}`;
                        return (
                          <Link
                            key={c.href}
                            href={href}
                            className={cn(
                              "rounded-xl px-3 py-2 pl-5 text-sm font-semibold transition",
                              active ? "bg-emerald-50 text-emerald-800" : "text-slate-700 hover:bg-slate-50"
                            )}
                          >
                            {tAdmin(lang, c.label as any)}
                          </Link>
                        );
                      })
                    : null}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}


