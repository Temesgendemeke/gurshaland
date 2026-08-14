import { cn } from "@/lib/utils";

const IngredientsSection = ({
  ingredients,
}: {
  ingredients: { amount?: number; unit?: string; item?: string }[];
}) => {
  const list = ingredients ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-bold tracking-tight text-foreground">
          Ingredients
        </h3>
        <span className="text-sm tabular-nums text-muted-foreground">
          {list.length} items
        </span>
      </div>

      <ul className="divide-y divide-border/80 overflow-hidden rounded-xl border border-border/80">
        {list.map((ingredient, idx) => (
          <li key={idx} className="flex items-baseline gap-4 bg-card px-4 py-3">
            <span className="w-20 shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
              {ingredient.amount !== undefined && ingredient.amount !== null
                ? ingredient.amount
                : ""}
              {ingredient.unit ? ` ${ingredient.unit}` : ""}
            </span>
            <span
              className={cn(
                "text-sm leading-snug",
                ingredient.item ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {ingredient.item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientsSection;
