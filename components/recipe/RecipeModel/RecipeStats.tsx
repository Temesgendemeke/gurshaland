import { CookingPot, Gauge, Timer, Users } from "lucide-react";

interface Stats {
  prepTime?: number;
  cooktime?: number;
  servings?: number;
  difficulty?: string;
}

const RecipeStats = ({ stats }: { stats: Stats }) => {
  const items = [
    {
      icon: Timer,
      label: "Prep",
      value: stats.prepTime !== undefined ? `${stats.prepTime}m` : null,
    },
    {
      icon: CookingPot,
      label: "Cook",
      value: stats.cooktime !== undefined ? `${stats.cooktime}m` : null,
    },
    {
      icon: Users,
      label: "Servings",
      value: stats.servings !== undefined ? stats.servings : null,
    },
    {
      icon: Gauge,
      label: "Difficulty",
      value: stats.difficulty || null,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-card px-3 py-4 text-center"
          >
            <Icon className="h-5 w-5 text-primary" />
            <p className="text-lg font-bold text-foreground">
              {item.value ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default RecipeStats;
