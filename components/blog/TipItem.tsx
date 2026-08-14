import { Control, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-3">
      {itemFields.map((item, itemIndex) => (
        <div key={item.id} className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground shrink-0 w-6">
            {itemIndex + 1}.
          </span>
          <Input
            {...control.register(
              `contents.${contentIndex}.tips.items.${itemIndex}`,
            )}
            placeholder="Add a tip..."
            className="flex-1 h-9"
          />
          <Button
            type="button"
            onClick={() => removeItem(itemIndex)}
            variant="ghost"
            size="icon"
            aria-label="Remove tip"
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
        className="w-fit gap-1.5"
      >
        <Plus className="h-4 w-4" />
        Add Tip
      </Button>
    </div>
  );
};

export default TipItems;
