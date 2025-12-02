import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: NextRequest, res: NextResponse) {
  const { prompt } = await req.json();
  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    prompt,
  });

  console.log(text);

  return Response.json({ text });
}
