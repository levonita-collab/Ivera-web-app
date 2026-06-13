"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

export type Language = "en" | "ru";

const STORAGE_KEY = "ivera_lang";
const listeners = new Set<() => void>();

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getSnapshot(): Language {
  if (!isBrowser()) return "en";
  return localStorage.getItem(STORAGE_KEY) === "ru" ? "ru" : "en";
}

function getServerSnapshot(): Language {
  return "en";
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLanguage = useCallback((lang: Language) => {
    if (!isBrowser()) return;
    localStorage.setItem(STORAGE_KEY, lang);
    listeners.forEach((listener) => listener());
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(getSnapshot() === "ru" ? "en" : "ru");
  }, [setLanguage]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
