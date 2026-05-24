import Link from "next/link";
import { Quest, buildWhatsAppLink } from "@/lib/quests";

interface Props {
  quest: Quest;
}

export default function QuestCard({ quest }: Props) {
  return (
    <article className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Placeholder image block — replace with next/image when real assets arrive */}
      <div
        className="h-44 w-full flex items-end p-4"
        style={{ backgroundColor: quest.imagePlaceholderColor }}
        role="img"
        aria-label={quest.imageAlt}
      >
        <span className="text-xs font-medium text-white/80 bg-black/20 px-2 py-0.5 rounded-full">
          {quest.region}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-base leading-snug">
            {quest.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{quest.tagline}</p>
        </div>

        <div className="flex gap-4 text-xs text-gray-400">
          <span>{quest.duration}</span>
          <span>{quest.groupSize}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
            {quest.price}
          </span>
          <div className="flex gap-2">
            <Link
              href={`/quests/${quest.slug}`}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              Details
            </Link>
            <a
              href={buildWhatsAppLink(quest.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-full text-white font-medium transition-colors"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Book
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
