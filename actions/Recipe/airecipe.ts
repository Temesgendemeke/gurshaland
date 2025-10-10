"use server"
import { GoogleGenAI } from "@google/genai";
import { parseMarkdownJSON } from "@/utils/parseJSON";
import generateImage from "@/utils/getImage";
import AIgenerateImage from "@/utils/genAI";
import { generateRecipeImage } from "@/utils/genAI";
import Recipe from "@/utils/types/recipe";


function extractJSON(text: string): string {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end < start) throw new Error("No JSON found in model response.");
    return text.slice(start, end + 1);
  }
  
export async function generateAIRecipe(ingredients: string, preferences: string) {
   
    try {
      // Check if API key is available FIRST
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is not set");
      }

      // Log environment variable details for debugging
      console.log("Environment check:");
      console.log("- GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
      console.log("- GEMINI_API_KEY length:", process.env.GEMINI_API_KEY?.length);
      console.log("- GEMINI_API_KEY starts with:", process.env.GEMINI_API_KEY?.substring(0, 10) + "...");
      console.log("- NODE_ENV:", process.env.NODE_ENV);

      // Initialize GoogleGenAI inside the server action
      const genAI = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const formattedPrompt = `
You are a professional Ethiopian chef. Given user ingredients and preferences, return a single STRICT JSON object only.
Do NOT include markdown, code fences, comments, or any prose. No trailing commas.

Constraints:
- Fields: title (string), description (string),
  ingredients (array of { amount: number|null, unit: string|null, item: string }),
  instructions (array of { step: number, title: string, description: string, imagePrompt: string }),
  nutrition ({ calories:number, protein:number, carbs:number, fat:number, fiber:number }),
  cooktime (number), difficulty (string), servings (number).
- imagePrompt must be a short, descriptive phrase for image generation (no URLs, no base64).

User ingredients: ${ingredients}
User preferences: ${preferences}

Example shape:
{
  "title": "AI-Generated Vegetarian Shiro Wat",
  "description": "A personalized version of traditional Ethiopian chickpea stew.",
  "ingredients": [
    { "amount": 2, "unit": "tbsp", "item": "olive oil" }
  ],
  "instructions": [
    { "step": 1, "title": "Heat Oil", "description": "Heat olive oil...", "imagePrompt": "Heating olive oil in a pan" }
  ],
  "nutrition": { "calories": 200, "protein": 10, "carbs": 20, "fat": 10, "fiber": 5 },
  "cooktime": "25",
  "difficulty": "Easy",
  "servings": 4
}
`;

      console.log("Sending request to Gemini API...");
      console.log("API Key available:", !!process.env.GEMINI_API_KEY);
      console.log("API Key length:", process.env.GEMINI_API_KEY?.length);
      
      let response;
      try {
        response = await genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [formattedPrompt],
        });
      } catch (apiError: any) {
        console.error("Gemini API call failed:", apiError);
        if (apiError.message?.includes("fetch failed")) {
          throw new Error("Network error: Unable to connect to Gemini API. Please check your internet connection and try again.");
        } else if (apiError.message?.includes("API key")) {
          throw new Error("Authentication error: Invalid or expired API key. Please check your GEMINI_API_KEY.");
        } else if (apiError.message?.includes("timeout")) {
          throw new Error("Request timeout: The API request took too long. Please try again.");
        } else {
          throw new Error(`API error: ${apiError.message || "Unknown error occurred"}`);
        }
      }
  
      console.log("Raw Gemini response:", JSON.stringify(response, null, 2));
  
      // Handle different response structures
      let responseText = "";
      if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = response.candidates[0].content.parts[0].text;
      } else if (response.text) {
        responseText = response.text;
      } else {
        console.error("Unexpected response structure:", response);
        throw new Error("Unexpected response structure from Gemini API");
      }
  
      console.log("Extracted response text:", responseText);
  
      if (!responseText || responseText.startsWith("[ERROR")) {
        throw new Error(responseText || "Empty model response");
      }
  
      // Parse JSON robustly (strip anything outside the JSON object)
      const jsonString = extractJSON(responseText.trim());
      console.log("Extracted JSON string:", jsonString);
      
      const recipeData: Recipe = parseMarkdownJSON(jsonString);
      console.log("Parsed recipe data:", recipeData);
  
      // Generate main recipe image professionally
      try {
        const mainPrompt = recipeData?.title 
          ? `${recipeData.title} Ethiopian cuisine`
          : "Ethiopian traditional cuisine, colorful food";
        
          const mainImage = await generateRecipeImage(mainPrompt);
        
        if (mainImage) {
          recipeData.image = {
            url: mainImage.url,
            path: mainImage.path,
            recipe_id: "temp-" + Date.now() // Temporary ID until saved
          };
        } else {
          // Set a default placeholder image
          recipeData.image = {
            url: "/placeholder.jpg", 
            path: "placeholder.jpg",
            recipe_id: "temp-" + Date.now()
          };
        }

        console.log("recipeData", recipeData)
        console.log("recipeData.instructions", recipeData.instructions)

        // Initialize step images with placeholders for lazy loading
        if (Array.isArray(recipeData?.instructions)) {
          recipeData.instructions.forEach((instruction, index) => {
            instruction.image = {
              url: "/placeholder-step.svg", 
              path: `placeholder-step-${index}`,
              instruction_id: `temp-instruction-${index}-${Date.now()}`,
              isLoading: true, // Flag to indicate this needs to be generated
              imagePrompt: instruction.imagePrompt || "" // Store the prompt for later generation
            };
          });
        }
        
        console.log("recipeData", recipeData)
      } catch (error) {
        console.error("Error generating main recipe image:", error);
        recipeData.image = {
          url: "/placeholder.jpg",
          path: "placeholder.jpg",
          recipe_id: "temp-" + Date.now()
        };
      }

  
      return { success: true, recipe: recipeData };
    } catch (error: any) {
      console.error("Error generating recipe:", error);
      console.error("Error stack:", error.stack);
      
      return {
        success: false,
        error: error?.message || "Failed to generate recipe",
      };
    }
  }

