"use client";

import { PatternBg } from "@/components/PatternBg";
import { useLocale, useTranslations } from "next-intl";

function IconStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2.7l2.86 5.8 6.4.93-4.63 4.52 1.09 6.38L12 17.98 6.28 20.33l1.09-6.38L2.74 9.43l6.4-.93L12 2.7z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Testimonials({ reviews }: { reviews?: TestimonialItem[] }) {
  return <TestimonialsInner reviews={reviews} />;
}

export type TestimonialItem = {
  id?: string;
  tag: string;
  name: string;
  loc: string;
  date: string;
  // Back-compat: older UI used `stars`, DB-backed home data uses `rating`.
  stars?: number;
  rating?: number;
  text: string;
  images?: string[];
};

export function TestimonialsInner({ reviews: reviewsProp }: { reviews?: TestimonialItem[] }) {
  const t = useTranslations("home.testimonials");
  const locale = useLocale();
  const reviews =
    reviewsProp && reviewsProp.length
      ? reviewsProp
      : ([
          {
            tag: t("fallback.tag"),
            name: t("fallback.name"),
            loc: t("fallback.loc"),
            date: t("fallback.date"),
            stars: 5,
            text: t("fallback.text"),
            images: ["/reviews/review-01.jpg", "/reviews/review-02.jpg"]
          }
        ] as TestimonialItem[]);

  function getStars(r: TestimonialItem) {
    const n = (r.stars ?? r.rating ?? 0) as number;
    return Number.isFinite(n) ? Math.max(0, Math.min(5, n)) : 0;
  }

  const avgRating = (() => {
    const n = reviews.length;
    if (!n) return 0;
    const sum = reviews.reduce((acc, r) => acc + getStars(r), 0);
    return Math.max(0, Math.min(5, sum / n));
  })();

  const ratingText = new Intl.NumberFormat(locale, { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(avgRating);
  const starsForSummary = Math.max(0, Math.min(5, Math.round(avgRating)));

  function Stars({ n }: { n: number }) {
    return (
      <div className="flex items-center gap-0.5 text-emerald-600" aria-label={t("starsAria", { n })}>
        {Array.from({ length: 5 }).map((_, i) => (
          <IconStar key={i} className={["h-4 w-4", i < n ? "opacity-100" : "opacity-30"].join(" ")} />
        ))}
      </div>
    );
  }

  return (
    <section className="relative mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 md:py-16">
      <PatternBg variant="testimonials" className="rounded-[40px]" />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="home-section-heading">{t("title")}</h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Stars n={starsForSummary} />
          <span className="font-semibold text-slate-900">{t("rating", { rating: ratingText })}</span>
          <span className="text-slate-400">•</span>
          <span className="text-xs font-semibold text-slate-600">{t("count", { count: reviews.length })}</span>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, idx) => (
          <figure
            key={r.id ?? `${r.name}-${idx}`}
            className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <Stars n={Math.round(getStars(r))} />
              <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                {r.tag}
              </span>
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed text-slate-600">“{r.text}”</blockquote>
            {r.images?.length ? (
              <div className="mt-4 flex items-center gap-2">
                {r.images.slice(0, 4).map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt={t("imageAlt", { name: r.name })}
                    className="h-14 w-14 rounded-xl border border-slate-200 object-cover shadow-sm"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ))}
              </div>
            ) : null}
            <figcaption className="mt-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">{r.name}</span>
              <span className="text-xs text-slate-500">
                {r.loc} · {r.date}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}


