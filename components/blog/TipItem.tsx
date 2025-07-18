import { Control, useFieldArray, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

const TipItems = ({
  contentIndex,
  control,
}: {
  contentIndex: number;
  control: Control<any>;
}) => {
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `content.${contentIndex}.tips.items`,
  });

  return (
    <div className="pl-6 space-y-2 mt-2 border-l-2 ml-2">
      <Label
        className={`${
          itemFields.length === 0 && "hidden"
        } text-xs text-muted-foreground`}
      >
        Items
      </Label>
      {itemFields.map((item, itemIndex) => (
        <div key={item.id} className="flex items-center gap-2">
          <Input
            {...control.register(
              `content.${contentIndex}.tips.items.${itemIndex}`
            )}
            placeholder="Tip item"
            className="flex-1 h-9"
          />
          <Button
            type="button"
            onClick={() => removeItem(itemIndex)}
            variant={"ghost"}
            size="icon"
            className="h-8 w-8 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => appendItem("")}
        variant={"outline"}
        size="sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
};

export default TipItems;
