"use client";

import { useCallback, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { AboutSection } from "@/components/AboutSection";
import { WhyChoose } from "@/components/WhyChoose";
import { ServicesSection } from "@/components/ServicesSection";
import { ServiceDrawer } from "@/components/ServiceDrawer";
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
import type { ServiceId } from "@/lib/services";

/** Cuộn mượt tới phần tử theo mã định danh trong trang. */
function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HomePage() {
  return <HomePageClient locale="vi" />;
}

/**
 * Trang chủ IFRS Auditing: bố cục tĩnh, không gọi cơ sở dữ liệu, phù hợp xuất bản tĩnh.
 * Trạng thái ngăn kéo dịch vụ và dịch vụ gợi ý cho biểu mẫu liên hệ được nâng lên component này để đồng bộ hành vi.
 */
export function HomePageClient({ locale: _locale }: { locale?: "vi" | "en" }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerServiceId, setDrawerServiceId] = useState<ServiceId | null>(null);
  const [contactPrefillService, setContactPrefillService] = useState<ServiceId | null>(null);

  const openDrawer = useCallback((id: ServiceId) => {
    setDrawerServiceId(id);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const onDrawerConsult = useCallback(() => {
    if (drawerServiceId) setContactPrefillService(drawerServiceId);
    window.setTimeout(() => scrollToId("lien-he"), 80);
  }, [drawerServiceId]);

  const clearContactPrefill = useCallback(() => {
    setContactPrefillService(null);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-[calc(6.25rem+env(safe-area-inset-bottom,0px))] md:pb-28">
      <Header />
      <main>
        <Hero />
        <Reveal>
          <TrustBar />
        </Reveal>
        <AboutSection />
        <WhyChoose />
        <ServicesSection onOpenDetail={openDrawer} />
        <IFRSHighlight />
        <ProcessSection />
        <IndustriesSection />
        <PartnersSection />
        <InsightsSection />
        <RecruitmentCTA />
        <ContactSection selectedServiceId={contactPrefillService} onConsumedService={clearContactPrefill} />
      </main>
      <Footer />
      <StickyMobileBar />
      <ServiceDrawer open={drawerOpen} serviceId={drawerServiceId} onClose={closeDrawer} onConsult={onDrawerConsult} />
    </div>
  );
}
