import React from "react";
import { Control, useFieldArray, UseFormReturn } from "react-hook-form";
import { Label } from "../ui/label";
import { ListOrdered, Plus, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

interface ContentRecipeInstructionProps {
  form: UseFormReturn<any>;
  control: Control<any>;
  index: number;
}

const ContentRecipeInstruction = ({
  form,
  control,
  index,
}: ContentRecipeInstructionProps) => {
  const {
    fields: instructionsFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: `contents.${index}.recipe.instructions`,
  });

  return (
    <Card className="border-none bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ListOrdered className="h-4 w-4 text-primary" />
          Instructions
        </CardTitle>
        <CardDescription>
          Step-by-step instructions for preparing this recipe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {instructionsFields.map((instruction, instructionIndex) => (
          <div key={instruction.id} className="flex flex-col gap-2">
            <div className="flex items-end gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <Label>Step {instructionIndex + 1}</Label>
                <Input
                  {...form.register(
                    `contents.${index}.recipe.instructions.${instructionIndex}`,
                  )}
                  type="text"
                  placeholder="e.g. Mix the flour and water together."
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                aria-label="Remove instruction"
                onClick={() => removeInstruction(instructionIndex)}
                type="button"
                className="mb-0.5"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          type="button"
          onClick={() => appendInstruction("")}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Instruction
        </Button>
      </CardContent>
    </Card>
  );
};

export default ContentRecipeInstruction;
