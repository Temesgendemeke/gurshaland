"use client";
import { RestaurantFormType } from "@/schema/restaurent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { IconPlus as Plus, IconToolsKitchen2 as Utensils } from "@tabler/icons-react";
import { Button } from "../ui/button";
import MenuInputSection from "./MenuInputSection";
import { useFieldArray } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

const MenuForm = ({ form }: { form: UseFormReturn<RestaurantFormType> }) => {
  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) => {
      if (prev.includes(index)) {
        return prev.filter((id) => id !== index);
      }
      return [...prev, index];
    });
  };

  const {
    fields: menuFields,
    append: appendMenu,
    remove: removeMenu,
  } = useFieldArray({
    control: form.control,
    name: "menu",
  });

  const addMenuField = () => {
    appendMenu({
      name: "",
      description: "",
      price: {
        amount: 0,
        currency: "ETB",
      },
    });
    toggleSection(menuFields.length);
  };

  return (
    <Card className="border border-border bg-card/60 rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between gap-3 p-4 sm:p-6 pb-3 sm:pb-4">
        <div>
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
            Menu Highlights
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Feature signature dishes, specialty courses, and pricing.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addMenuField}
          className="shrink-0 gap-1.5 h-8 font-medium text-xs sm:text-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Dish</span>
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        {menuFields.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/10 px-4 py-8 text-center">
            <Utensils className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" strokeWidth={1.5} />
            <p className="text-sm font-medium text-foreground">No menu items added yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Add signature dishes so diners can preview your cuisine and pricing.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMenuField}
              className="mt-4 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add First Dish
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {menuFields.map((field, index) => (
              <MenuInputSection
                key={field.id}
                index={index}
                form={form}
                onRemove={() => removeMenu(index)}
                isOpen={(idx) => openSections.includes(idx)}
                onToggle={() => toggleSection(index)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuForm;
