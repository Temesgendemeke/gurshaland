import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Utensils, Plus, Trash2 } from "lucide-react";
import RecipeIngredient from "./RecipeIngredient";
import ContentRecipeInstruction from "./ContentRecipeInstruction";

interface RecipeFormProps {
  form: any;
  index: number;
}

const RecipeForm = ({ form, index }: RecipeFormProps) => {
  const recipe_name = `contents.${index}.recipe`;
  const isRecipeAttached = Boolean(form.watch(recipe_name));

  if (!isRecipeAttached) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          form.setValue(recipe_name, {
            title: "",
            ingredients: [],
            instructions: [],
          });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            form.setValue(recipe_name, {
              title: "",
              ingredients: [],
              instructions: [],
            });
          }
        }}
        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-dashed border-border/80 bg-card/40 p-4 transition-all hover:border-primary/50 hover:bg-accent/40 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors">
            <Utensils className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              Attach Recipe Card
            </h4>
            <p className="text-xs text-muted-foreground">
              Add ingredients and step-by-step cooking instructions to this section
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-none transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent">
          <Plus className="h-3.5 w-3.5" />
          Add Recipe
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card/60 p-4 sm:p-5 space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Utensils className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="font-gosh text-sm sm:text-base font-semibold text-foreground">
              Section Recipe Card
            </h4>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => form.setValue(recipe_name, undefined)}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md gap-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Remove</span>
        </Button>
      </div>

      {/* Recipe Title Field */}
      <div className="space-y-1.5">
        <Label
          htmlFor={`recipe-title-${index}`}
          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
        >
          Recipe Title
        </Label>
        <Input
          id={`recipe-title-${index}`}
          {...form.register(`${recipe_name}.title`)}
          placeholder="e.g. Spiced Doro Wat"
          className="h-9 text-sm rounded-lg border-border/80 bg-background/80"
        />
      </div>

      {/* Ingredients */}
      <RecipeIngredient form={form} control={form.control} index={index} />

      {/* Instructions */}
      <ContentRecipeInstruction
        form={form}
        control={form.control}
        index={index}
      />
    </div>
  );
};

export default RecipeForm;
