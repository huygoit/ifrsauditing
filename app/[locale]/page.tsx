import { HomePageClient } from "@/app/(site)/HomePage";

export default function LocaleHomePage({ params }: { params: { locale: "vi" | "en" } }) {
  return <HomePageClient locale={params.locale} />;
}
