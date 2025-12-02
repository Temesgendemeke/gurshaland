"use server";

import { mealPlannerType } from "@/schema/meal-planner";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const generateMealPlan = async (data: mealPlannerType) => {
  try {
    const prompt = `Create a meal plan for ${data.timeframe} for ${data.goal} with ${data.diet} diet. ${data?.calories ? `Calories: ${data.calories}` : ''} ${data?.meals_per_day ? `Meals per day: ${data.meals_per_day}` : ''} age: ${data?.age} gender: ${data?.gender} height: ${data?.height?.value}${data?.height?.unit} weight: ${data?.weight?.value}${data?.weight?.unit} activity level: ${data?.activity_level}  ${data?.prompt ? `Additional instructions: ${data.prompt}` : ''}
    
Return ONLY valid JSON (no markdown, no code blocks) based on this schema:
{
  "timeframe": "today" | "weekend",
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
          "fat": number
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
- if timeframe is weekend generate for the whole week from sunday to saturday [in order]
- Make sure to include Ethiopian/traditional foods where appropriate.
- no markdown or code blocks in the response
- no extra text or explanation, only valid JSON
- if timeframe is today generate for today
`;
  const { text } = await generateText({
      model: google('gemini-2.5-flash', {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      }),
      prompt,
    });

    console.log("AI Response:", text);

    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    const json_res = JSON.parse(cleanedText);
  
    return {
      success: true,
      ...json_res,
    };
  } catch (error) {
    console.error("Error generating meal plan:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate meal plan",
    };
  }
};