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
  } = useFieldArray({ control, name: `content.${index}.recipe.instructions` });

  return (
    <div className="space-y-4 ml-4 border-l-2 pl-2 ">
      <Label className="flex gap-2">
        <ListOrdered className="w-4 h-4" />
        Instructions
      </Label>
      {instructionsFields.map((instruction, instructionIndex) => (
        <div className="flex items-center  gap-2" key={instruction.id}>
          <Input
            {...form.register(
              `content.${index}.recipe.instructions.${instructionIndex}`
            )}
            type="text"
            placeholder="e.g. Mix the flour and water together."
          />

          <Button
            variant={"outline"}
            onClick={() => removeInstruction(instructionIndex)}
            type="button"
          >
            <X className="" />
          </Button>
        </div>
      ))}
      <Button
        variant={"outline"}
        className="flex"
        type="button"
        onClick={() => appendInstruction("")}
      >
        <Plus className="w-4 h-4" />
        Add Instruction
      </Button>
    </div>
  );
};

export default ContentRecipeInstruction;
