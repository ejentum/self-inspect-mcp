// Keyless HTTP client for the public Self-Inspect endpoint. No Authorization
// header by design: the tool is free, public, and rate-limited per IP. The only
// configuration is the URL (overridable for self-hosting or testing).

const DEFAULT_API_URL = "https://api.ejentum.com/self-inspect";

export interface SelfInspectResult {
  metathought: string | null;
  matched: boolean;
  id?: string;
}

export async function callSelfInspect(
  thought: string,
): Promise<SelfInspectResult> {
  const apiUrl = process.env.SELF_INSPECT_API_URL || DEFAULT_API_URL;

  let response: Response;
  try {
    response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ thought }),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`Network error calling Self-Inspect at ${apiUrl}: ${detail}`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    if (response.status === 429) {
      throw new Error(
        "Rate limit exceeded (429): Self-Inspect is keyless and rate-limited per IP. Retry shortly, or run fully offline with SELF_INSPECT_LOCAL=1.",
      );
    }
    throw new Error(
      `Self-Inspect endpoint returned ${response.status}: ${body.slice(0, 200)}`,
    );
  }

  let parsed: unknown;
  try {
    parsed = await response.json();
  } catch {
    throw new Error("Self-Inspect returned invalid JSON");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error(
      `Self-Inspect returned unexpected shape (expected non-empty array): ${JSON.stringify(parsed).slice(0, 200)}`,
    );
  }

  const item = parsed[0] as Partial<SelfInspectResult>;
  return {
    metathought: item.metathought ?? null,
    matched: Boolean(item.matched),
    id: item.id,
  };
}
