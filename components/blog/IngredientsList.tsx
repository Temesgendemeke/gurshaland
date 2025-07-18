import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChefHat, Minus, Plus } from "lucide-react";

interface IngredientListProps {
  form: UseFormReturn<any>;
  index: number;
}
const IngredientsList = ({ form, index }: IngredientListProps) => {
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: `content.${index}.ingredients`,
  });

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <ChefHat className="h-4 w-4" />
        Ingredients
      </Label>
      {ingredientFields.map((ingredient, ingredientIndex) => (
        <div key={ingredient.id} className="flex gap-2">
          <Input
            {...form.register(
              `content.${index}.ingredients.${ingredientIndex}.amount`
            )}
            placeholder="Amount"
            className="w-24"
            type="number"
          />
          <Input
            {...form.register(
              `content.${index}.ingredients.${ingredientIndex}.name`
            )}
            placeholder="Ingredient name"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => removeIngredient(ingredientIndex)}
            variant="outline"
            size="sm"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => appendIngredient({ name: "", amount: "" })}
        variant="outline"
        size="sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Ingredient
      </Button>
    </div>
  );
};

export default IngredientsList;
