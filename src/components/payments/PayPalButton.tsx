"use client";

import { useEffect, useRef, useState } from "react";

// Minimal shape of the PayPal JS SDK we rely on (window.paypal).
interface PayPalButtonsActions {
  order: { create: (data: unknown) => Promise<string>; capture: () => Promise<unknown> };
}

interface PayPalNamespace {
  Buttons: (config: {
    style?: Record<string, string>;
    createOrder: () => Promise<string>;
    onApprove: (data: { orderID: string }, actions: PayPalButtonsActions) => Promise<void>;
    onError?: (err: unknown) => void;
    onCancel?: () => void;
  }) => { render: (selector: HTMLElement) => void };
}

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

const SDK_SCRIPT_ID = "paypal-sdk-script";

interface Props {
  tourSlug: string;
  bookingCode: string;
  bookingId: string;
  peopleCount: number;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function PayPalButton({
  tourSlug,
  bookingCode,
  bookingId,
  peopleCount,
  onSuccess,
  onError,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    if (window.paypal) {
      const timer = setTimeout(() => setSdkReady(true), 0);
      return () => clearTimeout(timer);
    }

    const existing = document.getElementById(SDK_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => setSdkReady(true));
      return;
    }

    const script = document.createElement("script");
    script.id = SDK_SCRIPT_ID;
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture`;
    script.onload = () => setSdkReady(true);
    script.onerror = () => onError("Could not load PayPal.");
    document.body.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  useEffect(() => {
    if (!sdkReady || !window.paypal || !containerRef.current) return;

    containerRef.current.innerHTML = "";

    window.paypal
      .Buttons({
        style: { layout: "vertical", color: "gold", shape: "pill", label: "paypal" },
        createOrder: async () => {
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tourSlug, peopleCount, bookingCode, bookingId }),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error ?? "Could not create PayPal order.");
          }
          const data = (await res.json()) as { id: string };
          return data.id;
        },
        onApprove: async (data) => {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderID, bookingId }),
          });
          if (!res.ok) {
            const errData = await res.json().catch(() => null);
            throw new Error(errData?.error ?? "Could not capture PayPal payment.");
          }
          onSuccess();
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : "PayPal payment failed.";
          onError(msg);
        },
      })
      .render(containerRef.current);
  }, [sdkReady, tourSlug, peopleCount, bookingCode, bookingId, onSuccess, onError]);

  if (!clientId) return null;

  return <div ref={containerRef} />;
}
