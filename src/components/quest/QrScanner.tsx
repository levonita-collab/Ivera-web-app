"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { X, Keyboard, Camera as CameraIcon, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/dictionary";

interface Props {
  onDetect: (code: string) => void;
  onClose: () => void;
  validating?: boolean;
  errorMessage?: string | null;
}

const DUPLICATE_SUPPRESS_MS = 2500;

export default function QrScanner({ onDetect, onClose, validating, errorMessage }: Props) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastDetectRef = useRef<{ code: string; time: number } | null>(null);
  const onDetectRef = useRef(onDetect);

  useEffect(() => {
    onDetectRef.current = onDetect;
  }, [onDetect]);

  const [cameraError, setCameraError] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualValue, setManualValue] = useState("");

  useEffect(() => {
    let cancelled = false;

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const result = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      if (result?.data) {
        const last = lastDetectRef.current;
        const now = Date.now();
        if (!last || last.code !== result.data || now - last.time > DUPLICATE_SUPPRESS_MS) {
          lastDetectRef.current = { code: result.data, time: now };
          onDetectRef.current(result.data);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        rafRef.current = requestAnimationFrame(tick);
      } catch {
        if (!cancelled) {
          setCameraError(true);
          setManualMode(true);
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    };
  }, []);

  function submitManual() {
    const trimmed = manualValue.trim();
    if (!trimmed || validating) return;
    onDetect(trimmed);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "rgba(8,6,3,0.97)" }}>
      <div className="flex items-center justify-between p-4 flex-shrink-0">
        <h2 className="text-white font-semibold text-sm">{t("quest.scanModalTitle")}</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          <X size={16} />
        </button>
      </div>

      {!manualMode ? (
        <>
          <div className="flex-1 relative flex items-center justify-center px-6 min-h-0">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full max-w-sm rounded-2xl object-cover"
              style={{ maxHeight: "60vh" }}
            />
            <div
              className="absolute w-56 h-56 rounded-2xl pointer-events-none"
              style={{ border: "2px solid rgba(196,146,58,0.7)" }}
            />
          </div>
          <p className="text-center text-xs text-brand-muted px-6 pb-2 flex-shrink-0">
            {t("quest.scanInstructions")}
          </p>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-3 min-h-0">
          {cameraError && (
            <p className="text-xs text-center" style={{ color: "#E0B85A" }}>
              {t("quest.scanCameraDenied")}
            </p>
          )}
          <input
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
            placeholder={t("quest.scanManualPlaceholder")}
            autoCapitalize="characters"
            className="w-full max-w-sm px-4 py-3 rounded-xl bg-white/10 text-white text-sm border border-white/15 focus:outline-none"
            style={{ borderColor: "rgba(196,146,58,0.4)" }}
          />
          <button
            onClick={submitManual}
            disabled={validating}
            className="w-full max-w-sm py-3 rounded-xl font-semibold text-brand-black flex items-center justify-center gap-2"
            style={{ backgroundColor: "#C4923A", opacity: validating ? 0.7 : 1 }}
          >
            {validating ? <Loader2 size={14} className="animate-spin" /> : null}
            {t("quest.scanManualSubmit")}
          </button>
        </div>
      )}

      {errorMessage && (
        <p className="text-center text-xs px-6 pb-2 flex-shrink-0" style={{ color: "#E0907A" }}>
          {errorMessage}
        </p>
      )}

      <div className="p-4 flex-shrink-0">
        {!manualMode ? (
          <button
            onClick={() => setManualMode(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold text-white/70 border border-white/10"
          >
            <Keyboard size={14} /> {t("quest.scanManualLabel")}
          </button>
        ) : (
          !cameraError && (
            <button
              onClick={() => setManualMode(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold text-white/70 border border-white/10"
            >
              <CameraIcon size={14} /> {t("quest.scanUseCameraInstead")}
            </button>
          )
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
