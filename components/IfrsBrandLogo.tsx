"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

type Props = {
  /** Lớp Tailwind cho kích thước, ví dụ h-8 w-auto md:h-9 */
  className?: string;
  /** Ưu tiên tải (chỉ nên bật trên logo header) */
  priority?: boolean;
};

export function IfrsBrandLogo({ className, priority }: Props) {
  const t = useTranslations("ifrs");
  return (
    <Image
      src="/brand/ifrs-auditing-logo.svg"
      alt={t("logoAlt")}
      width={260}
      height={48}
      className={className}
      priority={priority}
    />
  );
}
