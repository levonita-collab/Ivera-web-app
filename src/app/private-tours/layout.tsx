import type { Metadata } from "next";

// The page itself is a client component, so its metadata lives here.
const description =
  "Build your own private trip across Georgia: a private guide, a driver or both, any regions and days, with an instant price estimate and booking on WhatsApp.";

export const metadata: Metadata = {
  title: "Private Tours in Georgia — Guide & Driver",
  description,
  openGraph: {
    title: "Private Tours in Georgia — Guide & Driver | Ivera",
    description,
    siteName: "Ivera",
    type: "website",
    images: [{ url: "/images/private-tours/swords-panorama.jpg", alt: "Private tours in Georgia with Ivera" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/private-tours/swords-panorama.jpg"] },
};

export default function PrivateToursLayout({ children }: { children: React.ReactNode }) {
  return children;
}
