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
    title: "IFRS Auditing | Kiểm toán, Thuế, Kế toán & Tư vấn doanh nghiệp",
    description: SEO.defaultDescription,
    type: "website",
    locale: "vi_VN",
    siteName: SEO.siteName,
    url: SEO.siteUrl,
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "IFRS Auditing" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "IFRS Auditing",
    description: SEO.defaultDescription,
    images: ["/og.svg"]
  }
};

const METADATA_EN: Metadata = {
  metadataBase: new URL(SEO.siteUrl),
  title: {
    default: "IFRS Auditing | Audit, Tax, Accounting & Corporate Advisory",
    template: "%s | IFRS Auditing"
  },
  description:
    "IFRS Auditing provides financial statement audits, tax consulting, accounting, valuation, IFRS/VAS and corporate advisory services in Vietnam.",
  keywords: [
    "audit",
    "IFRS",
    "VAS",
    "tax consulting",
    "accounting",
    "valuation",
    "Vietnam",
    "advisory"
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "IFRS Auditing | Audit, Tax, Accounting & Advisory",
    description:
      "Professional audit, tax, accounting, valuation and IFRS/VAS advisory for Vietnamese and FDI enterprises.",
    type: "website",
    locale: "en_US",
    siteName: SEO.siteName,
    url: SEO.siteUrl,
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "IFRS Auditing" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "IFRS Auditing",
    description: "Audit, tax, accounting & advisory in Vietnam.",
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


