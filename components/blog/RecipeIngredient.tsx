import React from "react";
import { Control, useFieldArray, UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import MeasurementSelect from "../MeasurementSelect";
import { Plus, X, Egg } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface RecipeIngredientProps {
  form: UseFormReturn<any>;
  control: Control<any>;
  index: number;
}

const RecipeIngredient = ({ form, control, index }: RecipeIngredientProps) => {
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: `contents.${index}.recipe.ingredients`,
  });

  return (
    <div className="flex flex-col gap-2.5 border-l-2 border-primary/20 pl-4">
      <Label className="flex items-center gap-2 font-semibold">
        <Egg className="h-4 w-4 text-primary" />
        Ingredients
      </Label>
      {ingredientFields.map((ingredient, ingredientIndex) => (
        <div key={ingredient.id} className="flex flex-wrap items-center gap-2">
          <Input
            {...form.register(
              `contents.${index}.recipe.ingredients.${ingredientIndex}.amount`,
            )}
            placeholder="Amount (e.g. 2)"
            type="number"
            min={0}
            className="w-24"
          />
          <MeasurementSelect
            form={form}
            name={`contents.${index}.recipe.ingredients.${ingredientIndex}.measurement`}
          />
          <Input
            {...form.register(
              `contents.${index}.recipe.ingredients.${ingredientIndex}.name`,
            )}
            placeholder="Name (e.g. Sugar)"
            type="text"
            className="min-w-40 flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Remove ingredient"
            onClick={() => removeIngredient(ingredientIndex)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() =>
          appendIngredient({ amount: undefined, measurement: "", name: "" })
        }
      >
        <Plus className="h-4 w-4 mr-1.5" />
        Add ingredient
      </Button>
    </div>
  );
};

export default RecipeIngredient;
