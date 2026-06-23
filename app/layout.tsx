import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SEO, BRAND_NAME, CONTACT } from "@/content/site";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO.siteUrl),
  title: {
    template: SEO.titleTemplate,
    default: SEO.defaultTitle,
  },
  description: SEO.defaultDescription,
  openGraph: {
    type: "website",
    siteName: BRAND_NAME,
    images: [{ url: SEO.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: SEO.twitterHandle,
    images: [SEO.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND_NAME,
  description: SEO.defaultDescription,
  url: SEO.siteUrl,
  logo: `${SEO.siteUrl}/images/logo.svg`,
  contactPoint: {
    "@type": "ContactPoint",
    email: CONTACT.email,
    telephone: CONTACT.phone,
    contactType: "business",
  },
  areaServed: "GB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
