import { MetadataRoute } from "next";
import { SEO } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/console/", "/dashboard/"],
      },
    ],
    sitemap: `${SEO.siteUrl}/sitemap.xml`,
  };
}
