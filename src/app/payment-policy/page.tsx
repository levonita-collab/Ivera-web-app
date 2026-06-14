"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, RefreshCw, MessageCircle, CreditCard, BadgeCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n/dictionary";
import { buildGeneralLink } from "@/lib/whatsapp";

export default function PaymentPolicyPage() {
  const { t, language } = useTranslation();

  return (
    <div style={{ backgroundColor: "#0A0805", minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "#5A4A38" }}
          >
            <ArrowLeft size={14} /> {t("paymentPolicy.back")}
          </Link>
          <h1 className="font-serif text-2xl text-white font-bold">
            {t("paymentPolicy.title")}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#7A6A52" }}>
            {t("paymentPolicy.intro")}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <PolicySection
            icon={<CreditCard size={16} />}
            title={t("paymentPolicy.paypalTitle")}
            body={t("paymentPolicy.paypalBody")}
          />
          <PolicySection
            icon={<BadgeCheck size={16} />}
            title={t("paymentPolicy.confirmationTitle")}
            body={t("paymentPolicy.confirmationBody")}
          />
          <PolicySection
            icon={<RefreshCw size={16} />}
            title={t("paymentPolicy.refundTitle")}
            body={t("paymentPolicy.refundBody")}
          />
          <PolicySection
            icon={<ShieldCheck size={16} />}
            title={t("paymentPolicy.securityTitle")}
            body={t("paymentPolicy.securityBody")}
          />
        </div>

        {/* Contact */}
        <div
          className="rounded-2xl border p-4 space-y-3 text-center"
          style={{ backgroundColor: "rgba(37,211,102,0.05)", borderColor: "rgba(37,211,102,0.2)" }}
        >
          <p className="text-sm text-white font-medium">{t("paymentPolicy.contactTitle")}</p>
          <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
            {t("paymentPolicy.contactBody")}
          </p>
          <a
            href={buildGeneralLink(language)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={15} />
            {t("paymentPolicy.contactCta")}
          </a>
        </div>
      </div>
    </div>
  );
}

function PolicySection({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div
      className="rounded-2xl border p-4 space-y-1.5"
      style={{ backgroundColor: "#1A1408", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-2" style={{ color: "#C4923A" }}>
        {icon}
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
        {body}
      </p>
    </div>
  );
}
