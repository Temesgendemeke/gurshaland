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
  FormLabel,
} from "@/components/ui/form";

interface NutritionField {
  id: string;
  item: string;
  amount: string;
  notes: string;
  calories: number;
}

interface NutritionFieldProps {
  form: any;
}

export default function NutritionField({ form }: NutritionFieldProps) {
  return (
    <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Nutrition
        </h2>
      </div>

      <div className="space-y-6 gap-x-1.5 grid md:grid-cols-2">
        <FormField
          control={form.control}
          name={`nutrition.calories`}
          render={({ field }) => (
        <FormItem className="col-span-2">
          <FormLabel>Calories (g)</FormLabel>
          <FormControl>
            <Input
          
          type="number"
          {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`nutrition.protein`}
          render={({ field }) => (
        <FormItem>
          <FormLabel>Protein (g)</FormLabel>
          <FormControl>
            <Input
          
          type="number"
          {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`nutrition.carbs`}
          render={({ field }) => (
        <FormItem>
          <FormLabel>Carbs (g)</FormLabel>
          <FormControl>
            <Input placeholder="" type="number" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`nutrition.fat`}
          render={({ field }) => (
        <FormItem>
          <FormLabel>Fat (g)</FormLabel>
          <FormControl>
            <Input placeholder="" type="number" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`nutrition.fiber`}
          render={({ field }) => (
        <FormItem>
            <FormLabel>Fiber (g)</FormLabel>
            <span className="ml-2 text-xs text-gray-500">(g)</span>
            <FormControl>
            <Input placeholder="" type="number" {...field} />
            </FormControl>
          <FormMessage />
        </FormItem>
          )}
        />
        <div className="col-span-2">
          <p className="mt-2">
            Note: Calories must be entered in grams (g).
          </p>
        </div>
      </div>
    </Card>
  );
}
