"use client"
import { RestaurantFormType } from "@/schema/restaurent"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { PlusIcon, UtensilsCrossed } from "lucide-react";
import { Button } from "../ui/button";
import MenuInputSection from "./MenuInputSection";
import { useFieldArray } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

const MenuForm = ({form}: {form: UseFormReturn<RestaurantFormType>}) =>{
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
                currency: ""
              }
            });
            // Automatically open the new section
            toggleSection(menuFields.length);
     };


    return (
        <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-primary mb-1">
                        <UtensilsCrossed className="h-5 w-5" />
                        <span className="font-semibold uppercase tracking-wider text-xs">Menu</span>
                      </div>
                      <CardTitle>Menu Highlights</CardTitle>
                      <CardDescription>
                        Add your signature dishes to entice customers.
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant={'outline'}
                      onClick={addMenuField}
                      className="gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <PlusIcon size={18} />
                      Add Item
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {menuFields.length === 0 ? (
                        <div className="text-center py-12 px-4 border-2 border-dashed rounded-xl bg-gray-50/50 dark:bg-gray-800/50">
                          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <UtensilsCrossed className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-medium mb-1">No menu items yet</h3>
                          <p className="text-muted-foreground mb-4">Start adding your delicious dishes to showcase your menu.</p>
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
    )
}


export default MenuForm;