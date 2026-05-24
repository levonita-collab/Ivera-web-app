import type { Metadata } from "next";
import Link from "next/link";
import QuestCard from "@/components/QuestCard";
import { quests, buildWhatsAppLink } from "@/lib/quests";

export const metadata: Metadata = {
  title: "Ivera — Georgian Travel Experiences",
  description:
    "Discover Georgia through curated tours — mountains, wine, history, and culture. Book directly via WhatsApp.",
};

export default function HomePage() {
  const featured = quests.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section
        className="flex flex-col items-center justify-center text-center px-4 py-24 md:py-36"
        style={{ backgroundColor: "var(--primary)" }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl">
          Discover Georgia,<br />Your Way.
        </h1>
        <p className="mt-5 text-lg text-white/80 max-w-xl">
          Curated tours through mountains, vineyards, ancient monasteries, and
          living culture — guided by people who love this land.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/quests"
            className="px-7 py-3.5 rounded-full font-semibold text-sm text-[var(--primary)] bg-white hover:bg-[var(--accent)] transition-colors"
          >
            Browse All Tours
          </Link>
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-full font-semibold text-sm text-white border border-white/50 hover:bg-white/10 transition-colors"
          >
            Ask via WhatsApp
          </a>
        </div>
      </section>

      {/* Trust strip */}
      <section
        className="py-5 border-y"
        style={{ backgroundColor: "var(--accent)", borderColor: "var(--accent-dark)" }}
      >
        <ul className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium text-gray-700">
          {["Small groups only", "Local guides", "Instant WhatsApp booking", "Georgia-based"].map(
            (item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span style={{ color: "var(--primary)" }}>✓</span> {item}
              </li>
            )
          )}
        </ul>
      </section>

      {/* Featured tours */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Tours</h2>
          <Link
            href="/quests"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--primary)" }}
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((quest) => (
            <QuestCard key={quest.slug} quest={quest} />
          ))}
        </div>
      </section>

      {/* WhatsApp CTA banner */}
      <section
        className="py-16 px-4 text-center"
        style={{ backgroundColor: "var(--accent)" }}
      >
        <h2 className="text-2xl font-bold text-gray-900">
          Not sure which tour to pick?
        </h2>
        <p className="mt-3 text-gray-600 max-w-md mx-auto">
          Message us on WhatsApp and we&apos;ll build a custom itinerary around
          your dates and interests — at no extra cost.
        </p>
        <a
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block px-8 py-3.5 rounded-full font-semibold text-sm text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Chat with Us on WhatsApp
        </a>
      </section>
    </>
  );
}
