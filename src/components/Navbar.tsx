"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/quests", label: "Tours" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight"
          style={{ color: "var(--primary)" }}
        >
          Ivera
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-[var(--primary)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/995555443787?text=Hi%20Ivera!%20I'd%20like%20to%20learn%20more%20about%20your%20tours."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Book via WhatsApp
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-sm font-medium text-gray-700"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/995555443787?text=Hi%20Ivera!%20I'd%20like%20to%20learn%20more%20about%20your%20tours."
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-4 rounded-full text-sm font-semibold text-white text-center"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Book via WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
