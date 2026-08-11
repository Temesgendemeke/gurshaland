"use client";
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
import {
  IconChevronDown as ChevronDown,
  IconChevronUp as ChevronUp,
  IconTrash as Trash,
  IconGripVertical as GripVertical,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { currencies } from "@/constants/currencies";
import { useMemo, useState } from "react";
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
  const [currencySearch, setCurrencySearch] = useState("");

  const filteredCurrencies = useMemo(() => {
    const q = currencySearch.trim().toLowerCase();
    if (!q) return currencies;
    return currencies.filter(
      (curr) =>
        curr.cc.toLowerCase().includes(q) ||
        curr.name.toLowerCase().includes(q),
    );
  }, [currencySearch]);

  return (
    <Card
      className={cn(
        "mb-4 overflow-hidden transition-all duration-200 border-l-4",
        isExpanded
          ? "border-l-primary"
          : "border-l-transparent hover:border-l-muted-foreground/50",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/20 p-4">
        <div className="flex items-center gap-3">
          <div className="cursor-grab text-muted-foreground active:cursor-grabbing">
            <GripVertical className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <CardTitle className="font-gosh text-base font-bold">
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
            {isExpanded ? <ChevronUp className="h-4 w-4" strokeWidth={2} /> : <ChevronDown className="h-4 w-4" strokeWidth={2} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Remove menu item"
            onClick={onRemove}
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            type="button"
          >
            <Trash className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="grid gap-4 p-4 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
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
                      <SelectContent className="bg-background max-h-[18.75rem] p-0">
                        <div className="sticky top-0 z-10 border-b bg-background p-2">
                          <Input
                            placeholder="Search currency..."
                            className="h-8"
                            value={currencySearch}
                            onChange={(e) =>
                              setCurrencySearch(e.target.value)
                            }
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="max-h-[15.625rem] overflow-y-auto">
                          {filteredCurrencies.length > 0 ? (
                            filteredCurrencies.map((curr) => (
                              <SelectItem key={curr.cc} value={curr.cc}>
                                <span>{curr.cc}</span>
                                <span className="ml-2 truncate text-xs text-muted-foreground">
                                  {curr.name}
                                </span>
                              </SelectItem>
                            ))
                          ) : (
                            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                              No currency found
                            </p>
                          )}
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
                    className="min-h-[5rem] resize-none"
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
