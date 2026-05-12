"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";
import { LinkButton } from "@/components/Button";
import { useTranslations } from "next-intl";

export function StickyMobileBar() {
  const t = useTranslations("ifrs.sticky");
  const pathname = usePathname();
  const homeBase = useMemo(() => {
    if (pathname?.startsWith("/en")) return "/en";
    if (pathname?.startsWith("/vi")) return "/vi";
    return "/vi";
  }, [pathname]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white/[0.97] px-3 pt-3 shadow-[0_-12px_40px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-[1200px] gap-2">
        <LinkButton href={`tel:${SITE.hotlineTel}`} variant="secondary" size="sm" className="min-h-[44px] flex-1 border-slate-200/90 shadow-sm">
          {t("call")}
        </LinkButton>
        <LinkButton
          href={`${homeBase}#lien-he`}
          variant="primary"
          size="sm"
          className="min-h-[44px] flex-1 border border-emerald-400/25 bg-emerald-600 shadow-md shadow-emerald-900/20 hover:bg-emerald-500"
        >
          {t("consult")}
        </LinkButton>
      </div>
    </div>
  );
}
