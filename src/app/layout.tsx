import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/structuredData";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Lets og:image and other URL fields use site-relative paths.
  metadataBase: new URL("https://www.ivera.info"),
  title: {
    default: "Ivera — Georgia Travel Quest",
    template: "%s | Ivera",
  },
  description:
    "Discover Georgia through quests and rewards. Guided tours, XP missions, and WhatsApp booking with Ivera.",
  openGraph: {
    siteName: "Ivera",
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/hero-gergeti.jpg", alt: "Gergeti Trinity Church below Mount Kazbek" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/hero-gergeti.jpg"] },
  verification: {
    google: "wb5sO_AdS5B41MmDv9QzdRnVYpDGeMme7AF6UYNCo2o",
    other: { "msvalidate.01": "1FB7D8EF70251D4AC1F0962A159D4A3E" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <JsonLd data={organizationJsonLd()} />
        <LanguageProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
          <GoogleAnalytics />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
