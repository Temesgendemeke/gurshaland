import { Check } from "lucide-react";

const IngredientsSection = ({ ingredients }: { ingredients: any[] }) => {
  return (
    <div className="space-y-4">
      <h3 className="heading-secondary text-xl md:text-2xl border-b border-border pb-3">
        Ingredients
      </h3>
      <div className="space-y-2">
        {ingredients?.map((ingredient, idx: number) => (
          <div
            key={idx}
            className="flex items-start gap-3 rounded-lg border border-border/60 bg-card px-3.5 py-2.5"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Check className="h-3 w-3" />
            </span>
            <span className="text-sm leading-relaxed text-muted-foreground">
              {ingredient.amount ? (
                <span className="font-semibold text-foreground">
                  {ingredient.amount}
                </span>
              ) : null}{" "}
              {ingredient.unit ? (
                <span className="font-medium text-foreground">
                  {ingredient.unit}
                </span>
              ) : null}{" "}
              {ingredient.item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsSection;
