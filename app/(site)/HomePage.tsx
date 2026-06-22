"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { AboutSection } from "@/components/AboutSection";
import { WhyChoose } from "@/components/WhyChoose";
import { ServicesSection } from "@/components/ServicesSection";
import { IFRSHighlight } from "@/components/IFRSHighlight";
import { ProcessSection } from "@/components/ProcessSection";
import { IndustriesSection } from "@/components/IndustriesSection";
import { PartnersSection } from "@/components/PartnersSection";
import { InsightsSection } from "@/components/InsightsSection";
import { RecruitmentCTA } from "@/components/RecruitmentCTA";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { Reveal } from "@/components/Reveal";
import type { NewsCategory, NewsPostCard } from "@/lib/news/types";
import type { SiteContentCard } from "@/lib/siteContent/getSiteContents";
import type { PartnerLogo } from "@/lib/partners/getPartnerLogos";
import type { HeroSlide } from "@/lib/slides/getSlides";

export function HomePage() {
  return <HomePageClient locale="vi" />;
}

/**
 * Trang chủ IFRS Auditing.
 * - Tin tức (Insights) đổ từ cơ sở dữ liệu (bảng post, danh mục tin tức).
 * - Dịch vụ đổ từ Quản trị nội dung (sitecontent, danh mục "dich-vu").
 * Dữ liệu được fetch ở server page và truyền xuống qua props.
 */
export function HomePageClient({
  locale = "vi",
  insightsPosts = [],
  insightsCategories = [],
  servicesItems = [],
  partners = [],
  slides = []
}: {
  locale?: "vi" | "en";
  insightsPosts?: NewsPostCard[];
  insightsCategories?: NewsCategory[];
  servicesItems?: SiteContentCard[];
  partners?: PartnerLogo[];
  slides?: HeroSlide[];
}) {
  return (
    <div className="min-h-screen bg-white pb-[calc(6.25rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      <Header />
      <main>
        <Hero slides={slides} />
        <Reveal>
          <TrustBar />
        </Reveal>
        <AboutSection />
        <WhyChoose />
        <ServicesSection locale={locale} services={servicesItems} />
        <IFRSHighlight />
        <ProcessSection />
        <IndustriesSection />
        <PartnersSection logos={partners} />
        <InsightsSection locale={locale} posts={insightsPosts} categories={insightsCategories} />
        <RecruitmentCTA />
        <ContactSection selectedServiceId={null} />
      </main>
      <Footer />
      <StickyMobileBar />
    </div>
  );
}
