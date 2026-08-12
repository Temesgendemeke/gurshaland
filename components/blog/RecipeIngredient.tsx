import React from "react";
import { Control, useFieldArray, UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import MeasurementSelect from "../MeasurementSelect";
import { Plus, X, Egg } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

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
    <Card className="border-none bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Egg className="h-4 w-4 text-primary" />
          Ingredients
        </CardTitle>
        <CardDescription>
          List all the ingredients needed for this recipe with measurements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {ingredientFields.map((ingredient, ingredientIndex) => (
          <div key={ingredient.id} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-end gap-2">
              <div className="flex flex-col gap-1">
                <Label>Amount</Label>
                <Input
                  {...form.register(
                    `contents.${index}.recipe.ingredients.${ingredientIndex}.amount`,
                  )}
                  placeholder="Amount (e.g. 2)"
                  type="number"
                  min={0}
                  className="w-24"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label>Measurement</Label>
                <MeasurementSelect
                  form={form}
                  name={`contents.${index}.recipe.ingredients.${ingredientIndex}.measurement`}
                />
              </div>

              <div className="flex flex-col gap-1 min-w-40 flex-1">
                <Label>Name</Label>
                <Input
                  {...form.register(
                    `contents.${index}.recipe.ingredients.${ingredientIndex}.name`,
                  )}
                  placeholder="Name (e.g. Sugar)"
                  type="text"
                  className=" "
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Remove ingredient"
                onClick={() => removeIngredient(ingredientIndex)}
                className="mb-0.5"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
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
      </CardContent>
    </Card>
  );
};

export default RecipeIngredient;
