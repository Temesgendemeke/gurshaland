"use client";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RestaurantFormType } from "@/schema/restaurent";
import { Button } from "../ui/button";
import { PlusIcon, Trash, UtensilsCrossed, X } from "lucide-react";

const CusinesForm = ({ form }: { form: UseFormReturn<RestaurantFormType> }) => {
  const cuisines = form.watch("cuisines") || [];

  if (cuisines.length == 0) {
    form.setValue("cuisines", [""]);
  }

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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FormLabel>Cuisines</FormLabel>
        <Button onClick={addCuisine} size="sm" variant="outline" type="button">
          <PlusIcon className="w-4 h-4 mr-2" /> Add Cuisine
        </Button>
      </div>
      {cuisines.map((_, index) => (
        <FormField
          key={index}
          control={form.control}
          name={`cuisines.${index}`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <UtensilsCrossed className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g. Ethiopian, Italian, Fusion"
                    className="pl-10 h-11"
                    {...field}
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeCuisine(index)}
                      className="absolute right-2 top-2 h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
      ))}
    </div>
  );
};

export default CusinesForm;
