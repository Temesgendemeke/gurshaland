"use server"
import { GoogleGenAI, Modality } from "@google/genai";
import supabase from "./supabase-server";

import { BUCKET } from "@/constants/image";
import generateImage from "./getImage";

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Professional image generation function
export const AIgenerateImage = async (prompt: string): Promise<{ url: string; path: string } | null> => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY not configured");
        }

        const new_prompt = `You are a professional photographer. Generate a high quality close up image  of the following prompt: ${prompt}`

        const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: [new_prompt],
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            }
        });

        // Extract image data from response
        const candidate = response?.candidates?.[0];
        if (!candidate?.content?.parts) {
            console.warn("No content parts in Gemini response");
            return null;
        }

        for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
                // Convert base64 to data URL
                const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;

                const {url, path} = await uploadAIImageToStorage(dataUrl, `ai-generated-${Date.now()}.webp`) ?? {url: null, path: null}
                return {url: url ?? "", path: path ?? ""}
            }
        }

        console.warn("No image data found in Gemini response");
        return null;
    } catch (error) {
        console.error("Error generating AI image:", error);
        return null;
    }
};

export const generateRecipeImage = async (prompt: string): Promise<{ url: string; path: string } | null> => {
    try {
        // Try AI generation first
        const aiImage = await AIgenerateImage(prompt);
        if (aiImage?.url) {
            return aiImage;
        }

        // Fallback to stock image service
        const stockImage = await generateImage(prompt);
        if (stockImage) {
            const filename = `stock-${Date.now()}.jpg`;
            const uploadedImage = await uploadAIImageToStorage(stockImage, filename);
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
        const { data, error } = await supabase.storage.from(BUCKET).upload(uniqueFilename, buffer, {
            cacheControl: "3600",
            upsert: true,
            contentType: `image/${fileExtension === 'webp' ? 'webp' : 'jpeg'}`,
        });
        
        if (error) throw error;
        
        // Get the public URL
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uniqueFilename);
        
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
