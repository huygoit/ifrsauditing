"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

// Logo đối tác / khách hàng — thêm/bớt bằng cách sửa mảng path bên dưới
const LOGOS = ["1", "2", "3", "4", "5", "6", "7"].map((n) => `/images/client/${n}.png`);

function LogoTile({ src, decorative, grid }: { src: string; decorative?: boolean; grid?: boolean }) {
  return (
    <li aria-hidden={decorative ? true : undefined} className={grid ? "" : "shrink-0"}>
      <div
        className={[
          "group flex h-20 items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-brand md:h-24 md:px-7",
          grid ? "w-full" : "w-48"
        ].join(" ")}
      >
        <div className="relative h-10 w-full md:h-12">
          <Image
            src={src}
            alt=""
            fill
            sizes="180px"
            className="object-contain opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
          />
        </div>
      </div>
    </li>
  );
}

export function PartnersSection() {
  const t = useTranslations("ifrs.partners");
  // Nhân đôi danh sách để vòng chạy liền mạch khi tịnh tiến -50%
  const rowTop = [...LOGOS, ...LOGOS];
  // Hàng dưới đảo thứ tự + chạy ngược chiều cho sinh động
  const rowBottom = [...[...LOGOS].reverse(), ...[...LOGOS].reverse()];

  return (
    <section className="border-t border-slate-200/80 bg-slate-50 py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="section-title text-2xl font-semibold tracking-tight text-emerald-700 md:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-4 max-w-2xl text-base leading-[1.75] text-slate-600">{t("subtitle")}</p>
        </Reveal>

        {/* Mobile: lưới tĩnh hiển thị đủ logo — tránh marquee bị "đơ"/cắt cụt trên cảm ứng */}
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:hidden">
          {LOGOS.map((src, i) => (
            <LogoTile key={`grid-${i}`} src={src} grid />
          ))}
        </ul>

        {/* Desktop: dải logo chạy 2 hàng ngược chiều */}
        <div className="marquee-wrap relative mt-12 hidden overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-[0_8px_40px_rgba(15,23,42,0.06)] md:block">
          {/* Hoạ tiết chấm mờ + quầng sáng brand tạo chiều sâu */}
          <span
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgb(15 23 42 / 0.05) 1px, transparent 0)", backgroundSize: "22px 22px" }}
            aria-hidden="true"
          />
          <span className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-emerald-200/30 blur-3xl" aria-hidden="true" />

          <div className="relative space-y-5">
            <ul className="animate-marquee flex w-max items-center gap-5">
              {rowTop.map((src, i) => (
                <LogoTile key={`top-${i}`} src={src} decorative={i >= LOGOS.length} />
              ))}
            </ul>
            <ul className="animate-marquee-rev flex w-max items-center gap-5">
              {rowBottom.map((src, i) => (
                <LogoTile key={`bottom-${i}`} src={src} decorative={i >= LOGOS.length} />
              ))}
            </ul>
          </div>

          {/* Mờ dần 2 mép theo màu panel để trôi mượt */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-28 bg-gradient-to-r from-white to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-28 bg-gradient-to-l from-white to-transparent" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
