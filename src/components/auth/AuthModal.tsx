"use client";

import { useState } from "react";
import { X, Compass, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { saveProfile, getProfile } from "@/lib/questProgress";
import { upsertExplorerProfileForAuthUser } from "@/lib/supabase/explorerService";
import { useTranslation } from "@/lib/i18n/dictionary";

interface Props {
  onClose: () => void;
}

type View = "signup" | "signin" | "check-email";

export default function AuthModal({ onClose }: Props) {
  const { t } = useTranslation();
  const [view, setView] = useState<View>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(() => (typeof window !== "undefined" ? (getProfile()?.name ?? "") : ""));
  const [country, setCountry] = useState(() => (typeof window !== "undefined" ? (getProfile()?.country ?? "") : ""));
  const [whatsapp, setWhatsapp] = useState(() => (typeof window !== "undefined" ? (getProfile()?.whatsappNumber ?? "") : ""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignUp() {
    if (!supabase || !name.trim() || !email.trim() || password.length < 6) return;
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name: name.trim() } },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const profileId = await upsertExplorerProfileForAuthUser(data.user.id, {
        name: name.trim(),
        country: country.trim() || undefined,
        whatsappNumber: whatsapp.trim() || undefined,
      });
      const existing = getProfile();
      saveProfile({
        name: name.trim(),
        country: country.trim() || undefined,
        whatsappNumber: whatsapp.trim() || undefined,
        language: existing?.language,
        interests: existing?.interests,
        joinedAt: existing?.joinedAt ?? new Date().toISOString(),
        supabaseId: profileId ?? existing?.supabaseId,
      });
    }

    setLoading(false);
    // No session means email confirmation required
    if (!data.session) {
      setView("check-email");
    } else {
      onClose();
    }
  }

  async function handleSignIn() {
    if (!supabase || !email.trim() || !password) return;
    setLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onClose();
  }

  async function handleGoogle() {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.href : undefined,
      },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
    }
    // On success the browser navigates to Google — no further action needed
  }

  const inputStyle = {
    backgroundColor: "#FFFDF8",
    border: "1.5px solid #E8DDD0",
    color: "#1F1A17",
  } as const;

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "6px",
    color: "#7B6F63",
  };

  // ── Check-email view ───────────────────────────────────────────────────
  if (view === "check-email") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end"
        style={{ backgroundColor: "rgba(15,12,7,0.75)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          className="w-full max-w-2xl mx-auto rounded-t-3xl px-6 pt-6 pb-10 space-y-5"
          style={{ backgroundColor: "#F7F0E4" }}
        >
          <div className="w-10 h-1 rounded-full mx-auto" style={{ backgroundColor: "#E8DDD0" }} />
          <div className="text-center space-y-3 py-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: "rgba(200,155,60,0.15)" }}
            >
              <span className="text-2xl">📬</span>
            </div>
            <h2 className="font-serif text-xl font-bold" style={{ color: "#1F1A17" }}>
              {t("auth.checkEmailTitle")}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#7B6F63" }}>
              {t("auth.checkEmailDesc")}
            </p>
            <button
              onClick={onClose}
              className="mt-4 w-full py-3.5 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: "#C89B3C" }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSignUp = view === "signup";
  const title = isSignUp ? t("auth.createPassTitle") : t("auth.signInTitle");
  const subtitle = isSignUp ? t("auth.createPassSubtitle") : t("auth.signInSubtitle");
  const submitLabel = isSignUp ? t("auth.createButton") : t("auth.signInButton");
  const canSubmit = email.trim().length > 0 && password.length >= 6 && (!isSignUp || name.trim().length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ backgroundColor: "rgba(15,12,7,0.75)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl mx-auto rounded-t-3xl px-6 pt-6 pb-10 space-y-4 max-h-[92vh] overflow-y-auto"
        style={{ backgroundColor: "#F7F0E4" }}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto" style={{ backgroundColor: "#E8DDD0" }} />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(200,155,60,0.15)" }}
            >
              <Compass size={18} style={{ color: "#C89B3C" }} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold" style={{ color: "#1F1A17" }}>
                {title}
              </h2>
              <p className="text-[12px] mt-0.5" style={{ color: "#7B6F63" }}>
                {subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
            style={{ backgroundColor: "rgba(31,26,23,0.08)" }}
          >
            <X size={15} style={{ color: "#1F1A17" }} />
          </button>
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity"
          style={{
            backgroundColor: "#FFFDF8",
            border: "1.5px solid #E8DDD0",
            color: "#1F1A17",
            opacity: loading ? 0.6 : 1,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t("auth.googleButton")}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ backgroundColor: "#E8DDD0" }} />
          <span className="text-[11px]" style={{ color: "#B0A08A" }}>or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "#E8DDD0" }} />
        </div>

        {/* Name (sign-up only) */}
        {isSignUp && (
          <div>
            <label style={labelStyle}>
              {t("auth.nameLabel")} <span style={{ color: "#C89B3C" }}>*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("explorerPass.namePlaceholder")}
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
              style={inputStyle}
              maxLength={40}
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label style={labelStyle}>
            {t("auth.emailLabel")} <span style={{ color: "#C89B3C" }}>*</span>
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (isSignUp ? handleSignUp() : handleSignIn())}
            placeholder={t("auth.emailPlaceholder")}
            autoFocus={!isSignUp}
            type="email"
            inputMode="email"
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div>
          <label style={labelStyle}>
            {t("auth.passwordLabel")} <span style={{ color: "#C89B3C" }}>*</span>
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (isSignUp ? handleSignUp() : handleSignIn())}
            placeholder={t("auth.passwordPlaceholder")}
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>

        {/* Country + WhatsApp (sign-up only, optional) */}
        {isSignUp && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>{t("auth.countryLabel")}</label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={t("explorerPass.countryPlaceholder")}
                className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none"
                style={inputStyle}
                maxLength={40}
              />
            </div>
            <div>
              <label style={labelStyle}>{t("auth.whatsappLabel")}</label>
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+995 555..."
                type="tel"
                inputMode="tel"
                className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none"
                style={inputStyle}
                maxLength={24}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-[12px] text-center px-2" style={{ color: "#B41E2E" }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={isSignUp ? handleSignUp : handleSignIn}
          disabled={!canSubmit || loading}
          className="w-full py-4 rounded-full font-semibold text-base text-white flex items-center justify-center gap-2 transition-opacity"
          style={{ backgroundColor: "#C89B3C", opacity: canSubmit && !loading ? 1 : 0.45 }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {submitLabel}
        </button>

        {/* Toggle */}
        <button
          onClick={() => { setView(isSignUp ? "signin" : "signup"); setError(null); }}
          className="w-full py-2 text-sm"
          style={{ color: "#7B6F63" }}
        >
          {isSignUp ? t("auth.switchToSignIn") : t("auth.switchToSignUp")}
        </button>
      </div>
    </div>
  );
}
