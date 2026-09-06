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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type FormValues = z.infer<typeof formSchema>;

interface CulturalNoteFieldProps {
  form: UseFormReturn<FormValues>;
}

export default function CulturalNoteField({ form }: CulturalNoteFieldProps) {
  return (
    <Card className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 shadow-none space-y-5">
      <CardHeader className="p-0 pb-4 border-b border-border/60">
        <CardTitle className="font-gosh text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          The Story Behind the Dish
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          Optional. Share the traditions, history, and memories this recipe carries.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <FormField
          control={form.control}
          name="recipe.culturalNote"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormControl>
                <Textarea
                  className="min-h-32 resize-y rounded-xl border-border/80 bg-background/80 leading-relaxed"
                  placeholder="Share the cultural background, family history, or traditional significance of this recipe..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
