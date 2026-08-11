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
    name: `contents.${contentIndex}.tips.items`,
  });

  return (
    <div className="mt-1 flex flex-col gap-2 border-l-2 border-primary/20 pl-4">
      <Label
        className={`${itemFields.length === 0 && "hidden"} text-xs text-muted-foreground`}
      >
        Items
      </Label>
      {itemFields.map((item, itemIndex) => (
        <div key={item.id} className="flex items-center gap-2">
          <Input
            {...control.register(
              `contents.${contentIndex}.tips.items.${itemIndex}`,
            )}
            placeholder="Tip item"
            className="flex-1 h-9"
          />
          <Button
            type="button"
            onClick={() => removeItem(itemIndex)}
            variant="ghost"
            size="icon"
            aria-label="Remove tip item"
            className="h-8 w-8 shrink-0 text-error hover:text-error"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => appendItem("")}
        variant="outline"
        size="sm"
        className="w-fit"
      >
        <Plus className="h-4 w-4 mr-1.5" />
        Add Item
      </Button>
    </div>
  );
};

export default TipItems;
