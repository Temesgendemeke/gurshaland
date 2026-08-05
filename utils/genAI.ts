"use server";
import { GoogleGenAI, Modality } from "@google/genai";
import { createClient } from "./supabase/server";

import { BUCKET } from "@/constants/image";
import generateImage from "./getImage";
import { da } from "date-fns/locale";
import sanitizeFileName from "@/utils/santize_file_name";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Professional image generation function
export const AIgenerateImage = async (
  prompt: string,
): Promise<{ url: string; path: string } | null> => {
  try {
    console.log(`🤖 AIgenerateImage called with prompt: "${prompt}"`);

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not configured");
      throw new Error("GEMINI_API_KEY not configured");
    }
    console.log(`✅ GEMINI_API_KEY is configured`);

    const new_prompt =
      `You are a professional photographer. Generate a high quality landscape aspect ratio image of the following prompt: ${prompt}`;
    console.log(`📝 Formatted prompt: "${new_prompt}"`);

    console.log(`🚀 Calling Gemini API...`);
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [new_prompt],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });
    console.log(`📡 Gemini API response received:`, response);

    // Extract image data from response
    const candidate = response?.candidates?.[0];
    console.log(`🔍 Candidate:`, candidate);

    if (!candidate?.content?.parts) {
      console.warn("❌ No content parts in Gemini response");
      return null;
    }
    console.log(`📦 Content parts count:`, candidate.content.parts.length);

    for (const part of candidate.content.parts) {
      console.log(`🔍 Processing part:`, part);
      if (part.inlineData && part.inlineData.mimeType?.startsWith("image/")) {
        console.log(
          `🖼️ Found image data with mime type:`,
          part.inlineData.mimeType,
        );
        // Convert base64 to data URL and upload to storage
        const dataUrl =
          `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        console.log(`✅ Generated data URL (length: ${dataUrl.length})`);

        const uploaded = await uploadAIImageToStorage(
          dataUrl,
          `ai-generated-${Date.now()}.${
            part.inlineData.mimeType.split("/")[1] || "webp"
          }`,
        );
        return uploaded;
      }
    }

    console.warn("❌ No image data found in Gemini response");
    return null;
  } catch (error) {
    console.error("Error generating AI image:", error);
    return null;
  }
};

export const generateRecipeImage = async (
  prompt: string,
): Promise<{ url: string; path: string } | null> => {
  console.log(`🖼️ generateRecipeImage called with prompt: "${prompt}"`);

  // Try AI generation first with timeout
  const aiImagePromise = AIgenerateImage(prompt);
  const timeoutPromise = new Promise<null>((_, reject) =>
    setTimeout(() => reject(new Error("Image generation timeout")), 35000)
  );

  try {
    console.log(`🤖 Attempting AI image generation for: "${prompt}"`);
    const aiImage = await Promise.race([aiImagePromise, timeoutPromise]);
    if (aiImage?.url) {
      console.log(`✅ AI image generated successfully for: "${prompt}"`);
      return aiImage;
    }
    console.log(`❌ AI image generation failed for: "${prompt}"`);
  } catch (error) {
    console.warn(`⚠️ AI image generation error, trying stock photo: "${prompt}"`, error);
  }

  // Fallback: fetch a stock photo so previews still work (AI quota may be exhausted)
  try {
    const stockUrl = await generateImage(prompt);
    if (stockUrl) {
      console.log(`✅ Stock photo fallback used for: "${prompt}"`);
      return { url: stockUrl, path: "" };
    }
  } catch (error) {
    console.error("Error fetching stock photo:", error);
  }

  return null;
};

// Stock photo only (no AI cost) — used for step/instruction images so the
// AI image budget stays capped at the single hero image.
export const generateStockImage = async (
  prompt: string,
): Promise<{ url: string; path: string } | null> => {
  try {
    const stockUrl = await generateImage(prompt);
    if (stockUrl) {
      return { url: stockUrl, path: "" };
    }
  } catch (error) {
    console.error("Error fetching stock photo:", error);
  }
  return null;
};

// Add this function for production use
export const uploadAIImageToStorage = async (
  imageData: string,
  filename: string,
): Promise<{ url: string; path: string } | null> => {
  try {
    const supabase = await createClient();

    let buffer: Buffer;
    let contentType = "image/webp";

    if (imageData.startsWith("data:image/")) {
      // Convert data URL to buffer
      const match = imageData.match(
        /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/,
      );
      if (!match) throw new Error("Invalid data URL");
      contentType = match[1];
      buffer = Buffer.from(match[2], "base64");
    } else if (
      imageData.startsWith("http://") ||
      imageData.startsWith("https://")
    ) {
      // Fetch remote image and convert to buffer with retries and timeout.
      // Network egress may fail in some hosting environments; if fetching
      // the remote image repeatedly fails we'll gracefully fall back to
      // returning the remote URL so the app can still show the image.
      const fetchWithTimeout = async (url: string, timeout = 10000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
          const res = await fetch(url, { signal: controller.signal });
          return res;
        } finally {
          clearTimeout(id);
        }
      };

      const maxRetries = 3;
      let attempt = 0;
      let resp: Response | null = null;
      let lastError: any = null;

      while (attempt < maxRetries) {
        try {
          resp = await fetchWithTimeout(imageData, 10000);
          if (!resp.ok) {
            throw new Error(`Failed to fetch image: ${resp.status}`);
          }
          break;
        } catch (err) {
          lastError = err;
          attempt += 1;
          const backoff = 200 * Math.pow(2, attempt); // exponential backoff
          console.warn(
            `fetch attempt ${attempt} failed, retrying in ${backoff}ms`,
            err,
          );
          await new Promise((r) => setTimeout(r, backoff));
        }
      }

      if (!resp) {
        // Could not fetch remote image (network blocked / timed out). Log and
        // fallback to returning the external URL (no storage path). Caller
        // should treat missing path as an external image and avoid trying to
        // remove it from Supabase storage on delete.
        console.error(
          "uploadAIImageToStorage: failed to download remote image after retries",
          lastError,
        );
        return { url: imageData, path: "" };
      }

      const arr = await resp.arrayBuffer();
      buffer = Buffer.from(arr);
      const ct = resp.headers.get("content-type");
      if (ct && ct.startsWith("image/")) contentType = ct;
    } else {
      throw new Error("Unsupported imageData format");
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const safeFilename = sanitizeFileName(filename);
    const uniqueFilename = `recipe/ai_generated/${timestamp}_${safeFilename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(uniqueFilename, buffer, {
        cacheControl: "3600",
        upsert: true,
        contentType,
      });

    if (error) throw error;

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(uniqueFilename);

    return {
      url: urlData.publicUrl,
      path: uniqueFilename,
    };
  } catch (error) {
    console.error("Error uploading AI image:", error);
    return null;
  }
};

export default AIgenerateImage;
