"use client";

import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { NotebookPen, Plus, Trash } from "lucide-react";
import TipItems from "./TipItem";

interface TipsFormProps {
  form: ReturnType<typeof useForm<any>>;
  index: number;
}

const TipsForm = ({ form, index }: TipsFormProps) => {
  const tips_name = `contents.${index}.tips`;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/70 p-4">
      <div className="flex flex-col gap-1">
        <Label className="flex items-center gap-2 font-semibold text-base">
          {/* <NotebookPen className="h-4 w-4 text-primary" /> */}
          Tips Section
        </Label>
        <p className="text-sm text-muted-foreground">
          Add helpful tips and tricks for your readers
        </p>
      </div>

      {form.watch(tips_name) && (
        <div className="flex flex-col gap-4">
          <TipItems contentIndex={index} control={form.control} />
        </div>
      )}

      {form.watch(tips_name) ? (
        <Button
          type="button"
          onClick={() => form.setValue(tips_name, undefined)}
          variant="outline"
          size="sm"
          className="w-full text-error hover:text-error"
        >
          <Trash className="h-4 w-4 mr-2" />
          Remove Tips
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() => form.setValue(tips_name, { title: "", items: [] })}
          variant="outline"
          size="sm"
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
