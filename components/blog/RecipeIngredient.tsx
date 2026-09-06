import React from "react";
import { Control, useFieldArray, UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import MeasurementSelect from "../MeasurementSelect";
import { Plus, Trash2, Egg } from "lucide-react";
import { Button } from "../ui/button";

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
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Egg className="h-3.5 w-3.5 text-primary" />
          <span>Ingredients ({ingredientFields.length})</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            appendIngredient({ amount: undefined, measurement: "", name: "" })
          }
          className="h-7 px-2.5 text-xs font-medium rounded-md border-border/80 bg-background/80 hover:bg-accent gap-1"
        >
          <Plus className="h-3 w-3" />
          <span>Add</span>
        </Button>
      </div>

      {ingredientFields.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/70 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            No ingredients added yet. Click &ldquo;Add&rdquo; to add your first ingredient.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {ingredientFields.map((ingredient, ingredientIndex) => (
            <div
              key={ingredient.id}
              className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 p-1.5 sm:p-2"
            >
              <Input
                {...form.register(
                  `contents.${index}.recipe.ingredients.${ingredientIndex}.amount`,
                )}
                placeholder="Qty"
                type="number"
                min={0}
                className="h-8 w-16 sm:w-20 rounded-md text-xs"
              />
              <div className="w-24 sm:w-32">
                <MeasurementSelect
                  form={form}
                  name={`contents.${index}.recipe.ingredients.${ingredientIndex}.measurement`}
                />
              </div>
              <Input
                {...form.register(
                  `contents.${index}.recipe.ingredients.${ingredientIndex}.name`,
                )}
                placeholder="Ingredient name (e.g. Berbere spice)"
                type="text"
                className="h-8 flex-1 rounded-md text-xs"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Remove ingredient"
                onClick={() => removeIngredient(ingredientIndex)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeIngredient;
