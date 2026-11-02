import JsonLd from "@/components/seo/JsonLd";
import { FAQ_EN } from "@/data/faq";
import { faqJsonLd } from "@/lib/structuredData";

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQ_EN)} />
      {children}
    </>
  );
}
