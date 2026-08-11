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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { statuses } from "@/constants/recipe";
import { formSchema } from "@/utils/schema";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { ChefHat } from "lucide-react";

type FormValues = z.infer<typeof formSchema>;

interface StatusFieldProps {
  form: UseFormReturn<FormValues>;
}

export default function StatusField({ form }: StatusFieldProps) {
  return (
    <Card className="border-border bg-card/70">
      <CardHeader className="space-y-2">
        {/* <div className="flex items-center gap-2 text-primary">
          <ChefHat className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Status
          </span>
        </div> */}
        <CardTitle>Publication Status</CardTitle>
        <CardDescription className="text-sm leading-6">
          Control when your recipe is visible to others.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
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
      </CardContent>
    </Card>
  );
}
