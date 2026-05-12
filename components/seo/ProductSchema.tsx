import { SEO } from "@/lib/seo.config";

const schema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Hạt khử mùi ENSO",
  brand: { "@type": "Brand", name: SEO.siteName },
  description: "Hạt khử mùi ENSO giúp khử mùi tủ giày, xe hơi và nhà vệ sinh. Sản phẩm an toàn, thân thiện môi trường.",
  image: SEO.logo,
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "VND",
    lowPrice: "69000",
    highPrice: "199000",
    offerCount: "5",
    availability: "https://schema.org/InStock"
  }
};

export function ProductSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
