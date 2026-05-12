import { HomePageClient } from "@/app/(site)/HomePage";
import { getHomeData } from "@/lib/home/getHomeData";

export const runtime = "nodejs";

export default async function LocaleHomePage({ params }: { params: { locale: "vi" | "en" } }) {
  const data = await getHomeData(params.locale);
  return (
    <HomePageClient
      locale={data.locale}
      productCategories={data.productCategories}
      products={data.products}
      certifications={data.certifications}
      partners={data.partners}
      faqs={data.faqs as any}
      videos={data.videos}
      reviews={data.reviews as any}
      latestNews={data.latestNews}
      benefitHighlights={data.benefitHighlights}
      useCasesPersonal={data.useCasesPersonal}
      useCasesCommercial={data.useCasesCommercial}
    />
  );
}

