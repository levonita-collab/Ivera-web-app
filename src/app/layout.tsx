import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
  },
  verification: {
    google: "wb5sO_AdS5B41MmDv9QzdRnVYpDGeMme7AF6UYNCo2o",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
