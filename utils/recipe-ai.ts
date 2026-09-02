export function extractJSON(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON found in model response.");
  }
  return text.slice(start, end + 1);
}

export function classifyGenerationError(error: any): string {
  const raw = String(error?.message ?? "");

  let code: string | number | null = null;
  let status = "";
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error) {
      code = parsed.error.code;
      status = String(parsed.error.status ?? "");
    }
  } catch {
    // Not a JSON error payload.
  }

  if (
    code === 429 ||
    code === 503 ||
    status === "UNAVAILABLE" ||
    status === "RESOURCE_EXHAUSTED"
  ) {
    return "The AI is busy right now. Please try again in a moment.";
  }
  if (code === 500 || status === "INTERNAL") {
    return "The AI hit a snag. Please try again in a moment.";
  }
  if (
    raw.includes("fetch failed") ||
    raw.includes("ENOTFOUND") ||
    raw.includes("ECONNREFUSED") ||
    raw.includes("ETIMEDOUT")
  ) {
    return "We couldn't reach the AI service. Check your internet connection and try again.";
  }
  if (raw.includes("API key")) {
    return "The AI service isn't configured right now. Please contact support.";
  }
  if (raw.includes("[ERROR")) {
    return "The AI returned an empty response. Please try again.";
  }
  return "Something went wrong while generating your recipe. Please try again.";
}
