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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import measurements from "@/constants/measurements";
import { Ingredient, Instruction } from "@/utils/types/recipe";

interface IngredientsFieldProps {
  form: any;
  ingredientFields: Ingredient[] | any;
  appendIngredient: (ingredient: Omit<Ingredient, "id">) => void;
  removeIngredient: (index: number) => void;
}

export default function IngredientsField({
  form,
  ingredientFields,
  appendIngredient,
  removeIngredient,
}: IngredientsFieldProps) {
  return (
    <Card className="p-6 bg-card/70 border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Ingredients</h2>
        <Button
          onClick={() => appendIngredient({ item: "", amount: 0, notes: "" })}
          type="button"
          variant="outline"
          size="sm"
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Ingredient
        </Button>
      </div>
      <div className="space-y-4">
        {ingredientFields.map((field: Ingredient, index: number) => (
          <div
            className={`flex  ${ingredientFields.length > 1 ? "border-primary/50 border-b p-4" : ""}`}
            key={field.id!}
          >
            <div className="grid flex-grow md:grid-cols-3 gap-4 items-start">
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
                  <FormItem className="">
                    <FormControl>
                      <Input placeholder="Amount (e.g., 2 cups)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`ingredients.${index}.unit`}
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
                  <FormItem className="">
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange({
                            target: {
                              value: value as string,
                            },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {measurements.map((measurement) => (
                            <SelectItem
                              key={measurement.code}
                              value={measurement.code}
                            >
                              {measurement.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  <FormItem className="">
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
                  <FormItem className="md:col-span-3">
                    <FormControl>
                      <Input placeholder="Notes (optional)" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="">
              {ingredientFields.length > 1 && (
                <Button
                  onClick={() => removeIngredient(index)}
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="text-error hover:text-error/80 hover:bg-error/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
