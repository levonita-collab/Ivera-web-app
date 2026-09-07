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

// ─── Multi-turn chat (guide conversation) ───────────────────────────────────

export interface ChatTurn {
  role: "user" | "model";
  content: string;
}

export async function callGeminiChat(
  history: ChatTurn[],
  systemPrompt: string,
  fallbackText: string,
  maxTokens = 200
): Promise<GeminiResult> {
  if (!keyStatus.valid || !GEMINI_KEY) {
    return { text: fallbackText, fallback: true, error: keyStatus.reason };
  }

  try {
    const res = await fetch(`${ENDPOINT}?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: history.map((turn) => ({
          role: turn.role,
          parts: [{ text: turn.content }],
        })),
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.8,
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
      console.warn(`[Ivera AI] Gemini chat error ${res.status}: ${errBody.slice(0, 120)}`);
      return { text: fallbackText, fallback: true, error: `HTTP ${res.status}` };
    }

    const data = await res.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      console.warn("[Ivera AI] Gemini chat returned empty response — using fallback");
      return { text: fallbackText, fallback: true, error: "empty_response" };
    }

    return { text, fallback: false };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[Ivera AI] Gemini chat call failed: ${msg}`);
    return { text: fallbackText, fallback: true, error: msg };
  }
}

// ─── Structured JSON output (e.g. answer grading) ───────────────────────────

export interface GeminiJsonResult<T> {
  data: T;
  fallback: boolean;
  error?: string;
}

export async function callGeminiJson<T>(
  prompt: string,
  fallbackValue: T,
  maxTokens = 150
): Promise<GeminiJsonResult<T>> {
  if (!keyStatus.valid || !GEMINI_KEY) {
    return { data: fallbackValue, fallback: true, error: keyStatus.reason };
  }

  try {
    const res = await fetch(`${ENDPOINT}?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.4,
          responseMimeType: "application/json",
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
      console.warn(`[Ivera AI] Gemini JSON error ${res.status}: ${errBody.slice(0, 120)}`);
      return { data: fallbackValue, fallback: true, error: `HTTP ${res.status}` };
    }

    const data = await res.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return { data: fallbackValue, fallback: true, error: "empty_response" };
    }

    try {
      const parsed = JSON.parse(text) as T;
      return { data: parsed, fallback: false };
    } catch {
      console.warn("[Ivera AI] Gemini JSON response failed to parse — using fallback");
      return { data: fallbackValue, fallback: true, error: "unparseable_json" };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[Ivera AI] Gemini JSON call failed: ${msg}`);
    return { data: fallbackValue, fallback: true, error: msg };
  }
}
