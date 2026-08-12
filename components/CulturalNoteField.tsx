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
    <Card className="space-y-4  border-none">
      <CardHeader className="">
        <CardTitle>The story behind the dish</CardTitle>
        <CardDescription>
          Optional. Share the traditions and memories this recipe carries.
        </CardDescription>
      </CardHeader>
      <CardContent className="">
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
      </CardContent>
    </Card>
  );
}
