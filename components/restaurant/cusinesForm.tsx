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
import { IconPlus as Plus, IconToolsKitchen2 as Utensils, IconX as X } from "@tabler/icons-react";

const CusinesForm = ({ form }: { form: UseFormReturn<RestaurantFormType> }) => {
  const cuisines = form.watch("cuisines") || [];

  const addCuisine = () => {
    const current = form.getValues("cuisines") || [];
    form.setValue("cuisines", [...current, ""], { shouldDirty: true });
  };

  const removeCuisine = (index: number) => {
    const current = form.getValues("cuisines") || [];
    form.setValue(
      "cuisines",
      current.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  };

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-foreground">Cuisine Specialties</label>
          <p className="text-xs text-muted-foreground">
            Tags for search filtering and profile highlights.
          </p>
        </div>
        <Button
          onClick={addCuisine}
          size="sm"
          variant="outline"
          type="button"
          className="h-8 gap-1.5 font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Cuisine</span>
        </Button>
      </div>

      {cuisines.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-xs text-muted-foreground">
          No cuisines assigned. Click &quot;Add Cuisine&quot; to tag (e.g., Ethiopian, Vegetarian, Cafe).
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cuisines.map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`cuisines.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Utensils className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                      <Input
                        placeholder="e.g. Ethiopian Traditional"
                        className="h-10 pl-9 pr-9 text-sm"
                        {...field}
                      />
                      {cuisines.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCuisine(index)}
                          className="absolute right-1.5 top-1.5 h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-3.5 w-3.5" />
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
