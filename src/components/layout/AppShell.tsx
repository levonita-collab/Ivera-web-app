"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

// Routes that render their own full-bleed experience and opt out of the
// standard app chrome (sticky header, footer, bottom tab bar) and the
// max-w-2xl content column. Prefix-matched, so "/experience/x" also qualifies.
const FULL_BLEED_ROUTES = ["/experience"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullBleed = FULL_BLEED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isFullBleed) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
