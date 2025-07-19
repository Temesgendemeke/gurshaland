import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useFieldArray } from "react-hook-form";
import { Label } from "../ui/label";
import { ChefHat, Minus, NotepadTextIcon, Plus, Trash, X } from "lucide-react";
import RecipeIngredient from "./RecipeIngredient";
import ContentRecipeInstruction from "./ContentRecipeInstruction";

interface RecipeFormProps {
  form: any;
  index: number;
}

const RecipeForm = ({ form, index }: RecipeFormProps) => {
  const recipe_name = `content.${index}.recipe`;
  return (
    <div className="space-y-2  p-4 border rounded-lg bg-background/50">
      <Label className="flex items-center gap-2">
        <NotepadTextIcon className="h-4 w-4" />
        Recipes
      </Label>
      {form.watch(`content.${index}.recipe`) && (
        <div className="space-y-4">
          <Input
            {...form.register(`content.${index}.recipe.title`)}
            placeholder="Example: Chocolate Cake"
            className=""
            type="text"
          />

          {/* ingredients */}
          <RecipeIngredient form={form} control={form.control} index={index} />

          {/* instruction */}
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
              ingredients: { amount: undefined, measurement: "", name: "" },
              instructions: [],
            });
          }}
          variant={"outline"}
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
          variant={`outline`}
          size="sm"
          className="w-full"
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete Recipe
        </Button>
      )}
    </div>
  );
};

export default RecipeForm;
