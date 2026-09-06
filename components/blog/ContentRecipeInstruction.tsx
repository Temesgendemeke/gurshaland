import React from "react";
import { Control, useFieldArray, UseFormReturn } from "react-hook-form";
import { ListOrdered, Plus, Trash2 } from "lucide-react";
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
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <ListOrdered className="h-3.5 w-3.5 text-primary" />
          <span>Instructions ({instructionsFields.length})</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendInstruction("")}
          className="h-7 px-2.5 text-xs font-medium rounded-md border-border/80 bg-background/80 hover:bg-accent gap-1"
        >
          <Plus className="h-3 w-3" />
          <span>Add Step</span>
        </Button>
      </div>

      {instructionsFields.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/70 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            No steps added yet. Click &ldquo;Add Step&rdquo; to add preparation steps.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {instructionsFields.map((instruction, instructionIndex) => (
            <div
              key={instruction.id}
              className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 p-1.5 sm:p-2"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border/80 bg-muted/60 text-xs font-bold text-muted-foreground">
                {instructionIndex + 1}
              </span>
              <Input
                {...form.register(
                  `contents.${index}.recipe.instructions.${instructionIndex}`,
                )}
                type="text"
                placeholder="e.g. Sauté onions in spiced butter until translucent..."
                className="h-8 flex-1 rounded-md text-xs"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Remove instruction"
                onClick={() => removeInstruction(instructionIndex)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentRecipeInstruction;
