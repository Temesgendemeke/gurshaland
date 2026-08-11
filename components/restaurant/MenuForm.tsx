"use client";
import { RestaurantFormType } from "@/schema/restaurent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { IconPlus as Plus, IconCooker as UtensilsCrossed } from "@tabler/icons-react";
import { Button } from "../ui/button";
import MenuInputSection from "./MenuInputSection";
import { useFieldArray } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

const MenuForm = ({ form }: { form: UseFormReturn<RestaurantFormType> }) => {
  const [openSections, setOpenSections] = useState<number[]>([]);
  const removeMenuField = (index: number) => {
    removeMenu(index);
  };

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
        currency: "",
      },
    });
    // Automatically open the new section
    toggleSection(menuFields.length);
  };

  return (
    <Card className="border-border/60 bg-card shadow-[0_15px_40px_-30px_hsl(var(--foreground)/0.15)]">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <UtensilsCrossed className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Menu
            </span>
          </div>
          <CardTitle className="mt-1 font-gosh text-xl">
            Menu Highlights
          </CardTitle>
          <CardDescription>
            Add your signature dishes to entice customers.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant={"outline"}
          onClick={addMenuField}
          className="shrink-0 gap-2"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Item
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {menuFields.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <UtensilsCrossed className="h-6 w-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-gosh text-lg font-bold">
                No menu items yet
              </h3>
              <p className="mx-auto mt-1 mb-5 max-w-xs text-sm text-muted-foreground">
                Start adding your delicious dishes to showcase your menu.
              </p>
              <Button type="button" variant="outline" onClick={addMenuField}>
                Add Your First Dish
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {menuFields.map((field, index) => (
                <MenuInputSection
                  key={field.id}
                  index={index}
                  form={form}
                  onRemove={() => removeMenuField(index)}
                  isOpen={(idx) => openSections.includes(idx)}
                  onToggle={() => toggleSection(index)}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuForm;
