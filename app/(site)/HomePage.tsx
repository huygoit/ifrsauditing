"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { TrustStrip } from "@/components/TrustStrip";
import { CategoryFilter, type ProductSort } from "@/components/CategoryFilter";
import { ProductGrid } from "@/components/ProductGrid";
import { Benefits } from "@/components/Benefits";
import { UseCases } from "@/components/UseCases";
import { HowToUse } from "@/components/HowToUse";
import { type ComboPlan } from "@/components/PricingCombo";
import { VideoProof } from "@/components/VideoProof";
import { Testimonials, type TestimonialItem } from "@/components/Testimonials";
import { OrderForm } from "@/components/OrderForm";
import { FAQ, type FaqItem } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { HomeNewsSlider } from "@/components/HomeNewsSlider";
import type { Product, ProductCategory } from "@/lib/products";
import type { Certification, VideoItem } from "@/lib/trust";
import type {
  HomeBenefitHighlightItem,
  HomeNewsItem,
  HomePartner,
  HomeUseCasesCommercialBlock,
  HomeUseCasesPersonalBlock
} from "@/lib/home/getHomeData";
import { useTranslations } from "next-intl";

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

function SocialProofStrip() {
  const t = useTranslations("home.socialProof");
  return (
    <section aria-label={t("aria")} className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 text-emerald-600" aria-label={t("ariaRating")}>
            {Array.from({ length: 5 }).map((_, i) => (
              <IconStar key={i} className="h-4 w-4" />
            ))}
          </div>
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{t("customersTrusted", { count: "1.000" })}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[t("tags.partners"), t("tags.certifications"), t("tags.eco"), t("tags.trusted")].map((tag) => (
            <span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Back-compat export for older routes (rarely used directly).
export function HomePage() {
  return (
    <HomePageClient
      productCategories={["All"]}
      products={[]}
      certifications={[]}
      partners={[]}
      faqs={[]}
      videos={[]}
      reviews={[]}
      latestNews={[]}
      benefitHighlights={[]}
      useCasesPersonal={{ items: [], heading: null, subheading: null }}
      useCasesCommercial={{ items: [], heading: null, subheading: null }}
    />
  );
}

export function HomePageClient({
  locale = "vi",
  productCategories,
  products,
  certifications,
  partners,
  faqs,
  videos,
  reviews,
  latestNews,
  benefitHighlights,
  useCasesPersonal,
  useCasesCommercial
}: {
  locale?: "vi" | "en";
  productCategories: ProductCategory[];
  products: Product[];
  certifications: Certification[];
  partners: HomePartner[];
  faqs: FaqItem[];
  videos: VideoItem[];
  reviews: TestimonialItem[];
  latestNews: HomeNewsItem[];
  benefitHighlights: HomeBenefitHighlightItem[];
  useCasesPersonal: HomeUseCasesPersonalBlock;
  useCasesCommercial: HomeUseCasesCommercialBlock;
}) {
  const tCommon = useTranslations("common");
  const tHomeProducts = useTranslations("home.products");
  const tCombos = useTranslations("home.combos");
  const allLabel = tCommon("all") as ProductCategory;
  const [category, setCategory] = useState<ProductCategory>(allLabel);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ProductSort>("ban-chay");
  const [gridLoading, setGridLoading] = useState(false);

  const heroRatingText = useMemo(() => {
    if (!reviews?.length) return null;
    function getStars(r: TestimonialItem) {
      const n = (r.stars ?? r.rating ?? 0) as number;
      return Number.isFinite(n) ? Math.max(0, Math.min(5, n)) : 0;
    }
    const vals = reviews.map(getStars).filter((n) => n > 0);
    if (!vals.length) return null;
    const avg = Math.max(0, Math.min(5, vals.reduce((a, b) => a + b, 0) / vals.length));
    const fmt = new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN", { minimumFractionDigits: 0, maximumFractionDigits: 1 });
    return `${fmt.format(avg)}/5`;
  }, [reviews, locale]);

  const combos: ComboPlan[] = useMemo(
    () => [
      {
        id: "goi-le",
        name: tCombos("plans.single.name"),
        priceVnd: 99000,
        compareAtVnd: 99000,
        items: [tCombos("plans.single.items.i1"), tCombos("plans.single.items.i2"), tCombos("plans.single.items.i3")]
      },
      {
        id: "combo-tiet-kiem",
        name: tCombos("plans.save.name"),
        priceVnd: 269000,
        compareAtVnd: 339000,
        items: [tCombos("plans.save.items.i1"), tCombos("plans.save.items.i2"), tCombos("plans.save.items.i3")],
        emphasize: true
      },
      {
        id: "combo-gia-dinh",
        name: tCombos("plans.family.name"),
        badge: tCombos("plans.family.badge"),
        priceVnd: 399000,
        compareAtVnd: 519000,
        items: [tCombos("plans.family.items.i1"), tCombos("plans.family.items.i2"), tCombos("plans.family.items.i3")],
        emphasize: false
      }
    ],
    [tCombos]
  );

  const productOptions = useMemo(() => products.map((p) => ({ value: p.name, label: `${p.name} — ${p.sizeTag}` })), [products]);
  const comboOptions = useMemo(
    () => combos.map((c) => ({ value: tCombos("prefix", { name: c.name }), label: tCombos("prefix", { name: c.name }) })),
    [combos, tCombos]
  );
  const allOptions = useMemo(() => [...productOptions, ...comboOptions], [productOptions, comboOptions]);

  const [defaultSelection, setDefaultSelection] = useState<string>(allOptions[0]?.value ?? "");
  useEffect(() => {
    if (!defaultSelection && allOptions[0]?.value) setDefaultSelection(allOptions[0].value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOptions.length]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = products.filter((p) => {
      const okCategory = category === allLabel ? true : p.category === category;
      const okQuery = q ? p.name.toLowerCase().includes(q) : true;
      return okCategory && okQuery;
    });

    const arr = [...base];
    if (sort === "moi") arr.reverse();
    if (sort === "gia-tang") arr.sort((a, b) => a.priceVnd - b.priceVnd);
    if (sort === "gia-giam") arr.sort((a, b) => b.priceVnd - a.priceVnd);
    return arr;
  }, [category, query, sort]);

  useEffect(() => {
    setGridLoading(true);
    const t = window.setTimeout(() => setGridLoading(false), 220);
    return () => window.clearTimeout(t);
  }, [category, query, sort]);

  // Vào trang kèm hash: bổ sung cuộn tới section (một số trình duyệt iOS không xử lý đủ khi hydrate)
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => window.clearTimeout(t);
  }, []);

  function chooseSelection(value: string) {
    setDefaultSelection(value);
    scrollToId("lien-he");
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <Header />
      <main>
        <Reveal>
          <Hero ratingText={heroRatingText ?? undefined} />
        </Reveal>
        <Reveal>
          <HomeNewsSlider locale={locale} items={latestNews} />
        </Reveal>
        <Reveal>
          <TrustStrip certifications={certifications} partners={partners} />
        </Reveal>
        <Reveal>
          <SocialProofStrip />
        </Reveal>

        {/* Không bọc Reveal: tránh opacity-0 tới khi intersection — trên iPhone khi nhảy #san-pham dễ thấy khối trống */}
        <section id="san-pham" className="scroll-mt-24 mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="home-section-heading">{tHomeProducts("title")}</h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
                {tHomeProducts("subtitle")}
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-4">
            <CategoryFilter
              categories={productCategories}
              active={category}
              onChange={setCategory}
              query={query}
              onQueryChange={setQuery}
              sort={sort}
              onSortChange={setSort}
              onQuickFilter={(v) => {
                if (v === "combo") {
                  scrollToId("combo");
                  return;
                }
                if (v === "car") setCategory(tHomeProducts("quickCategories.car") as any);
                if (v === "shoe") setCategory(tHomeProducts("quickCategories.shoe") as any);
                if (v === "wc") setCategory(tHomeProducts("quickCategories.wc") as any);
                setQuery("");
              }}
            />

            <ProductGrid
              locale={locale}
              products={filtered}
              loading={gridLoading}
              onBuyNow={(p) => chooseSelection(p.name)}
            />

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                {tHomeProducts("empty")}
              </div>
            ) : null}
          </div>
        </section>

        <Reveal>
          <Benefits locale={locale} items={benefitHighlights} />
        </Reveal>
        <Reveal>
          <UseCases locale={locale} personal={useCasesPersonal} commercial={useCasesCommercial} />
        </Reveal>
        <Reveal>
          <HowToUse />
        </Reveal>

        <Reveal>
          <VideoProof items={videos} />
        </Reveal>

        <Reveal>
          <Testimonials reviews={reviews} />
        </Reveal>

        <Reveal>
          <section id="lien-he" className="scroll-mt-24 mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <span id="dat-hang" className="block scroll-mt-24" />
            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
              <div className="order-2 lg:order-1">
                <FAQ items={faqs} variant="card" />
              </div>
              <div className="order-1 lg:order-2">
                <OrderForm options={allOptions} defaultSelection={defaultSelection} />
              </div>
            </div>
          </section>
        </Reveal>
      </main>

      <Footer />
      <StickyMobileBar />

    </div>
  );
}

