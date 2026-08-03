"use server";
import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import env from "@/env";

interface AIResponse {
  text: string;
  error?: string;
  success: boolean;
}

export const getResponse = async (prompt: string) => {
  if (env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
      });
      return { text, success: true };
    } catch (error) {
      console.log(error);
      return { error: error, success: false };
    }
  }
  return { error: "AI not initialized", success: false };
};

export const getStreamResponse = async (prompt: string) => {
  if (env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      const stream = await streamText({
        model: google("gemini-2.5-flash"),
        prompt,
      });
      return { stream: stream.toUIMessageStreamResponse(), success: true };
    } catch (error) {
      console.log(error);
      return { error: error, success: false };
    }
  }
  return { error: "AI not initialized", success: false };
};
