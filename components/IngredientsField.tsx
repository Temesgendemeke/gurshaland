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
    <Card className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 shadow-none space-y-6">
      <CardHeader className="p-0 pb-4 border-b border-border/60">
        <CardTitle className="font-gosh text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Ingredients
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          What you&apos;ll need to make it, with precise amounts and units.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-5">
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
                          value={field.value ?? ""}
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
                          value={field.value || undefined}
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
                          value={field.value ?? ""}
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
                      value={field.value ?? ""}
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
          className="w-full h-10 rounded-xl border border-dashed border-border/80 bg-background/50 hover:bg-accent hover:border-primary/50 text-foreground font-medium text-xs sm:text-sm active:scale-[0.99] gap-1.5"
        >
          <Plus className="h-4 w-4 text-primary" />
          <span>Add Ingredient</span>
        </Button>
      </CardContent>
    </Card>
  );
}
