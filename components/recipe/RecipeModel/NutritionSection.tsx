import { Beef, Droplet, Flame, Leaf, Wheat } from "lucide-react";

const NUTRIENTS = [
  { key: "calories", label: "Calories", unit: "kcal", icon: Flame },
  { key: "protein", label: "Protein", unit: "g", icon: Beef },
  { key: "carbs", label: "Carbs", unit: "g", icon: Wheat },
  { key: "fat", label: "Fat", unit: "g", icon: Droplet },
  { key: "fiber", label: "Fiber", unit: "g", icon: Leaf },
];

const NutritionSection = ({ nutrition }: { nutrition: any }) => {
  const items = NUTRIENTS.filter(
    (n) => nutrition?.[n.key] !== undefined && nutrition?.[n.key] !== null,
  );

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="heading-secondary text-xl md:text-2xl border-b border-border pb-3">
        Nutrition
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.key}
              className="rounded-xl border border-border/60 bg-card p-4 text-center"
            >
              <Icon className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 text-xl font-bold text-foreground">
                {nutrition[n.key]}
                <span className="text-xs font-normal text-muted-foreground">
                  {" "}
                  {n.unit}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">{n.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NutritionSection;
