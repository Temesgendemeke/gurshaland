import format_calories from "@/utils/formatcalories";
import React from "react";
import { Card } from "./ui/card";
import { Nutrition } from "@/utils/types/recipe";

interface NutritionViewProps {
  nutrition: Nutrition;
}

const NutritionView = ({ nutrition }: NutritionViewProps) => {
  const nutritionList = [
    {
      field: "Calories",
      calories: format_calories(nutrition?.calories) ?? "unknown",
    },
    {
      field: "Protein",
      calories: format_calories(nutrition?.protein),
    },
    {
      field: "Carbs",
      calories: format_calories(nutrition?.carbs),
    },
    {
      field: "Fat",
      calories: format_calories(nutrition?.fat),
    },
    {
      field: "Fiber",
      calories: format_calories(nutrition?.fiber),
    },
  ];
  return (
    <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Nutrition (per serving)
      </h3>

      <div className="space-y-3">
        {nutritionList.map((n, index) => (
          <div className="flex justify-between" key={index}>
            <span className="text-gray-600 dark:text-gray-400">{n.field}</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {n.calories}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NutritionView;
