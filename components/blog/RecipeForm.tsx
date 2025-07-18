import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useFieldArray } from "react-hook-form";
import { Label } from "../ui/label";
import { ChefHat, Minus, NotepadTextIcon, Plus } from "lucide-react";
import RecipeIngredient from "./RecipeIngredient";
import ContentRecipeInstruction from "./ContentRecipeInstruction";

interface RecipeFormProps {
  form: any;
  index: number;
}

const RecipeForm = ({ form, index }: RecipeFormProps) => {
  const {
    fields: recipeFields,
    append: appendRecipe,
    remove: removeRecipe,
  } = useFieldArray({ control: form.control, name: `content.${index}.tips` });

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: `content.${index}.tip.item`,
  });
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <NotepadTextIcon className="h-4 w-4" />
        Recipes
      </Label>
      {recipeFields.map((recipe, recipeIndex) => (
        <div key={recipe.id} className="space-y-4">
          <Input
            {...form.register(
              `content.${index}.ingredients.${recipeIndex}.title`
            )}
            placeholder="Example: Chocolate Cake"
            className=""
            type="text"
          />

          {/* ingredients */}
          <RecipeIngredient form={form} control={form.control} index={index} />

          {/* instruction */}
          <ContentRecipeInstruction form={form} control={form.control} index={index}/>


          <Input
            {...form.register(
              `content.${index}.ingredients.${recipeIndex}.instructions`
            )}
            placeholder="Ingredient name"
            className="flex-1"
          />

          <Button
            type="button"
            onClick={() => removeRecipe(recipeIndex)}
            variant={"outline"}
            size="sm"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        onClick={() => appendRecipe({ title: "", item: [] })}
        variant={"outline"}
        size="sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Recipe
      </Button>
    </div>
  );
};

export default RecipeForm;
