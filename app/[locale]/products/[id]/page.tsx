import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { getProductDetail } from "@/lib/public/getProductDetail";

export const runtime = "nodejs";

type Locale = "vi" | "en";

export async function generateMetadata({
  params
}: {
  params: { locale: Locale; id: string };
}): Promise<Metadata> {
  const data = await getProductDetail(params.locale, params.id);
  if (!data) return { title: "Sản phẩm" };
  const p = data.product;
  const t = await getTranslations({ locale: params.locale, namespace: "productDetail" });
  const title = (data.seoTitle ?? "").trim() || p.name;
  const description = (data.seoDesc ?? "").trim() || p.shortDesc || t("orderSubtitle");
  return {
    title,
    description,
    openGraph: {
      title,
      description: description || undefined,
      images: p.image ? [p.image] : undefined
    }
  };
}

export default async function ProductDetailPage({ params }: { params: { locale: Locale; id: string } }) {
  const { locale, id } = params;
  const t = await getTranslations({ locale, namespace: "productDetail" });
  const data = await getProductDetail(locale, id);
  if (!data) return notFound();

  const { product, related, orderOptions, galleryItems, descriptionHtml } = data;
  const defaultSelection = orderOptions[0]?.value ?? product.name;

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-8">
      <Header />
      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <nav className="text-sm text-slate-600" aria-label="Breadcrumb">
          <Link href={`/${locale}`} className="hover:text-emerald-700 hover:underline">
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <a href={`/${locale}#san-pham`} className="hover:text-emerald-700 hover:underline">
            {t("breadcrumbProducts")}
          </a>
          <span className="mx-2 text-slate-300">/</span>
          <span className="font-medium text-slate-900">{product.name}</span>
        </nav>

        <div className="mt-8">
          <ProductDetailView
            locale={locale}
            product={product}
            galleryItems={galleryItems}
            descriptionHtml={descriptionHtml}
            related={related}
            orderOptions={orderOptions}
            defaultSelection={defaultSelection}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
