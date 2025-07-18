import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { List, Minus, Plus } from "lucide-react";
import { useFieldArray,  UseFormReturn } from "react-hook-form";

interface ItemListProps {
  form: UseFormReturn<any>;
  index: number;
}

const ItemList = ({ form, index }: ItemListProps) => {
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: `content.${index}.items`,
  });
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <List className="h-4 w-4" />
        Items List
      </Label>
      {itemFields.map((item, itemIndex) => (
        <div key={item.id} className="flex gap-2">
          <Input
            {...form.register(`content.${index}.items.${itemIndex}`)}
            placeholder="List item"
          />
          <Button
            type="button"
            onClick={() => removeItem(itemIndex)}
            variant="outline"
            size="sm"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => appendItem("")}
        variant="outline"
        size="sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
};

export default ItemList;
