import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { List, Minus, Plus } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";

interface InstructionListProps{
    form: UseFormReturn<any>;
    index: number;
};

const InstructionList = ({ form, index }: InstructionListProps) => {
    const {
        fields: instructionFields,
        append: appendInstruction,
        remove: removeInstruction,
    } = useFieldArray({
        control: form.control,
        name: `content.${index}.instructions`,
    });

    return (
        <div className="space-y-2">
            <Label className="flex items-center gap-2">
                <List className="h-4 w-4" />
                instruction List
            </Label>
            {instructionFields.map((item, itemIndex) => (
                <div key={item.id} className="flex gap-2">
                    <Input
                        {...form.register(`content.${index}.instructions.${itemIndex}`)}
                        placeholder="List item"
                    />
                    <Button
                        type="button"
                        onClick={() => removeInstruction(itemIndex)}
                        variant="outline"
                        size="sm"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                onClick={() => appendInstruction("")}
                variant="outline"
                size="sm"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
            </Button>
        </div>
    );
};

export default InstructionList;
