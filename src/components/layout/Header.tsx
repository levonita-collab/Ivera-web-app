"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import IveraIcon from "./IveraIcon";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-brand-black/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Ivera home">
          <IveraIcon size={28} darkBg />
          <div className="leading-none">
            <p className="text-white font-serif text-lg font-semibold tracking-widest">
              İVERA
            </p>
            <p
              className="text-[9px] tracking-[0.22em] font-medium"
              style={{ color: "#C4923A" }}
            >
              EXPLORE GEORGIA
            </p>
          </div>
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
