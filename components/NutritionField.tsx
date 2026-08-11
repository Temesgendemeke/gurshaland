"use client";

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
  FormLabel,
} from "@/components/ui/form";
import { formSchema } from "@/utils/schema";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Apple } from "lucide-react";

type FormValues = z.infer<typeof formSchema>;

interface NutritionFieldProps {
  form: UseFormReturn<FormValues>;
}

export default function NutritionField({ form }: NutritionFieldProps) {
  return (
    <Card className="border-border bg-card/70">
      <CardHeader className="space-y-2">
        {/* <div className="flex items-center gap-2 text-primary">
          <Apple className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Nutrition
          </span>
        </div> */}
        <CardTitle>Nutrition</CardTitle>
        <CardDescription className="text-sm leading-6">
          Estimated nutritional information per serving.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
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
      </CardContent>
    </Card>
  );
}
