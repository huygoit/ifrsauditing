"use client";

import { HOTLINE, ZALO_URL } from "@/lib/constants";
import { LinkButton } from "@/components/Button";
import { useTranslations } from "next-intl";

export function StickyMobileBar() {
  const t = useTranslations("home.stickyBar");
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/90 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-6xl gap-3 px-6 py-3">
        <LinkButton href={`tel:${HOTLINE}`} variant="secondary" className="flex-1">
          {t("callNow")}
        </LinkButton>
        <LinkButton href={ZALO_URL} target="_blank" rel="noreferrer" variant="primary" className="flex-1">
          {t("chatZalo")}
        </LinkButton>
      </div>
    </div>
  );
}


