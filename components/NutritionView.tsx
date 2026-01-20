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
    <Card className="p-6 bg-card/70 backdrop-blur-sm border-border/50">
      <h3 className="text-xl font-bold text-foreground mb-4">
        Nutrition (per serving)
      </h3>

      <div className="space-y-3">
        {nutritionList.map((n, index) => (
          <div className="flex justify-between" key={index}>
            <span className="text-muted-foreground">{n.field}</span>
            <span className="font-medium text-foreground">{n.calories}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NutritionView;
