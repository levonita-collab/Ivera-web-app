import { buildLlmsTxt } from "@/lib/llmsTxt";

// Rebuilt daily so seasonal prices switch on and off by themselves.
export const revalidate = 86400;

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
