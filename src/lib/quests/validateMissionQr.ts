import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type QrMissionRow = Database["public"]["Tables"]["qr_missions"]["Row"];

export interface QrValidationResult {
  valid: boolean;
  tourSlug?: string;
  missionId?: string;
  locationName?: string;
  points?: number;
  unlockText?: string | null;
  error?: string;
}

export async function validateMissionQr(
  qrCode: string
): Promise<QrValidationResult> {
  if (!supabase) {
    // Offline mode — demo format: "ivera::{tourSlug}::{missionId}"
    const parts = qrCode.split("::");
    if (parts.length === 3 && parts[0] === "ivera") {
      return { valid: true, tourSlug: parts[1], missionId: parts[2], points: 100 };
    }
    return { valid: false, error: "Invalid QR code format" };
  }

  try {
    const response = await supabase
      .from("qr_missions")
      .select("*")
      .eq("qr_code", qrCode)
      .single();

    if (response.error) {
      return { valid: false, error: "QR code not recognised" };
    }

    const row = response.data as QrMissionRow | null;
    if (!row) {
      return { valid: false, error: "QR code not recognised" };
    }

    if (!row.active) {
      return { valid: false, error: "This mission is no longer active" };
    }

    return {
      valid: true,
      tourSlug: row.tour_slug,
      missionId: row.mission_id,
      locationName: row.location_name,
      points: row.points,
      unlockText: row.unlock_text,
    };
  } catch {
    return { valid: false, error: "Network error — please try again" };
  }
}
