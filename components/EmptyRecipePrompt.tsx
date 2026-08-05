import { ChefHat } from "lucide-react";

function EmptyRecipePrompt() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border-t border-border pt-6 text-center">
      <ChefHat className="w-8 h-8 text-muted-foreground/60" />
      <p className="max-w-xs text-sm text-muted-foreground">
        Enter what you have and we&apos;ll generate a personalized Ethiopian
        recipe.
      </p>
    </div>
  );
}

export default EmptyRecipePrompt;
