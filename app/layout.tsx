import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SEO } from "@/lib/seo.config";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter"
});

const METADATA_VI: Metadata = {
  metadataBase: new URL(SEO.siteUrl),
  title: { default: SEO.defaultTitle, template: SEO.titleTemplate },
  description: SEO.defaultDescription,
  keywords: [...SEO.keywords],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: SEO.siteUrl },
  openGraph: {
    title: "ENSO – Hạt khử mùi",
    description:
      "Sạch mùi, thoáng khí, đơn giản mỗi ngày. Bộ sưu tập sản phẩm + combo tối ưu cho từng không gian.",
    type: "website",
    locale: "vi_VN",
    siteName: SEO.siteName,
    url: SEO.siteUrl,
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "ENSO – Hạt khử mùi" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "ENSO – Hạt khử mùi",
    description: "Eco premium, tối giản, tối ưu chuyển đổi.",
    images: ["/og.svg"]
  }
};

const METADATA_EN: Metadata = {
  metadataBase: new URL(SEO.siteUrl),
  title: "ENSO – Odor absorber | Fresh air, simple every day",
  description:
    "ENSO – eco premium odor absorber for shoe cabinets, rooms, cars, bathrooms, wardrobes. Choose the right product, combos and order fast.",
  keywords: ["odor absorber", "deodorizer", "shoe cabinet", "car odor", "bathroom odor"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "ENSO – Odor absorber",
    description: "Fresh air, simple every day. Product range + combos for every space.",
    type: "website",
    locale: "en_US",
    siteName: SEO.siteName,
    url: SEO.siteUrl,
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "ENSO – Odor absorber" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "ENSO – Odor absorber",
    description: "Eco premium, minimal, optimized.",
    images: ["/og.svg"]
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return locale === "en" ? METADATA_EN : METADATA_VI;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} className={inter.variable}>
      <body className={inter.className}>
        <OrganizationSchema />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


