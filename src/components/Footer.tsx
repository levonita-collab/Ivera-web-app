import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-100 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-lg font-bold" style={{ color: "var(--primary)" }}>
            Ivera
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Authentic travel experiences in Georgia, crafted with care.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Explore</p>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>
              <Link href="/quests" className="hover:text-[var(--primary)] transition-colors">
                All Tours
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[var(--primary)] transition-colors">
                About Ivera
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Contact</p>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>
              <a
                href="https://wa.me/995555443787"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--primary)] transition-colors"
              >
                WhatsApp: +995 555 443 787
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        &copy; {year} Ivera. All rights reserved.
      </div>
    </footer>
  );
}
