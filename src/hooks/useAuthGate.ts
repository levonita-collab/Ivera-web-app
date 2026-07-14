"use client";

import { useAuth } from "@/contexts/AuthContext";

export function useAuthGate() {
  const { user, openAuthModal } = useAuth();

  function gateAction(fn: () => void): void {
    if (user) {
      fn();
    } else {
      openAuthModal();
    }
  }

  return { gateAction, isAuthed: !!user };
}
