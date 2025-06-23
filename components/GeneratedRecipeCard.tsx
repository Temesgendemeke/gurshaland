import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, Users } from "lucide-react";

export default function GeneratedRecipeCard({ recipe }: { recipe: any }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold heading-primary">{recipe.title}</h3>
        <Badge className="bg-emerald-100 text-emerald-700">AI Generated</Badge>
      </div>
      <p className="text-body text-sm">{recipe.description}</p>
      <div className="flex items-center space-x-4 text-sm text-body-muted">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{recipe.cookTime}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>{recipe.servings} servings</span>
        </div>
        <Badge variant="secondary">{recipe.difficulty}</Badge>
      </div>
      <div className="space-y-3">
        <h4 className="font-semibold text-body">Ingredients:</h4>
        <ul className="text-sm text-body space-y-1">
          {recipe.ingredients
            .slice(0, 4)
            .map((ingredient: string, idx: number) => (
              <li key={idx} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>{ingredient}</span>
              </li>
            ))}
          {recipe.ingredients.length > 4 && (
            <li className="text-body-muted text-xs">
              + {recipe.ingredients.length - 4} more ingredients
            </li>
          )}
        </ul>
      </div>
      <div className="flex gap-2 pt-4">
        <Button size="sm" className="btn-primary-modern flex-1">
          View Full Recipe
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          Save Recipe
        </Button>
      </div>
    </div>
  );
}
