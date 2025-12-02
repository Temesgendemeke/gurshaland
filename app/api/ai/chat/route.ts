import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

/**
 * Chat API route: proxies text generation to Gemini via @ai-sdk/google.
 *
 * Environment Variables:
 *   GEMINI_API_KEY (preferred) OR GOOGLE_GENERATIVE_AI_API_KEY (provider default)
 *
 * If only GEMINI_API_KEY is set, we mirror it to GOOGLE_GENERATIVE_AI_API_KEY
 * so the google() provider can pick it up without changing other code.
 *
 * Request (POST JSON):
 * {
 *   "message": "User prompt here",
 *   "system": "Optional system instruction",
 *   "history": [
 *      { "role": "user"|"assistant"|"system", "content": "..." }
 *   ]
 * }
 *
 * Response (200 JSON):
 * {
 *   "text": "Model response",
 *   "model": "gemini-2.5-flash",
 *   "usage": { "inputTokens": number|undefined, "outputTokens": number|undefined }
 * }
 *
 * Error (JSON with status != 200):
 * {
 *   "error": "message",
 *   "status": 400|500
 * }
 */

export const runtime = "nodejs"; // Avoid edge if library needs Node APIs

// Simple schema guards
type ChatHistoryItem = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatRequestBody = {
  message?: string;
  system?: string;
  history?: ChatHistoryItem[];
};

// Consolidate API key logic
function resolveApiKey(): string {
  const direct = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const gemini = process.env.GEMINI_API_KEY;

  if (direct && direct.trim()) return direct.trim();
  if (gemini && gemini.trim()) {
    // Mirror to expected variable if absent
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = gemini.trim();
    }
    return gemini.trim();
  }
  throw new Error(
    "Gemini API key missing. Set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY.",
  );
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON body",
        status: 400,
        requestId,
      },
      { status: 400 },
    );
  }

  const { message, system, history } = body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json(
      {
        error: "Field 'message' is required and must be a non-empty string.",
        status: 400,
        requestId,
      },
      { status: 400 },
    );
  }

  // Validate optional history
  if (history && !Array.isArray(history)) {
    return NextResponse.json(
      {
        error: "Field 'history' must be an array if provided.",
        status: 400,
        requestId,
      },
      { status: 400 },
    );
  }

  try {
    const apiKey = resolveApiKey();

    // Compose a conversational prompt from history + system + current message.
    // For minimal example we flatten to a single prompt string.
    const historyText =
      history
        ?.map(
          (h) =>
            `${h.role.toUpperCase()}: ${(h.content || "").replace(/\n+/g, " ")
              .trim()}`,
        )
        .join("\n") || "";

    const systemText = system
      ? `SYSTEM: ${(system || "").replace(/\n+/g, " ").trim()}\n`
      : "";

    const finalPrompt = `${systemText}${historyText}${
      historyText ? "\n" : ""
    }USER: ${message.trim()}\nASSISTANT:`.trim();

    const modelId = "gemini-2.5-flash";

    const { text, usage } = await generateText({
      model: google(modelId),
      prompt: finalPrompt,
    });

    return NextResponse.json(
      {
        text,
        model: modelId,
        usage: {
          inputTokens: usage?.promptTokens,
          outputTokens: usage?.completionTokens,
        },
        requestId,
      },
      { status: 200 },
    );
  } catch (err: any) {
    const msg =
      err?.message ||
      "Unexpected error while generating AI response. Check server logs.";
    return NextResponse.json(
      {
        error: msg,
        status: 500,
        requestId,
      },
      { status: 500 },
    );
  }
}

// (Optional) GET for health check / debugging