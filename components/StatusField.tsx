"use client";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statuses } from "@/constants/recipe";
import { formSchema } from "@/utils/schema";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

type FormValues = z.infer<typeof formSchema>;

interface StatusFieldProps {
  form: UseFormReturn<FormValues>;
}

export default function StatusField({ form }: StatusFieldProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Publication status
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Control when your recipe is visible to others.
        </p>
      </div>
      <FormField
        control={form.control}
        name="recipe.status"
        render={({ field }) => (
          <FormItem className="gap-2">
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-11 w-full bg-background">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-background">
                  {statuses.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
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
  );
}
