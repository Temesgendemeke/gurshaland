import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { CircleDashed } from "lucide-react";

const StatusSelect = ({ form }: { form: UseFormReturn<any> }) => {
  return (
    <Card className="rounded-xl border-border/70 shadow-[0_1px_2px_hsl(215_15%_10%/0.04)]">
      <CardHeader className="border-b border-border/60">
        <CardTitle className="flex items-center gap-3 text-lg">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CircleDashed className="h-4 w-4" />
          </span>
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
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.status?.message &&
          typeof form.formState.errors.status.message === "string" && (
            <p className="text-sm text-error">
              {form.formState.errors.status.message}
            </p>
          )}
      </CardContent>
    </Card>
  );
};

export default StatusSelect;
