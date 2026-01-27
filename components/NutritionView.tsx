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
    <Card className="p-6 bg-card border border-border rounded-lg shadow-modern">
      <h3 className="text-xl heading-primary mb-3">Nutrition (per serving)</h3>

      <ul className="divide-y divide-border">
        {nutritionList.map((n, index) => (
          <li className="flex justify-between items-center py-2" key={index}>
            <span className="text-muted-foreground">{n.field}</span>
            <span className="font-medium text-foreground">{n.calories}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default NutritionView;
