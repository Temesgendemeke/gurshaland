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
    <div className="overflow-hidden rounded-xl border border-border bg-card/50">
      <div className="border-b border-border/60 px-4 py-3.5">
        <h3 className="font-gosh text-base font-semibold tracking-tight text-foreground">
          Nutrition Facts
        </h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">Per serving</p>
      </div>
      <ul className="divide-y divide-border/40">
        {items.map((n) => (
          <li
            key={n.label}
            className="flex items-baseline justify-between px-4 py-2.5 transition-colors hover:bg-muted/20"
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
