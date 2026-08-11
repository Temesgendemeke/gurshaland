"use client";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formSchema } from "@/utils/schema";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { BookOpen } from "lucide-react";

type FormValues = z.infer<typeof formSchema>;

interface CulturalNoteFieldProps {
  form: UseFormReturn<FormValues>;
}

export default function CulturalNoteField({ form }: CulturalNoteFieldProps) {
  return (
    <Card className="border-border bg-card/70">
      <CardHeader className="space-y-2">
        {/* <div className="flex items-center gap-2 text-primary">
          <BookOpen className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Cultural Significance
          </span>
        </div> */}
        <CardTitle>The Story Behind the Dish</CardTitle>
        <CardDescription className="text-sm leading-6">
          Optional. Share the traditions and memories this recipe carries.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="recipe.culturalNote"
          render={({ field }) => (
            <FormItem className="gap-2">
              {/* <FormLabel>Story and cultural context</FormLabel> */}
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
      </CardContent>
    </Card>
  );
}
