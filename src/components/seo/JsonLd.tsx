import { serializeJsonLd } from "@/lib/structuredData";

/** Renders schema.org structured data for search engines and AI assistants. */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
