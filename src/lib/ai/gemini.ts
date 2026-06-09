const GEMINI_KEY = process.env.GEMINI_API_KEY;
const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export interface GeminiResult {
  text: string;
  fallback: boolean;
}

export async function callGemini(
  prompt: string,
  fallbackText: string,
  maxTokens = 250
): Promise<GeminiResult> {
  if (!GEMINI_KEY) {
    return { text: fallbackText, fallback: true };
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

    if (!res.ok) return { text: fallbackText, fallback: true };

    const data = await res.json();
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) return { text: fallbackText, fallback: true };
    return { text, fallback: false };
  } catch {
    return { text: fallbackText, fallback: true };
  }
}
