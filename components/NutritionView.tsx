import format_calories from "@/utils/formatcalories";
import React from "react";
import { Nutrition } from "@/utils/types/recipe";

interface NutritionViewProps {
  nutrition: Nutrition;
}

const NUTRIENTS = [
  { key: "calories", label: "Calories" },
  { key: "protein", label: "Protein" },
  { key: "carbs", label: "Carbs" },
  { key: "fat", label: "Fat" },
  { key: "fiber", label: "Fiber" },
] as const;

const NutritionView = ({ nutrition }: NutritionViewProps) => {
  const items = NUTRIENTS.map((n) => ({
    label: n.label,
    value: format_calories(nutrition?.[n.key]),
  }));

  return (
    <div className="overflow-hidden rounded-xl border border-border/80">
      <div className="border-b border-border/80 bg-card px-4 py-3">
        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-widest text-foreground">
          Nutrition facts · per serving
        </h3>
      </div>
      <ul className="divide-y divide-border/80 bg-card">
        {items.map((n) => (
          <li
            key={n.label}
            className="flex items-baseline justify-between px-4 py-2.5"
          >
            <span className="text-sm text-muted-foreground">{n.label}</span>
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {n.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NutritionView;
