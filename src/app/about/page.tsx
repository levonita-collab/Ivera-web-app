import type { Metadata } from "next";
import { buildWhatsAppLink } from "@/lib/quests";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn who is behind Ivera — small-group Georgian travel experiences guided by locals.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold text-gray-900">About Ivera</h1>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <p>
          Ivera was born from a simple belief: the best way to experience
          Georgia is with someone who grew up here and genuinely loves it.
        </p>
        <p>
          We design small-group tours and private experiences that go beyond
          the highlights — into the hidden valleys, family guesthouses, and
          living traditions that most visitors never see.
        </p>
        <p>
          Every Ivera tour is led by a local guide who knows the land, speaks
          the language, and cares deeply about showing you the real Georgia.
        </p>
      </div>

      {/* Values */}
      <div
        className="mt-12 rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-6"
        style={{ backgroundColor: "var(--accent)" }}
      >
        {[
          { title: "Small groups", body: "Maximum 12 people so you get real attention and authentic experiences." },
          { title: "Local guides", body: "Every guide is from Georgia and chosen for their knowledge and passion." },
          { title: "Direct booking", body: "No middlemen. Book via WhatsApp and talk to a real person." },
        ].map((v) => (
          <div key={v.title}>
            <h3 className="font-semibold text-gray-900">{v.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{v.body}</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="mt-14">
        <h2 className="text-xl font-bold text-gray-900">Get in touch</h2>
        <p className="mt-2 text-gray-600 text-sm">
          The fastest way to reach us is WhatsApp. We respond quickly and speak
          English, Georgian, and Russian.
        </p>
        <a
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block px-7 py-3 rounded-full font-semibold text-sm text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--primary)" }}
        >
          WhatsApp: +995 555 443 787
        </a>
      </div>
    </div>
  );
}
