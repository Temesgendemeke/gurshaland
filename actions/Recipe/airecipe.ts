"use server"
import { GoogleGenAI } from "@google/genai";
import { parseMarkdownJSON } from "@/utils/parseJSON";
import generateImage from "@/utils/getImage";
import AIgenerateImage from "@/utils/genAI";
import { generateRecipeImage } from "@/utils/genAI";
import Recipe from "@/utils/types/recipe";
import categories from "@/constants/categories";
import measurements from "@/constants/measurements";
import { findYoutubeVideo } from "../youtube";


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

      const allowedCategories = (categories as string[]).filter((c) => c !== 'all');
      const allowedUnits = (measurements as Array<{code:string;name:string}>).map(m => m.code);

      const formattedPrompt = `
You are a professional Ethiopian chef. Given user ingredients and preferences, return a single STRICT JSON object only.
Do NOT include markdown, code fences, comments, or any prose. No trailing commas.

Constraints:
- Fields: title (string), description (string),
  ingredients (array of { item: string, amount: string|null, unit: string|null, notes?: string|null }),
  instructions (array of { step: number, title: string, description: string, imagePrompt: string }),
  nutrition ({ calories:number, protein:number, carbs:number, fat:number, fiber:number }),
  preptime (number), cooktime (number), difficulty (string), servings (number).
- imagePrompt must be a short, descriptive phrase for image generation (no URLs, no base64).
 - category (string) must be ONE OF: ${allowedCategories.join(", ")}
 - Each ingredient.unit must be ONE OF: ${allowedUnits.join(", ")} or null. Use only these codes.
 - difficulty must be "Easy", "Medium", or "Hard".
- Use numbers for preptime, cooktime, servings, and nutrition values.
- Use "null" (not empty or 0) for optional fields if unknown.
- Provide concise but complete recipe instructions.
- Ensure JSON is valid and parsable.
- youtube_search_query: A search query string to find a relevant YouTube video for this recipe.
- instructions description must be very clear and easy to follow for home cooks.

User ingredients: ${ingredients}
User preferences: ${preferences}

Example shape:
{
  "title": "AI-Generated Vegetarian Shiro Wat",
  "description": "A personalized version of traditional Ethiopian chickpea stew.",
  "ingredients": [
    { "item": "olive oil", "amount": 2, "unit": "tbsp" }
  ],
  "instructions": [
    { "step": 1, "title": "Heat Oil", "description": "Heat olive oil...", "imagePrompt": "Heating olive oil in a pan" }
  ],
  "nutrition": { "calories": 200, "protein": 10, "carbs": 20, "fat": 10, "fiber": 5 },
  "preptime": 10,
  "cooktime": 25,
  "difficulty": "Easy",
  "servings": 4,
  "category": "${allowedCategories[0] ?? 'Recipes'}"
  "youtube_search_query": "how to make Shiro wat"
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
      
      let recipeData: any = parseMarkdownJSON<any>(jsonString);

      const normalizeDifficulty = (d: any): string => {
        const v = String(d ?? '').toLowerCase();
        if (v === 'easy') return 'Easy';
        if (v === 'medium') return 'Medium';
        if (v === 'hard') return 'Hard';
        return 'Easy';
      };
      const pickCategory = (c: any): string => {
        const name = String(c ?? '').trim();
        return allowedCategories.includes(name) ? name : (allowedCategories[0] ?? 'Recipes');
      };

      recipeData = {
        ...recipeData,
        category: pickCategory(recipeData.category),
        difficulty: normalizeDifficulty(recipeData.difficulty)
      }

      console.log("recipe data", recipeData)

      const youtube_video_id = await findYoutubeVideo(recipeData.youtube_search_query!)

      if(youtube_video_id){
        recipeData.youtube_video_id = youtube_video_id;
      }

  
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
        }

        console.log("recipeData", recipeData)
        console.log("recipeData.instructions", recipeData.instructions)

        if(Array.isArray(recipeData?.instructions)) {
          recipeData.instructions = await Promise.all(
            recipeData.instructions.map(async (instruction, index) => {
              console.log("Generating image for instruction:", instruction);
              console.log("instruction.imagePrompt", instruction.imagePrompt);
              const ins_image = await generateRecipeImage(instruction?.imagePrompt);
              const image = {
                url: ins_image?.url,
                path: ins_image?.path,
                instruction_id: ''
              };
              return { ...instruction, image };
            })
          );
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

