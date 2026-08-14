import { cn } from "@/lib/utils";

interface Stats {
  prepTime?: number;
  cooktime?: number;
  servings?: number;
  difficulty?: string;
}

const RecipeStats = ({ stats }: { stats: Stats }) => {
  const items = [
    {
      label: "Prep",
      value:
        stats.prepTime !== undefined && stats.prepTime !== null
          ? `${stats.prepTime} min`
          : null,
    },
    {
      label: "Cook",
      value:
        stats.cooktime !== undefined && stats.cooktime !== null
          ? `${stats.cooktime} min`
          : null,
    },
    {
      label: "Serves",
      value: stats.servings !== undefined && stats.servings !== null
        ? stats.servings
        : null,
    },
    {
      label: "Difficulty",
      value: stats.difficulty || null,
    },
  ];

  return (
    <dl className="grid grid-cols-2 sm:grid-cols-4">
      {items.map((item, idx) => (
        <div
          key={item.label}
          className={cn(
            "py-3.5 sm:px-5 sm:first:pl-0 sm:last:pr-0",
            idx % 2 === 1 && "border-l border-border pl-5",
            idx > 1 && "border-t border-border sm:border-t-0",
          )}
        >
          <dt className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">
            {item.label}
          </dt>
          <dd className="mt-1 text-base font-semibold tracking-tight text-foreground">
            {item.value ?? "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default RecipeStats;
