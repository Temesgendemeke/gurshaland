"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface IngredientField {
  id: string;
  item: string;
  amount: string;
  notes: string;
}

interface IngredientsFieldProps {
  form: any; 
  ingredientFields: IngredientField[] | any;
  appendIngredient: (ingredient: Omit<IngredientField, "id">) => void;
  removeIngredient: (index: number) => void;
}

export default function IngredientsField({
  form,
  ingredientFields,
  appendIngredient,
  removeIngredient,
}: IngredientsFieldProps) {
  return (
    <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Ingredients
        </h2>
        <Button
          onClick={() => appendIngredient({ item: "", amount: "", notes: "" })}
          type="button"
          variant="outline"
          size="sm"
          className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Ingredient
        </Button>
      </div>
      <div className="space-y-4">
        {ingredientFields.map(
          (
            field: IngredientField,
            index: number
          ) => (
            <div
              key={field.id}
              className="grid md:grid-cols-12 gap-4 items-start"
            >
              <FormField
          control={form.control}
          name={`ingredients.${index}.amount`}
          render={({
            field,
          }: {
            field: {
              name: string;
              value: string;
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
              onBlur: () => void;
              ref: React.Ref<HTMLInputElement>;
            };
          }) => (
            <FormItem className="md:col-span-3">
              <FormControl>
                <Input placeholder="Amount (e.g., 2 cups)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
              />
              <FormField
          control={form.control}
          name={`ingredients.${index}.item`}
          render={({
            field,
          }: {
            field: {
              name: string;
              value: string;
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
              onBlur: () => void;
              ref: React.Ref<HTMLInputElement>;
            };
          }) => (
            <FormItem className="md:col-span-4">
              <FormControl>
                <Input placeholder="Ingredient name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
              />
              <FormField
          control={form.control}
          name={`ingredients.${index}.notes`}
          render={({
            field,
          }: {
            field: {
              name: string;
              value: string;
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
              onBlur: () => void;
              ref: React.Ref<HTMLInputElement>;
            };
          }) => (
            <FormItem className="md:col-span-4">
              <FormControl>
                <Input placeholder="Notes (optional)" {...field} />
              </FormControl>
            </FormItem>
          )}
              />
              <div className="md:col-span-1">
          {ingredientFields.length > 1 && (
            <Button
              onClick={() => removeIngredient(index)}
              variant="ghost"
              size="sm"
              type="button"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
              </div>
            </div>
          )
        )}
      </div>
    </Card>
  );
}
