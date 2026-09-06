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
import { Button } from "../ui/button";
import {
  IconChevronDown as ChevronDown,
  IconTrash as Trash,
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

  const dishName = form.watch(`menu.${index}.name`);
  const dishPrice = form.watch(`menu.${index}.price.amount`);
  const dishCurrency = form.watch(`menu.${index}.price.currency`) || "ETB";

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
    <div className="rounded-lg border border-border bg-card overflow-hidden transition-colors">
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 cursor-pointer select-none transition-colors",
          isExpanded ? "bg-muted/30 border-b border-border/60" : "hover:bg-muted/20",
        )}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            {index + 1}
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-foreground truncate">
              {dishName?.trim() ? dishName : `Dish #${index + 1}`}
            </h4>
            {dishPrice ? (
              <span className="text-xs text-muted-foreground">
                {dishPrice} {dishCurrency}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Remove menu item"
            onClick={onRemove}
            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            type="button"
          >
            <Trash className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label={isExpanded ? "Collapse menu item" : "Expand menu item"}
            onClick={onToggle}
            className="h-7 w-7 text-muted-foreground"
            type="button"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded && "rotate-180",
              )}
            />
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <FormField
                control={form.control}
                name={`menu.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Dish Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Doro Wat with Ayib"
                        className="h-9 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <FormField
                control={form.control}
                name={`menu.${index}.price.amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Price Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="h-9 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <FormField
                control={form.control}
                name={`menu.${index}.price.currency`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Currency</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "ETB"}
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent className="bg-background max-h-[16rem]">
                          <div className="sticky top-0 z-10 border-b bg-background p-1.5">
                            <Input
                              placeholder="Search currency..."
                              className="h-7 text-xs"
                              value={currencySearch}
                              onChange={(e) =>
                                setCurrencySearch(e.target.value)
                              }
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="max-h-[12rem] overflow-y-auto">
                            {filteredCurrencies.length > 0 ? (
                              filteredCurrencies.map((curr) => (
                                <SelectItem key={curr.cc} value={curr.cc}>
                                  <span className="font-mono">{curr.cc}</span>
                                  <span className="ml-2 truncate text-xs text-muted-foreground">
                                    {curr.name}
                                  </span>
                                </SelectItem>
                              ))
                            ) : (
                              <p className="px-3 py-4 text-center text-xs text-muted-foreground">
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
          </div>

          <FormField
            control={form.control}
            name={`menu.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Key ingredients, preparation style, or dietary notes..."
                    className="min-h-[4.5rem] resize-y text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default MenuInputSection;
