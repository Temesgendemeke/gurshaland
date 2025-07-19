"use client";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronRight,
  Minus,
  Plus,
  List,
  ChefHat,
} from "lucide-react";
import ImageBox from "../ImageBox";
import TipsForm from "./TipsForm";
import RecipeForm from "./RecipeForm";


interface ContentSectionProps {
  index: number;
  form: any;
  onRemove: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ContentSection({
  index,
  form,
  onRemove,
  isOpen,
  onToggle,
}: ContentSectionProps) {
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: `content.${index}.items`,
  });


  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Content Section {index + 1}
              </CardTitle>
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            <ImageBox
              form={form}
              field={`content${index}.image.file`}
              inputcls={`image-content-${index}.file`}
              label="Content"
            />
            <div className="grid grid-cols-1  gap-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  {...form.register(`content.${index}.title`)}
                  placeholder="Section title"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea
                {...form.register(`content.${index}.body`)}
                placeholder="Enter section content"
                rows={4}
              />
              {form.formState.errors.content?.[index]?.body && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.content[index].body.message}
                </p>
              )}
            </div>
            {/* recipe */}
            <RecipeForm form={form} index={index} />

            {/* tips */}
            <TipsForm index={index} form={form} />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
