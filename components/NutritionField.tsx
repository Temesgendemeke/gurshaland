"use client";

import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { formSchema } from "@/utils/schema";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

type FormValues = z.infer<typeof formSchema>;

interface NutritionFieldProps {
  form: UseFormReturn<FormValues>;
}

export default function NutritionField({ form }: NutritionFieldProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Nutrition</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Estimated per serving.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="nutrition.calories"
          render={({ field }) => (
            <FormItem className="gap-2 sm:col-span-2">
              <FormLabel>Calories (kcal)</FormLabel>
              <FormControl>
                <Input
                  className="h-11"
                  type="number"
                  placeholder="e.g., 350"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nutrition.protein"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Protein (g)</FormLabel>
              <FormControl>
                <Input
                  className="h-11"
                  type="number"
                  placeholder="0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nutrition.carbs"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Carbs (g)</FormLabel>
              <FormControl>
                <Input
                  className="h-11"
                  type="number"
                  placeholder="0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nutrition.fat"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Fat (g)</FormLabel>
              <FormControl>
                <Input
                  className="h-11"
                  type="number"
                  placeholder="0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nutrition.fiber"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Fiber (g)</FormLabel>
              <FormControl>
                <Input
                  className="h-11"
                  type="number"
                  placeholder="0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
