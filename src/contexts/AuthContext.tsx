"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { getProfile, saveProfile } from "@/lib/questProgress";
import {
  linkExplorerProfileToAuthUser,
  getExplorerProfileByAuthUser,
} from "@/lib/supabase/explorerService";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  authModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  // Lazy-load AuthModal to avoid circular dep at module parse time
  const [AuthModal, setAuthModal] = useState<React.ComponentType<{ onClose: () => void }> | null>(null);

  const openAuthModal = useCallback(() => {
    // Dynamically import to keep initial bundle small
    import("@/components/auth/AuthModal").then((mod) => {
      setAuthModal(() => mod.default);
      setAuthModalOpen(true);
    });
  }, []);

  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Restore existing session from localStorage (synchronous under the hood)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      setLoading(false);

      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && authUser) {
        const localProfile = getProfile();
        if (localProfile?.supabaseId) {
          // Link the existing anonymous profile row to this auth user
          await linkExplorerProfileToAuthUser(localProfile.supabaseId, authUser.id);
        } else if (!localProfile) {
          // No local profile — try to restore from a previous auth-linked row
          const remote = await getExplorerProfileByAuthUser(authUser.id);
          if (remote) {
            saveProfile({
              name: remote.name,
              country: remote.country ?? undefined,
              whatsappNumber: remote.whatsapp_optional ?? undefined,
              language: remote.language ?? undefined,
              interests: remote.interest ? remote.interest.split(",") : undefined,
              joinedAt: remote.created_at,
              supabaseId: remote.id,
            });
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, authModalOpen, openAuthModal, closeAuthModal, signOut }}
    >
      {children}
      {authModalOpen && AuthModal && (
        <AuthModal onClose={closeAuthModal} />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
