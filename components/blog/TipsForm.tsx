"use client";

import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Plus, Trash } from "lucide-react";
import TipItems from "./TipItem";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface TipsFormProps {
  form: ReturnType<typeof useForm<any>>;
  index: number;
}

const TipsForm = ({ form, index }: TipsFormProps) => {
  const tips_name = `contents.${index}.tips`;

  return (
    <div className="flex flex-col gap-3">
      {form.watch(tips_name) ? (
        <>
          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base font-semibold">Tips Section</CardTitle>
                <CardDescription className="text-sm">
                  Add helpful tips and tricks for your readers
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="flex flex-col gap-2">
                <CardTitle className="text-sm font-medium">
                  Title
                </CardTitle>
                <Input
                  id={`tips-title-${index}`}
                  {...form.register(`${tips_name}.title`)}
                  placeholder="Tips title (optional)"
                  className="h-9"
                />
              </div>
              <div className="flex flex-col gap-2">
                <CardDescription className="text-sm font-medium">
                  Description
                </CardDescription>
                <Textarea
                  id={`tips-description-${index}`}
                  {...form.register(`${tips_name}.description`)}
                  placeholder="Brief description (optional)"
                  rows={2}
                  className="h-20"
                />
              </div> */}
              <TipItems contentIndex={index} control={form.control} />
            </CardContent>
          </Card>
          <Button
            type="button"
            onClick={() => form.setValue(tips_name, undefined)}
            variant="ghost"
            size="sm"
            className="w-full text-error hover:text-error justify-start gap-2"
          >
            <Trash className="h-4 w-4" />
            Remove Tips
          </Button>
        </>
      ) : (
        <Button
          type="button"
          onClick={() => form.setValue(tips_name, { title: "", description: "", items: [] })}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Tips
        </Button>
      )}
    </div>
  );
};

export default TipsForm;
