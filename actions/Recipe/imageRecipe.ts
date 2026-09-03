"use server";
import { GoogleGenAI } from "@google/genai";
import { parseMarkdownJSON } from "@/utils/parseJSON";
import { generateRecipeImage, generateStockImage } from "@/utils/genAI";
import { findYoutubeVideo } from "../youtube";
import { spendCredits, refundCredits } from "../credits";
import { RECIPE_CREDIT_COST } from "@/constants/creditCosts";
import { ETHIOPIAN_DISHES } from "@/constants/ethiopianDishes";
import categories from "@/constants/categories";
import measurements from "@/constants/measurements";
import { extractJSON, classifyGenerationError } from "@/utils/recipe-ai";

function normalizeRecipeData(recipeData: any, allowedCategories: string[]) {
  const normalizeDifficulty = (d: any): string => {
    const v = String(d ?? "").toLowerCase();
    if (v === "easy") return "Easy";
    if (v === "medium") return "Medium";
    if (v === "hard") return "Hard";
    return "Easy";
  };
  const pickCategory = (c: any): string => {
    const name = String(c ?? "").trim();
    return allowedCategories.includes(name)
      ? name
      : (allowedCategories[0] ?? "Recipes");
  };

  recipeData = {
    ...recipeData,
    category: pickCategory(recipeData.category),
    difficulty: normalizeDifficulty(recipeData.difficulty),
  };

  if (Array.isArray(recipeData.ingredients)) {
    recipeData.ingredients = recipeData.ingredients.map((ing: any) => ({
      ...ing,
      amount: ing.amount ?? null,
      unit: ing.unit === "null" ? null : (ing.unit ?? null),
    }));
  }

  return recipeData;
}

export async function generateAIRecipeFromImage(
  imageBase64: string,
  mimeType: string,
) {
  let creditSpent = false;
  try {
    // Charge 1 credit for each AI recipe generation
    const creditResult = await spendCredits(RECIPE_CREDIT_COST);
    if (!creditResult.success) {
      return {
        success: false,
        error: creditResult.error || "Not enough credits.",
      };
    }
    creditSpent = true;

    // Check if API key is available FIRST
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    // Initialize GoogleGenAI inside the server action
    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const allowedCategories = (categories as string[]).filter(
      (c) => c !== "all",
    );
    const allowedUnits = (
      measurements as Array<{ code: string; name: string }>
    ).map((m) => m.code);

    const formattedPrompt = `
You are a professional Ethiopian chef and food photography analyst. A user has uploaded a photo of a dish.
First, study the photo carefully and identify what the dish is: its main ingredients and how it is cooked (stewed, grilled, stir-fried, fermented, etc.).
Then translate it into Ethiopian cuisine: pick the closest authentic Ethiopian dish that shares the same technique, main ingredients, or spirit. If the photo already shows an Ethiopian dish, use that exact dish.
Finally, return a single STRICT JSON object only.
Do NOT include markdown, code fences, comments, or any prose. No trailing commas.

Constraints:
- Fields: title (string), description (string),
  ingredients (array of { item: string, amount: string|null, unit: string|null, tips?: string }),
  instructions (array of { step: number, title: string, description: string, imagePrompt: string, tips?: string }),
  nutrition ({ calories:number, protein:number, carbs:number, fat:number, fiber:number }),
  preptime (number), cooktime (number), difficulty (string), servings (number).
- imagePrompt must be a short, descriptive phrase for image generation (no URLs, no base64). The imagePrompt MUST describe ONLY the food, dish, or ingredients in the scene  do NOT include people, faces, hands, or human figures.
 - category (string) must be ONE OF: ${allowedCategories.join(", ")}
 - Each ingredient.unit must be ONE OF: ${
      allowedUnits.join(", ")
    } or null. Use only these codes.
 - difficulty must be "Easy", "Medium", or "Hard".
- Use numbers for preptime, cooktime, servings, and nutrition values.
- Use "null" (not empty or 0) for optional fields if unknown.
- Provide concise but complete recipe instructions.
- Ensure JSON is valid and parsable.
- youtube_search_query: A search query string to find a relevant YouTube video for this recipe.
- instructions description must be very clear and easy to follow for home cooks.
- use 0 if ingredient amount if Unknown
 - instructions time should be in minutes (number) and use 0 if unknown
- STRICT AUTHENTICITY: The recipe title, description, and content MUST correspond to an existing, real Ethiopian dish. Do NOT invent dishes, do NOT combine dish names (for example "Doro Shiro Wat" is NOT a real dish), and do NOT introduce dishes from other cuisines. Only cook authentic dishes such as: ${ETHIOPIAN_DISHES.join(
  ", ",
)}.
- If the uploaded photo cannot produce a real Ethiopian dish, pick the closest authentic dish from the list and adjust with authentic substitutions instead of inventing one.

Example shape:
{
  "title": "AI-Generated Vegetarian Shiro Wat",
  "description": "A personalized version of traditional Ethiopian chickpea stew.",
  "ingredients": [
    { "item": "olive oil", "amount": 2, "unit": "tbsp" }
  ],
  "instructions": [
    { "step": 1, "title": "Heat Oil", "description": "Heat olive oil...", "time": 2, "imagePrompt": "Heating olive oil in a pan" }
  ],
  "nutrition": { "calories": 200, "protein": 10, "carbs": 20, "fat": 10, "fiber": 5 },
  "preptime": 10,
  "cooktime": 25,
  "difficulty": "Easy",
  "servings": 4,
  "category": "${allowedCategories[0] ?? "Recipes"}"
  "youtube_search_query": "how to make Shiro wat"
}
`;

    let response;
    try {
      response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: formattedPrompt },
              { inlineData: { mimeType, data: imageBase64 } },
            ],
          },
        ],
      });
    } catch (apiError: any) {
      console.error("Gemini API call failed:", apiError);
      const friendly = classifyGenerationError(apiError);
      const friendlyError = new Error(friendly);
      (friendlyError as any).isFriendly = true;
      throw friendlyError;
    }

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

    if (!responseText || responseText.startsWith("[ERROR")) {
      const friendlyError = new Error(classifyGenerationError("[ERROR"));
      (friendlyError as any).isFriendly = true;
      throw friendlyError;
    }

    // Parse JSON robustly (strip anything outside the JSON object)
    const jsonString = extractJSON(responseText.trim());
    let recipeData: any = parseMarkdownJSON<any>(jsonString);

    recipeData = normalizeRecipeData(recipeData, allowedCategories);

    let youtube_video_id: string | null = null;
    try {
      if (recipeData.youtube_search_query) {
        youtube_video_id = await findYoutubeVideo(
          recipeData.youtube_search_query,
        );
      }
    } catch (error) {
      console.warn("YouTube search failed:", error);
    }

    if (youtube_video_id) {
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
          recipe_id: "temp-" + Date.now(), // Temporary ID until saved
        };
      }

      if (Array.isArray(recipeData?.instructions)) {
        recipeData.instructions = await Promise.all(
          recipeData.instructions.map(
            async (instruction: { imagePrompt?: string }) => {
              const ins_image = await generateStockImage(
                instruction?.imagePrompt ?? "",
              );
              const image = {
                url: ins_image?.url,
                path: ins_image?.path,
                instruction_id: "",
              };
              return { ...instruction, image };
            },
          ),
        );
      }
    } catch (error) {
      console.error("Error generating main recipe image:", error);
      recipeData.image = {
        url: "/placeholder.jpg",
        path: "placeholder.jpg",
        recipe_id: "temp-" + Date.now(),
      };
    }

    return { success: true, recipe: recipeData };
  } catch (error: any) {
    console.error("Error generating recipe from image:", error);
    console.error("Error stack:", error.stack);

    // Don't charge the user for a failed generation.
    if (creditSpent) {
      try {
        await refundCredits(RECIPE_CREDIT_COST);
      } catch (refundError) {
        console.error("Failed to refund credits:", refundError);
      }
    }

    return {
      success: false,
      error: error?.isFriendly
        ? String(error.message)
        : classifyGenerationError(error),
    };
  }
}
