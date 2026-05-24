import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { quests, getQuestBySlug, buildWhatsAppLink } from "@/lib/quests";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return quests.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const quest = getQuestBySlug(slug);
  if (!quest) return {};
  return {
    title: quest.title,
    description: quest.tagline,
  };
}

export default async function QuestDetailPage({ params }: Props) {
  const { slug } = await params;
  const quest = getQuestBySlug(slug);
  if (!quest) notFound();

  return (
    <>
      {/* Header band */}
      <div
        className="h-56 md:h-72 flex items-end px-4 pb-6"
        style={{ backgroundColor: quest.imagePlaceholderColor }}
        role="img"
        aria-label={quest.imageAlt}
      >
        <div className="max-w-6xl mx-auto w-full">
          <span className="text-xs font-medium text-white/80 bg-black/25 px-2.5 py-1 rounded-full">
            {quest.region}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/quests" className="hover:text-[var(--primary)]">
            Tours
          </Link>
          {" / "}
          <span className="text-gray-600">{quest.title}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 leading-snug">
          {quest.title}
        </h1>
        <p className="mt-2 text-lg text-gray-500">{quest.tagline}</p>

        {/* Meta row */}
        <div className="mt-5 flex flex-wrap gap-5 text-sm text-gray-600">
          <div>
            <span className="font-medium">Duration</span>
            <p className="text-gray-500">{quest.duration}</p>
          </div>
          <div>
            <span className="font-medium">Group size</span>
            <p className="text-gray-500">{quest.groupSize}</p>
          </div>
          <div>
            <span className="font-medium">Price</span>
            <p style={{ color: "var(--primary)" }} className="font-semibold">
              {quest.price}
            </p>
          </div>
        </div>

        <p className="mt-8 text-gray-700 leading-relaxed">{quest.description}</p>

        {/* Highlights */}
        <h2 className="mt-8 text-lg font-bold text-gray-900">
          What&apos;s included
        </h2>
        <ul className="mt-4 space-y-2">
          {quest.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
              <span
                className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: "var(--primary)" }}
                aria-hidden="true"
              >
                ✓
              </span>
              {h}
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href={buildWhatsAppLink(quest.title)}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-block mt-10 px-8 py-4 rounded-full font-semibold text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Book this tour on WhatsApp
        </a>
      </div>

      {/* Mobile sticky CTA */}
      <div className="md:hidden sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg z-30">
        <a
          href={buildWhatsAppLink(quest.title)}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3.5 rounded-full font-semibold text-sm text-white text-center transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Book via WhatsApp
        </a>
      </div>
    </>
  );
}
