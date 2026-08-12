"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { formSchema } from "@/utils/schema";
import { z } from "zod";
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormReturn,
} from "react-hook-form";

type FormValues = z.infer<typeof formSchema>;

interface IngredientsFieldProps {
  form: UseFormReturn<FormValues>;
  ingredientFields: FieldArrayWithId<FormValues, "ingredients">[];
  appendIngredient: UseFieldArrayAppend<FormValues, "ingredients">;
  removeIngredient: UseFieldArrayRemove;
}

export default function IngredientsField({
  form,
  ingredientFields,
  appendIngredient,
  removeIngredient,
}: IngredientsFieldProps) {
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
        <CardDescription>What you&apos;ll need to make it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {ingredientFields.map((field, index) => (
          <div key={field.id} className="space-y-3">
            <div className="flex gap-3">
              <div className="grid flex-1 gap-3 md:grid-cols-[7rem_9rem_minmax(0,1fr)]">
                <FormField
                  control={form.control}
                  name={`ingredients.${index}.amount`}
                  render={({ field }) => (
                    <FormItem className="gap-2">
                      <FormControl>
                        <Input
                          className="h-11"
                          placeholder="Amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`ingredients.${index}.unit`}
                  render={({ field }) => (
                    <FormItem className="gap-2">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
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
                  render={({ field }) => (
                    <FormItem className="gap-2">
                      <FormControl>
                        <Input
                          className="h-11"
                          placeholder="Ingredient name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {ingredientFields.length > 1 && (
                <Button
                  onClick={() => removeIngredient(index)}
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-11 w-11 shrink-0 self-start text-muted-foreground hover:bg-error/10 hover:text-error"
                  aria-label={`Remove ingredient ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name={`ingredients.${index}.notes`}
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormControl>
                    <Input
                      className="h-11"
                      placeholder="Notes (optional)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => appendIngredient({ item: "", amount: 0, notes: "" })}
          className="w-full border-dashed border-primary/40 text-primary hover:border-primary hover:bg-primary/5 active:scale-[0.99]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Ingredient
        </Button>
      </CardContent>
    </Card>
  );
}
