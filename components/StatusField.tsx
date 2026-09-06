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
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "./ui/card";

type FormValues = z.infer<typeof formSchema>;

interface StatusFieldProps {
  form: UseFormReturn<FormValues>;
}

export default function StatusField({ form }: StatusFieldProps) {
  return (
    <Card className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 shadow-none space-y-5">
      <CardHeader className="p-0 pb-4 border-b border-border/60">
        <CardTitle className="font-gosh text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Publication & Visibility
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          Control when your recipe is visible to the Gurshaland community.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <FormField
          control={form.control}
          name="recipe.status"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-border/80 bg-background/80">
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
      </CardContent>
    </Card>
  );
}
