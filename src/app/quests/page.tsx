import type { Metadata } from "next";
import QuestCard from "@/components/QuestCard";
import { quests, buildWhatsAppLink } from "@/lib/quests";

export const metadata: Metadata = {
  title: "All Tours",
  description:
    "Browse every Ivera tour — from one-day city explorations to multi-day mountain treks across Georgia.",
};

export default function QuestsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">All Tours</h1>
        <p className="mt-2 text-gray-500">
          {quests.length} experiences across Georgia — pick yours.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest) => (
          <QuestCard key={quest.slug} quest={quest} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        className="mt-14 rounded-2xl p-8 text-center"
        style={{ backgroundColor: "var(--accent)" }}
      >
        <h2 className="text-xl font-bold text-gray-900">
          Need a custom itinerary?
        </h2>
        <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
          Tell us your dates, interests, and group size — we&apos;ll put together
          a personalised tour just for you.
        </p>
        <a
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block px-7 py-3 rounded-full text-sm font-semibold text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Message Us on WhatsApp
        </a>
      </div>
    </div>
  );
}
