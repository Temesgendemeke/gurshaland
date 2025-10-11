"use server"
import { GoogleGenAI, Modality } from "@google/genai";
import { createClient } from "./supabase/server";

import { BUCKET } from "@/constants/image";
import generateImage from "./getImage";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const supabase = createClient();

// Professional image generation function
export const AIgenerateImage = async (prompt: string): Promise<{ url: string; path: string } | null> => {
  try {
    console.log(`🤖 AIgenerateImage called with prompt: "${prompt}"`);

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not configured");
      throw new Error("GEMINI_API_KEY not configured");
    }
    console.log(`✅ GEMINI_API_KEY is configured`);

    const new_prompt = `You are a professional photographer. Generate a high quality landscape aspect ratio image of the following prompt: ${prompt}`
    console.log(`📝 Formatted prompt: "${new_prompt}"`);

    console.log(`🚀 Calling Gemini API...`);
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [new_prompt],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      }
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
      if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
        console.log(`🖼️ Found image data with mime type:`, part.inlineData.mimeType);
        // Convert base64 to data URL
        const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        console.log(`✅ Generated data URL (length: ${dataUrl.length})`);

        return {url: dataUrl, path: ""};

        // const { url, path } = await uploadAIImageToStorage(dataUrl, `ai-generated-${Date.now()}.webp`) ?? { url: null, path: null }
        // return { url: url ?? "", path: path ?? "" }
      }
    }

    console.warn("❌ No image data found in Gemini response");
    return null;
  } catch (error) {
    console.error("Error generating AI image:", error);
    return null;
  }
};

export const generateRecipeImage = async (prompt: string): Promise<{ url: string; path: string } | null> => {
  try {
    console.log(`🖼️ generateRecipeImage called with prompt: "${prompt}"`);

    // Try AI generation first with timeout
    const aiImagePromise = await AIgenerateImage(prompt);
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('Image generation timeout')), 15000)
    );

    console.log(`🤖 Attempting AI image generation for: "${prompt}"`);
    const aiImage = await Promise.race([aiImagePromise, timeoutPromise]);
    if (aiImage?.url) {
      console.log(`✅ AI image generated successfully for: "${prompt}"`);
      return aiImage;
    }
    console.log(`❌ AI image generation failed for: "${prompt}"`);

    // Fallback to stock image service with timeout
    const stockImagePromise = await generateImage(prompt);
    const stockTimeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('Stock image timeout')), 10000)
    );

    const stockImage = await Promise.race([stockImagePromise, stockTimeoutPromise]);
    if (stockImage) {
      const filename = `stock-${Date.now()}.jpg`;
      const uploadedImage = await uploadAIImageToStorage(stockImage.url, filename);

      return uploadedImage;
    }

    return null;
  } catch (error) {
    console.error("Error generating recipe image:", error);
    return null;
  }
};


// Add this function for production use
export const uploadAIImageToStorage = async (imageData: string, filename: string): Promise<{ url: string; path: string } | null> => {
  try {
    // Convert data URL to buffer
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = filename.split('.').pop() || 'webp';
    const uniqueFilename = `/recipe/ai_generated/${timestamp}_${filename}`;

    // Upload to Supabase Storage
    const { data, error } = await (await supabase).storage.from(BUCKET).upload(uniqueFilename, buffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: `image/${fileExtension === 'webp' ? 'webp' : 'jpeg'}`,
    });

    if (error) throw error;

    // Get the public URL
    const { data: urlData } = await (await supabase).storage.from(BUCKET).getPublicUrl(uniqueFilename);

    return {
      url: urlData.publicUrl,
      path: uniqueFilename
    };
  } catch (error) {
    console.error("Error uploading AI image:", error);
    return null;
  }
};

export default AIgenerateImage;
