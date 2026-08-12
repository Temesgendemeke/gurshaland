import { Control, useFieldArray, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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
    <Card className="border-none bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Items</CardTitle>
        <CardDescription>
          Add individual tips and tricks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {itemFields.map((item, itemIndex) => (
          <div key={item.id} className="flex flex-col gap-2">
            <div className="flex items-end gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <Label>Tip {itemIndex + 1}</Label>
                <Input
                  {...control.register(
                    `contents.${contentIndex}.tips.items.${itemIndex}`,
                  )}
                  placeholder="Tip item"
                  className="flex-1 h-9"
                />
              </div>
              <Button
                type="button"
                onClick={() => removeItem(itemIndex)}
                variant="ghost"
                size="icon"
                aria-label="Remove tip item"
                className="h-8 w-8 shrink-0 text-error hover:text-error mb-0.5"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
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
      </CardContent>
    </Card>
  );
};

export default TipItems;
