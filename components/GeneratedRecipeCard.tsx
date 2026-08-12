import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, Eye, Save, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSaveAIRecipe } from "@/hooks/useSaveAIRecipe";
import { useRecipeDetailStore } from "@/store/Recipedetail";

export default function GeneratedRecipeCard({ recipe }: { recipe: any }) {
  const router = useRouter();
  const { saveAndNavigate, isSaving } = useSaveAIRecipe();
  const setPreviewRecipe = useRecipeDetailStore((state) => state.setPreviewRecipe);

  const handlePreview = () => {
    setPreviewRecipe(recipe);
    sessionStorage.setItem("recipe_preview", JSON.stringify(recipe));
    router.push("/recipes/preview");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg sm:text-xl font-bold heading-primary">
          {recipe.title}
        </h3>
        <Badge className="bg-muted text-muted-foreground">AI Generated</Badge>
      </div>
      <div>
        <Image
          width={400}
          height={300}
          src={recipe.image?.url ?? "/placeholder.jpg"}
          alt={recipe.title}
          className="object-cover w-full h-44 sm:h-52 rounded-lg"
        />
      </div>
      <p className="text-sm text-body">{recipe.description}</p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-body-muted">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{recipe.cooktime}</span>
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
          {recipe?.ingredients?.map(
            (
              ingredient: { amount: number; unit: string; item: string },
              idx: number,
            ) => (
              <li key={idx} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span>
                  {ingredient.amount} {ingredient.unit} {ingredient.item}
                </span>
              </li>
            ),
          )}
          {recipe?.ingredients?.length > 4 && (
            <li className="text-body-muted text-xs">
              + {recipe?.ingredients?.length - 4} more ingredients
            </li>
          )}
        </ul>
      </div>
      <div className="flex flex-wrap gap-2 pt-4">
        <Button
          variant="outline"
          onClick={handlePreview}
          disabled={isSaving}
          className="flex-1 gap-2"
        >
          <Eye className="h-4 w-4" />
          View Preview
        </Button>
        <Button
          onClick={() => saveAndNavigate({ recipe })}
          disabled={isSaving}
          className="flex-1 gap-2"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Recipe
            </>
          )}
        </Button>
      </div>
    </div>
  );
}