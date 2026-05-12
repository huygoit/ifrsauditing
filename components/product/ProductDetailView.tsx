"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { OrderForm } from "@/components/OrderForm";
import { HOTLINE } from "@/lib/constants";
import { formatVnd } from "@/lib/format";
import type { Product } from "@/lib/products";
import type { ProductGalleryItem } from "@/lib/public/getProductDetail";

type Props = {
  locale: "vi" | "en";
  product: Product;
  galleryItems: ProductGalleryItem[];
  descriptionHtml: string;
  related: Product[];
  orderOptions: Array<{ value: string; label: string }>;
  defaultSelection: string;
};

function clampQty(n: number) {
  return Math.min(10, Math.max(1, Math.floor(n)));
}

/**
 * Trang chi tiết: gallery có lightbox, điều hướng mượt, sidebar mua hàng sticky,
 * mô tả chi tiết nền sáng với thứ bậc heading và danh sách số rõ ràng.
 */
export function ProductDetailView({
  locale,
  product,
  galleryItems,
  descriptionHtml,
  related,
  orderOptions,
  defaultSelection
}: Props) {
  const t = useTranslations("productDetail");
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const onOrderSuccessReset = useCallback(() => setQty(1), []);

  const imgs = useMemo(() => {
    const list = galleryItems.filter((g) => g.src);
    return list.length ? list : product.image?.trim() ? [{ src: product.image, alt: product.name }] : [];
  }, [galleryItems, product.image, product.name]);

  const main = imgs[Math.min(activeImg, Math.max(0, imgs.length - 1))] ?? { src: "", alt: product.name };
  const mainSrc = main.src;

  const hasDiscount = Boolean(product.compareAtVnd && product.compareAtVnd > product.priceVnd);
  const pctOff =
    hasDiscount && product.compareAtVnd
      ? Math.round((1 - product.priceVnd / product.compareAtVnd) * 100)
      : 0;
  const lineTotal = product.priceVnd * qty;

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hasDetailBlock = Boolean(descriptionHtml);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  const lightboxNode =
    mounted && lightboxOpen && mainSrc
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={t("lightboxAria")}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              {t("lightboxClose")}
            </button>
            <div className="relative max-h-[85vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mainSrc} alt={main.alt || product.name} className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl" />
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {lightboxNode}

      <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {/* Nền gradient nhẹ — overflow chỉ ở khối này */}
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 px-4 py-8 shadow-inner sm:px-6 lg:px-8">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-200/20 blur-3xl"
            aria-hidden
          />

        {/* Hai cột 50/50: ảnh full chiều ngang nửa trái, thẻ mua nửa phải — cân trực quan */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-8 lg:items-start xl:gap-10">
          <div className="min-w-0 space-y-10">
            <section id="pd-overview" className="scroll-mt-28 space-y-5">
              <div className="relative flex w-full flex-col gap-4">
                {product.featured ? (
                  <span className="absolute left-3 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-950 shadow-md sm:left-4 sm:top-5">
                    <span aria-hidden>★</span> {t("featuredPill")}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => mainSrc && setLightboxOpen(true)}
                  className="group relative w-full overflow-hidden rounded-3xl border border-slate-200/90 bg-stone-100 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/[0.06] transition hover:ring-emerald-400/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  aria-label={t("openLightbox")}
                  disabled={!mainSrc}
                >
                  <div className="relative aspect-[4/5] w-full max-w-full">
                    {mainSrc ? (
                      <Image
                        src={mainSrc}
                        alt={main.alt || product.name}
                        fill
                        className="object-cover object-center transition duration-700 ease-out group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 48vw"
                        priority
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">ENSODANA</div>
                    )}
                  </div>
                  {mainSrc ? (
                    <span className="absolute bottom-2.5 right-2.5 rounded-full bg-slate-900/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm opacity-0 transition group-hover:opacity-100">
                      {t("zoomHint")}
                    </span>
                  ) : null}
                </button>

                {imgs.length > 1 ? (
                  <div className="flex w-full flex-wrap gap-2 sm:justify-start">
                    {imgs.map((g, i) => (
                      <button
                        key={`${g.src}-${i}`}
                        type="button"
                        onClick={() => setActiveImg(i)}
                        className={`relative aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-2xl border-2 bg-stone-100 shadow-sm transition sm:w-16 ${
                          i === activeImg
                            ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                            : "border-slate-200/80 opacity-90 ring-0 hover:border-slate-300 hover:opacity-100"
                        }`}
                        aria-label={`${t("galleryThumb")} ${i + 1}`}
                      >
                        <Image
                          src={g.src}
                          alt={g.alt || product.name}
                          fill
                          className="object-cover object-center"
                          sizes="72px"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Mô tả ngắn — typography rõ ràng, khối nổi */}
              {product.shortDesc?.trim() ? (
                <div className="rounded-2xl border border-emerald-100/80 bg-white/90 p-6 shadow-sm ring-1 ring-emerald-900/[0.03] backdrop-blur-sm sm:p-8">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">{t("shortLeadLabel")}</p>
                  <p className="mt-3 text-lg font-medium leading-relaxed text-slate-800 sm:text-xl">{product.shortDesc}</p>
                </div>
              ) : null}
            </section>
          </div>

          {/* Cột phải: cùng độ rộng ~50% — thẻ mua sticky */}
          <aside className="min-w-0">
            <div className="lg:sticky lg:top-24">
              <div
                id="pd-buy"
                className="scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white shadow-[0_28px_56px_-28px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/[0.04]"
              >
                <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white">
                  {product.badge ? (
                    <span className="inline-flex rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                      {product.badge}
                    </span>
                  ) : null}
                  <h1 className={`font-bold tracking-tight ${product.badge ? "mt-3" : ""} text-2xl sm:text-3xl`}>
                    {product.name}
                  </h1>
                  <p className="mt-2 text-sm text-white/90">{t("metaLine", { category: product.category, size: product.sizeTag })}</p>
                </div>

                <div className="space-y-5 p-6 sm:p-8">
                  <div>
                    <div className="flex flex-wrap items-end gap-2">
                      <span className="text-3xl font-bold tracking-tight text-slate-900">{formatVnd(lineTotal)}</span>
                      {qty > 1 ? (
                        <span className="text-sm text-slate-500">
                          {qty} × {formatVnd(product.priceVnd)}
                        </span>
                      ) : null}
                    </div>
                    {hasDiscount ? (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm text-slate-400 line-through">{formatVnd(product.compareAtVnd!)}</span>
                        {pctOff > 0 ? (
                          <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700">-{pctOff}%</span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <p className="text-xs leading-relaxed text-slate-500">{t("trustLine")}</p>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t("quantity")}</p>
                    <div className="mt-2 inline-flex items-center rounded-full border border-slate-200 bg-slate-50/90 p-1">
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-slate-600 transition hover:bg-white"
                        aria-label={t("qtyMinus")}
                        onClick={() => setQty((q) => clampQty(q - 1))}
                      >
                        −
                      </button>
                      <span className="min-w-[2.25rem] text-center text-sm font-bold tabular-nums text-slate-900">{qty}</span>
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-slate-600 transition hover:bg-white"
                        aria-label={t("qtyPlus")}
                        onClick={() => setQty((q) => clampQty(q + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => scrollToId("dat-hang")}
                      className="w-full rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 active:scale-[0.99]"
                    >
                      {t("ctaOrder")}
                    </button>
                    <a
                      href={`tel:${HOTLINE}`}
                      className="w-full rounded-2xl border-2 border-slate-200 py-3.5 text-center text-sm font-bold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50/50"
                    >
                      {t("ctaCall")}
                    </a>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-5">
                    <div className="rounded-xl bg-slate-50 px-2 py-3 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{t("infoCategory")}</p>
                      <p className="mt-1 line-clamp-2 text-xs font-semibold text-slate-900">{product.category}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-2 py-3 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{t("infoSize")}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-900">{product.sizeTag}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-2 py-3 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{t("infoSku")}</p>
                      <p className="mt-1 truncate text-xs font-semibold text-slate-900" title={product.id}>
                        {product.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Hai box tách riêng: mô tả chi tiết | liên hệ — cùng một hàng từ lg */}
        <div
          className={`mt-10 grid gap-6 sm:mt-12 lg:mt-14 ${hasDetailBlock ? "lg:grid-cols-2 lg:items-start lg:gap-8" : "lg:grid-cols-1"}`}
        >
          {hasDetailBlock ? (
            <section
              id="pd-detail"
              className="scroll-mt-28 rounded-[1.75rem] border border-slate-200/90 bg-white p-6 shadow-[0_20px_48px_-24px_rgba(15,23,42,0.12)] sm:p-8"
              aria-labelledby="pd-detail-title"
            >
              <h2 id="pd-detail-title" className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {t("detailTitle")}
              </h2>
              <div
                className="product-detail-html mt-6 min-h-[120px] w-full text-[15px] leading-relaxed text-slate-700"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </section>
          ) : null}

          <section
            id="dat-hang"
            className="scroll-mt-28 w-full min-w-0 rounded-[1.75rem] border border-slate-200/90 bg-white p-6 shadow-[0_20px_48px_-24px_rgba(15,23,42,0.12)] sm:p-8"
            aria-labelledby="order-form-heading"
          >
            {hasDetailBlock ? (
              <h3 id="order-form-heading" className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                {t("orderTitle")}
              </h3>
            ) : (
              <h2 id="order-form-heading" className="text-xl font-bold text-slate-900 sm:text-2xl">
                {t("orderTitle")}
              </h2>
            )}
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t("orderSubtitle")}</p>
            <div className="mt-6 w-full">
              <OrderForm
                embedded
                options={orderOptions}
                defaultSelection={defaultSelection}
                defaultQuantity={qty}
                onOrderSuccessReset={onOrderSuccessReset}
              />
            </div>
          </section>
        </div>
        </div>
      </div>

      {related.length ? (
        <section id="pd-related" className="mt-16 scroll-mt-28 lg:mt-24" aria-labelledby="pd-rel-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="pd-rel-title" className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {t("relatedTitle")}
            </h2>
            <a href={`/${locale}#san-pham`} className="text-sm font-semibold text-emerald-700 hover:underline">
              {t("backAll")}
            </a>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/${locale}/products/${p.id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-emerald-50 to-slate-50">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 text-sm font-bold text-slate-900">{p.name}</p>
                  <p className="mt-2 text-sm font-bold text-emerald-700">{formatVnd(p.priceVnd)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-4 py-3 shadow-[0_-12px_40px_rgba(15,23,42,0.12)] backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-slate-500">{product.name}</p>
            <p className="text-lg font-bold text-slate-900">{formatVnd(lineTotal)}</p>
          </div>
          <button
            type="button"
            onClick={() => scrollToId("dat-hang")}
            className="shrink-0 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md"
          >
            {t("ctaOrder")}
          </button>
        </div>
      </div>
    </>
  );
}
