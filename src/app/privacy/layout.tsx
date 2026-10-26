import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How IVERA collects, uses and protects your personal data, and how to exercise your rights.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
