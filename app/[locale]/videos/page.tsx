import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VideosGallery } from "@/components/videos/VideosGallery";
import { getVideos } from "@/lib/public/getVideos";

export const runtime = "nodejs";

export async function generateMetadata({ params }: { params: { locale: "vi" | "en" } }): Promise<Metadata> {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: "videos" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/videos`,
      languages: {
        vi: "/vi/videos",
        en: "/en/videos"
      }
    }
  };
}

export default async function VideosPage({ params }: { params: { locale: "vi" | "en" } }) {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: "videos" });
  const videos = await getVideos(locale);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{t("title")}</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">{t("subtitle")}</p>
        </header>

        {videos.length ? (
          <VideosGallery items={videos} />
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">{t("empty")}</div>
        )}
      </main>
      <Footer />
    </div>
  );
}

