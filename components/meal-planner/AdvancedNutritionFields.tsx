import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  heightMeasurements,
  weightMeasurements,
} from "@/constants/measurements";
import type { mealPlannerType } from "@/schema/meal-planner";

const activityLevelOptions = [
  { value: "sedentary", label: "Sedentary (little to no exercise)" },
  { value: "light", label: "Light (light exercise 1-3 days/week)" },
  { value: "moderate", label: "Moderate (moderate exercise 3-5 days/week)" },
  { value: "very_active", label: "Very Active (hard exercise 6-7 days/week)" },
  { value: "extra_active", label: "Extra Active (physical job or 2x/day)" },
];

interface AdvancedNutritionFieldsProps {
  form: UseFormReturn<mealPlannerType>;
  fieldClasses?: string;
}

export default function AdvancedNutritionFields({
  form,
  fieldClasses = "h-11 rounded-xl border bg-background",
}: AdvancedNutritionFieldsProps) {
  return (
    <Collapsible className="group">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          Advanced nutrition & body metrics
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* Age */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g., 25"
                    className={`${fieldClasses} text-base`}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value, 10) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormDescription>Leave empty for AI to suggest</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className={`${fieldClasses} hover:border-primary/60`}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Leave empty for AI to suggest</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Height */}
          <div className="space-y-2">
            <FormLabel>Height</FormLabel>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="height.value"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Value"
                        className={`${fieldClasses} text-base`}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height.unit"
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className={`${fieldClasses} hover:border-primary/60`}>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {heightMeasurements.map((m) => (
                            <SelectItem key={m.code} value={m.code}>
                              {m.code} ({m.name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormDescription>Leave empty for AI to suggest</FormDescription>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <FormLabel>Weight</FormLabel>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="weight.value"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Value"
                        className={`${fieldClasses} text-base`}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight.unit"
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className={`${fieldClasses} hover:border-primary/60`}>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {weightMeasurements.map((m) => (
                            <SelectItem key={m.code} value={m.code}>
                              {m.code} ({m.name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormDescription>Leave empty for AI to suggest</FormDescription>
          </div>

          {/* Activity Level */}
          <FormField
            control={form.control}
            name="activity_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity level</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className={`${fieldClasses} hover:border-primary/60`}>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityLevelOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Your general daily physical exertion
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Calorie Target */}
          <FormField
            control={form.control}
            name="calories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daily calorie target</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={800}
                    max={5000}
                    placeholder="e.g., 2000"
                    className={`${fieldClasses} text-base`}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Leave empty for AI to suggest</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
