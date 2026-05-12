import { SEO } from "@/lib/seo.config";

const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SEO.organization.name,
  url: SEO.organization.url,
  logo: SEO.organization.logo,
  address: {
    "@type": "PostalAddress",
    streetAddress: SEO.organization.address.streetAddress,
    addressLocality: SEO.organization.address.addressLocality,
    addressRegion: SEO.organization.address.addressRegion,
    addressCountry: SEO.organization.address.addressCountry
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: SEO.organization.contact,
    contactType: "customer service",
    areaServed: "VN"
  }
};

export function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
