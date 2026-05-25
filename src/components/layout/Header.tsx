"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-brand-black/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Ivera home">
          <Image
            src="/images/logo-dark.png"
            alt="Ivera"
            width={120}
            height={40}
            className="object-contain h-9 w-auto"
            priority
          />
        </Link>

        <button
          className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 text-brand-muted hover:text-white transition-colors"
          aria-label="Notifications"
        >
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
