"use client";

import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useFieldArray, useForm, Control } from "react-hook-form";
import { Label } from "../ui/label";
import { NotebookPen, Plus, Trash, X } from "lucide-react";
import TipItems from "./TipItem";

interface TipsFormProps {
  form: ReturnType<typeof useForm<any>>;
  index: number;
}
const TipsForm = ({ form, index }: TipsFormProps) => {
  const tips_name = `content.${index}.tips`;

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background/50">
      <Label className="flex items-center gap-2 font-semibold text-base">
        <NotebookPen className="h-5 w-5" />
        Tips Section
      </Label>
      {form.watch(tips_name) && (
        <div className={`p-4 bg-background rounded-md space-y-3 border`}>
          <div className="flex items-center gap-2">
            <Input
              {...form.register(`content.${index}.tips.title`)}
              placeholder="Tip Title (e.g., 'Pro Tips for Perfect Injera')"
              className="flex-1 font-medium"
            />
            <Button
              type="button"
              onClick={() => form.setValue(tips_name, undefined)}
              variant={"ghost"}
              size="icon"
              className="h-9 w-9 shrink-0"
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>

          <TipItems contentIndex={index} control={form.control} />
        </div>
      )}
      {form.watch(tips_name) ? (
        <Button
          type="button"
          onClick={() => form.setValue(tips_name, undefined)}
          variant={"outline"}
          className="w-full"
        >
          <Trash className="h-4 w-4 mr-2" />
          Remove Tips
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() => form.setValue(tips_name, { title: "", items: [] })}
          variant={"outline"}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tips
        </Button>
      )}
    </div>
  );
};

export default TipsForm;
