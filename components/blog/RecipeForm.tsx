import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useFieldArray } from "react-hook-form";
import { Label } from "../ui/label";
import { ChefHat, Plus, Trash } from "lucide-react";
import RecipeIngredient from "./RecipeIngredient";
import ContentRecipeInstruction from "./ContentRecipeInstruction";

interface RecipeFormProps {
  form: any;
  index: number;
}

const RecipeForm = ({ form, index }: RecipeFormProps) => {
  const recipe_name = `contents.${index}.recipe`;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/70 bg-muted/20 p-4">
      <Label className="flex items-center gap-2 font-semibold">
        <ChefHat className="h-4 w-4 text-primary" />
        Recipe
      </Label>

      {form.watch(recipe_name) && (
        <div className="flex flex-col gap-3">
          <Input
            {...form.register(`${recipe_name}.title`)}
            placeholder="Recipe title (e.g. Spiced Doro Wat)"
            type="text"
          />

          {/* ingredients */}
          <RecipeIngredient form={form} control={form.control} index={index} />

          {/* instructions */}
          <ContentRecipeInstruction
            form={form}
            control={form.control}
            index={index}
          />
        </div>
      )}

      {!form.watch(recipe_name) ? (
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            form.setValue(recipe_name, {
              title: "",
              ingredients: [],
              instructions: [],
            });
          }}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Recipe
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() => form.setValue(recipe_name, undefined)}
          variant="outline"
          size="sm"
          className="w-full text-error hover:text-error"
        >
          <Trash className="h-4 w-4 mr-2" />
          Remove Recipe
        </Button>
      )}
    </div>
  );
};

export default RecipeForm;
