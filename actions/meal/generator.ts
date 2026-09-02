"use server";

import { mealPlannerType } from "@/schema/meal-planner";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { refundCredits, spendCredits } from "../credits";
import { MEAL_PLAN_CREDIT_COST } from "@/constants/creditCosts";
import { ETHIOPIAN_DISHES } from "@/constants/ethiopianDishes";

export const generateMealPlan = async (data: mealPlannerType) => {
  let creditSpent = false;
  try {
    // Charge 3 credits for each AI meal plan generation
    const creditResult = await spendCredits(MEAL_PLAN_CREDIT_COST);
    if (!creditResult.success) {
      return {
        success: false,
        error: creditResult.error || "Not enough credits.",
      };
    }
    creditSpent = true;
    const bodyDetails = [
      data?.age ? `age: ${data.age}` : "",
      data?.gender ? `gender: ${data.gender}` : "",
      data?.height?.value ? `height: ${data.height.value}${data.height.unit}` : "",
      data?.weight?.value ? `weight: ${data.weight.value}${data.weight.unit}` : "",
      data?.activity_level ? `activity level: ${data.activity_level}` : "",
    ]
      .filter(Boolean)
      .join(" ");
    const prompt =
      `Create a meal plan for ${data.timeframe} for ${data.goal} with ${data.diet} diet. ${
        data?.calories ? `Calories: ${data.calories}` : ""
      } ${
        data?.meals_per_day ? `Meals per day: ${data.meals_per_day}` : ""
      } ${bodyDetails} ${
        data?.prompt ? `Additional instructions: ${data.prompt}` : ""
      }
    
Return ONLY valid JSON (no markdown, no code blocks) based on this schema:
{
  "timeframe": "today" | "full-week",
  "name": "string",
  "goal": "fat_loss" | "muscle_gain" | "maintenance",
  "diet": "standard" | "vegetarian" | "vegan" | "keto",
  "calories": number (optional),
  "meals_per_day": number,
  "days": [
    {
      "day": "string",
      "meals": [
        {
          "name": "string",
          "description": "string",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "pexels_search_term": "string — a short search query for finding a PHOTO of this exact Ethiopian dish on Pexels. MUST describe the actual food visually (e.g. 'Ethiopian doro wat chicken stew', 'injera flatbread with stew', 'Ethiopian kitfo minced meat'). Always include the dish name. 3-6 words. Do NOT use abstract or vague terms."
        }
      ],
      "total_calories": number
    }
  ],
  "shopping_list": ["string"],
  "notes": "string",
  "pro_tips": ["string"]
}

constraints:
- if timeframe is "full-week" generate for the whole week from sunday to saturday [in order]
- STRICT AUTHENTICITY: Every meal MUST be an existing, real Ethiopian dish. Do NOT invent dishes, do NOT combine dish names (for example "Doro Shiro Wat" is NOT a real dish), and do NOT include dishes from other cuisines. Only use authentic dishes such as: ${ETHIOPIAN_DISHES.join(
  ", ",
)}. Adjust to the user's diet (vegetarian/vegan/keto) with authentic variations of these dishes.
- no markdown or code blocks in the response
- no extra text or explanation, only valid JSON
- if timeframe is "today" generate for today
`;
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    console.log("AI Response:", text);

    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/g, "").replace(
        /```\n?/g,
        "",
      );
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    const json_res = JSON.parse(cleanedText);

    return {
      success: true,
      ...json_res,
    };
  } catch (error) {
    console.error("Error generating meal plan:", error);

    // Don't charge the user for a failed generation.
    if (creditSpent) {
      try {
        await refundCredits(MEAL_PLAN_CREDIT_COST);
      } catch (refundError) {
        console.error("Failed to refund credits:", refundError);
      }
    }

    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : "Failed to generate meal plan",
    };
  }
};
