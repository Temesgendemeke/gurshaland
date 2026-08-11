"use client";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { formSchema } from "@/utils/schema";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

type FormValues = z.infer<typeof formSchema>;

interface CulturalNoteFieldProps {
  form: UseFormReturn<FormValues>;
}

export default function CulturalNoteField({ form }: CulturalNoteFieldProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          The story behind the dish
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Optional. Share the traditions and memories this recipe carries.
        </p>
      </div>
      <FormField
        control={form.control}
        name="recipe.culturalNote"
        render={({ field }) => (
          <FormItem className="gap-2">
            <FormControl>
              <Textarea
                className="min-h-32 resize-y"
                placeholder="Share the cultural background, family history, or traditional significance of this recipe..."
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
