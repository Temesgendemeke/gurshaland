const NUTRIENTS = [
  { key: "calories", label: "Calories", unit: "kcal" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "carbs", label: "Carbs", unit: "g" },
  { key: "fat", label: "Fat", unit: "g" },
  { key: "fiber", label: "Fiber", unit: "g" },
];

const NutritionSection = ({ nutrition }: { nutrition: any }) => {
  const items = NUTRIENTS.filter(
    (n) => nutrition?.[n.key] !== undefined && nutrition?.[n.key] !== null,
  );

  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border/80">
      <div className="border-b border-border/80 bg-card px-4 py-3">
        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-widest text-foreground">
          Nutrition facts
        </h3>
      </div>
      <ul className="divide-y divide-border/80 bg-card">
        {items.map((n) => (
          <li
            key={n.key}
            className="flex items-baseline justify-between px-4 py-2.5"
          >
            <span className="text-sm text-muted-foreground">{n.label}</span>
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {nutrition[n.key]}
              <span className="ml-1 font-normal text-muted-foreground">
                {n.unit}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NutritionSection;
