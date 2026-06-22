import { HomePageClient } from "@/app/(site)/HomePage";
import { getCategories } from "@/lib/news/getCategories";
import { getPosts } from "@/lib/news/getPosts";
import { getServiceHighlights } from "@/lib/siteContent/getServiceHighlights";
import { getPartnerLogos } from "@/lib/partners/getPartnerLogos";

export const runtime = "nodejs";

export default async function LocaleHomePage({ params }: { params: { locale: "vi" | "en" } }) {
  const { locale } = params;
  // Đổ dữ liệu từ cơ sở dữ liệu: tin tức (post) + dịch vụ (sitecontent loại SERVICE) + đối tác/khách hàng
  const [postsRes, categories, services, partners] = await Promise.all([
    getPosts(locale, { limit: 4 }),
    getCategories(locale),
    getServiceHighlights(locale, 6),
    getPartnerLogos(locale)
  ]);

  return (
    <HomePageClient
      locale={locale}
      insightsPosts={postsRes.posts}
      insightsCategories={categories}
      servicesItems={services}
      partners={partners}
    />
  );
}
