import { MetadataRoute } from "next";
import { SEO } from "@/lib/seo.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }
    ],
    sitemap: `${SEO.siteUrl}/sitemap.xml`
  };
}
