"use client";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RestaurantFormType } from "@/schema/restaurent";
import { Button } from "../ui/button";
import { IconPlus as Plus, IconCooker as UtensilsCrossed, IconX as X } from "@tabler/icons-react";

const CusinesForm = ({ form }: { form: UseFormReturn<RestaurantFormType> }) => {
  const cuisines = form.watch("cuisines") || [];

  const addCuisine = () => {
    const current = form.getValues("cuisines") || [];
    form.setValue("cuisines", [...current, ""]);
  };

  const removeCuisine = (index: number) => {
    const current = form.getValues("cuisines") || [];
    form.setValue(
      "cuisines",
      current.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Cuisines</label>
        <Button onClick={addCuisine} size="sm" variant="outline" type="button">
          <Plus className="mr-2 h-4 w-4" strokeWidth={2} /> Add Cuisine
        </Button>
      </div>

      {cuisines.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-6 text-center text-xs text-muted-foreground">
          No cuisines yet  add Ethiopian, Italian, Fusion...
        </div>
      ) : (
        <div className="space-y-3">
          {cuisines.map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`cuisines.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <UtensilsCrossed className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                      <Input
                        placeholder="e.g. Ethiopian, Italian, Fusion"
                        className="h-11 pl-10 pr-11"
                        {...field}
                      />
                      {cuisines.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeCuisine(index)}
                          className="absolute right-2 top-2 h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" strokeWidth={2} />
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CusinesForm;
