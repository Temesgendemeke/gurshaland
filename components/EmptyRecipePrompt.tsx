import { ChefHat } from "lucide-react";

function EmptyRecipePrompt() {
  return (
    <div className="text-center py-12 text-body-muted">
      <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>
        Enter your ingredients and preferences to generate a personalized
        Ethiopian recipe!
      </p>
    </div>
  );
}

export default EmptyRecipePrompt;
