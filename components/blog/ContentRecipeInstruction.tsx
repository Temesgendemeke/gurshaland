import React from "react";
import { Control, useFieldArray, UseFormReturn } from "react-hook-form";
import { Label } from "../ui/label";
import { ListOrdered, Plus, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
    <div className="flex flex-col gap-2.5 border-l-2 border-primary/20 pl-4">
      <Label className="flex items-center gap-2 font-semibold">
        <ListOrdered className="h-4 w-4 text-primary" />
        Instructions
      </Label>
      {instructionsFields.map((instruction, instructionIndex) => (
        <div className="flex items-center gap-2" key={instruction.id}>
          <Input
            {...form.register(
              `contents.${index}.recipe.instructions.${instructionIndex}`,
            )}
            type="text"
            placeholder="e.g. Mix the flour and water together."
          />
          <Button
            variant="outline"
            size="icon"
            aria-label="Remove instruction"
            onClick={() => removeInstruction(instructionIndex)}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
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
    </div>
  );
};

export default ContentRecipeInstruction;
