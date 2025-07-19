import React from "react";
import { Controller, useFormContext, UseFormReturn } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { ChefHat } from "lucide-react";


const StatusSelect = ({form}:{form: UseFormReturn<any>}) => {
  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Controller
          name="status"
          control={form.control}
          render={({ field }) => (
            <Select
              defaultValue="draft"
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.status?.message && typeof form.formState.errors.status.message === "string" && (
          <p className="text-sm text-red-500">
            {form.formState.errors.status.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusSelect;
