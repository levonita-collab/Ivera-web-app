// Server-side only — never import from client components.
// GEMINI_API_KEY must be set in environment (not NEXT_PUBLIC_GEMINI_API_KEY).

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export interface GeminiResult {
  text: string;
  fallback: boolean;
  error?: string;
}

function validateKey(key: string | undefined): { valid: boolean; reason?: string } {
  if (!key || key.trim() === "") {
    return { valid: false, reason: "GEMINI_API_KEY is not set" };
  }
  if (key.length < 20) {
    return { valid: false, reason: "GEMINI_API_KEY is too short to be valid" };
  }
  // Standard Google AI Studio keys start with "AIza"; warn but still attempt if different format
  if (!key.startsWith("AIza") && !key.startsWith("AQ")) {
    return { valid: false, reason: `GEMINI_API_KEY format unrecognised (prefix: ${key.slice(0, 4)}…)` };
  }
  return { valid: true };
}

// Log key status once at module load (server-side only, key value never logged)
const keyStatus = validateKey(GEMINI_KEY);
if (!keyStatus.valid) {
  console.warn(`[Ivera AI] ${keyStatus.reason}. AI features will use fallback responses.`);
} else {
  console.info(`[Ivera AI] GEMINI_API_KEY present (prefix: ${GEMINI_KEY!.slice(0, 4)}…, length: ${GEMINI_KEY!.length})`);
}

export function isGeminiConfigured(): boolean {
  return keyStatus.valid;
}

export async function callGemini(
  prompt: string,
  fallbackText: string,
  maxTokens = 250
): Promise<GeminiResult> {
  if (!keyStatus.valid || !GEMINI_KEY) {
    return { text: fallbackText, fallback: true, error: keyStatus.reason };
  }

  try {
    const res = await fetch(`${ENDPOINT}?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.75,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        ],
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.warn(`[Ivera AI] Gemini API error ${res.status}: ${errBody.slice(0, 120)}`);
      return { text: fallbackText, fallback: true, error: `HTTP ${res.status}` };
    }

    const data = await res.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      console.warn("[Ivera AI] Gemini returned empty response — using fallback");
      return { text: fallbackText, fallback: true, error: "empty_response" };
    }

    return { text, fallback: false };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[Ivera AI] Gemini call failed: ${msg}`);
    return { text: fallbackText, fallback: true, error: msg };
  }
}
