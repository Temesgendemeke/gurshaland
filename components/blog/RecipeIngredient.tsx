import React from "react";
import { Control, useFieldArray, UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import MeasurementSelect from "../MeasurementSelect";
import { Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Egg } from "lucide-react";

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
  } = useFieldArray({ control, name: `content.${index}.recipe.ingredients` });

  return (
    <div className="space-y-4 ml-4 border-l-2 pl-2 ">
      <Label className="flex gap-2">
        <Egg className="h-4 w-4" />
        Ingrediens
      </Label>
      {ingredientFields.map((ingredient, ingredientIndex) => (
        <div key={ingredient.id} className="flex gap-2 ">
          <Input
            {...form.register(
              `content.${index}.recipe.ingredients.${ingredientIndex}.amount`
            )}
            placeholder="Amount (e.g., 2)"
            type="number"
            min={0}
            className="w-24"
          />
          <MeasurementSelect
            form={form}
            name={`content.${index}.recipe.ingredients.${ingredientIndex}.measurement`}
          />
          <Input
            {...form.register(
              `content.${index}.recipe.ingredients.${ingredientIndex}.name`
            )}
            placeholder="name: e.g., Sugar"
            type="text"
          />
          <Button
            type="button"
            variant={"outline"}
            onClick={() =>
              removeIngredient(ingredientIndex)
            }
          >
            <X className="w-4 h-4"/>
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant={"outline"}
        onClick={() =>
          appendIngredient({ amount: undefined, measurement: "", name: "" })
        }
      >
        <Plus />
        Add Ingredinent
      </Button>
    </div>
  );
};

export default RecipeIngredient;
