import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { currencies } from "@/constants/currencies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface MenuInputProps {
  index: number;
  form: any;
  onRemove: () => void;
  isOpen: (index: number) => boolean;
  onToggle: () => void;
}

const MenuInputSection = ({
  index,
  form,
  onRemove,
  isOpen,
  onToggle,
}: MenuInputProps) => {
  const isExpanded = isOpen(index);

  return (
    <Card
      className={cn(
        "mb-4 transition-all duration-200 border-l-4",
        isExpanded
          ? "border-l-primary shadow-md"
          : "border-l-transparent hover:border-l-muted-foreground/50 bg-background",
      )}
    >
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 bg-background">
        <div className="flex items-center gap-3">
          <div className="cursor-grab active:cursor-grabbing text-muted-foreground">
            <GripVertical size={20} />
          </div>
          <CardTitle className="text-lg font-medium">
            Menu Item {index + 1}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={isExpanded ? "Collapse menu item" : "Expand menu item"}
            onClick={onToggle}
            className="h-8 w-8"
            type="button"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Remove menu item"
            onClick={onRemove}
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive shadow-none"
            type="button"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 pt-0 grid gap-4 animate-in fade-in slide-in-from-top-2 duration-200 bg-background">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name={`menu.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Doro Wat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`menu.${index}.price.amount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`menu.${index}.price.currency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-background p-0 max-h-[300px]">
                        <div className="p-2 sticky top-0 bg-background z-10 border-b">
                          <Input
                            placeholder="Search currency..."
                            className="h-8"
                            onChange={(e) => {
                              // We need to handle search state locally or via a ref if we want to avoid re-rendering the whole form too much,
                              // but for now let's use a simple state in the component if we can, or just direct DOM manipulation if we can't add state easily.
                              // Actually, since this is inside a map, we should probably extract this currency selector or use a more robust Combobox.
                              // However, to strictly follow the user request "make search functional" within this structure:
                              const value = e.target.value.toLowerCase();
                              const items = document.querySelectorAll(
                                `.currency-item-${index}`,
                              );
                              items.forEach((item) => {
                                const text =
                                  item.textContent?.toLowerCase() || "";
                                if (text.includes(value)) {
                                  (item as HTMLElement).style.display = "flex";
                                } else {
                                  (item as HTMLElement).style.display = "none";
                                }
                              });
                            }}
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="overflow-y-auto max-h-[250px]">
                          {currencies.map((curr) => (
                            <SelectItem
                              key={curr.cc}
                              value={curr.cc}
                              className={` currency-item-${index}`}
                            >
                              <span>{curr.cc}</span>
                              <span className="ml-2 text-muted-foreground text-xs truncate ">
                                {curr.name}
                              </span>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name={`menu.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the dish..."
                    className="resize-none min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default MenuInputSection;
