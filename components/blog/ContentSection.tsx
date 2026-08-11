"use client";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
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
import { ChevronDown, ChevronRight, Minus } from "lucide-react";
import ImageBox from "../ImageBox";
import TipsForm from "./TipsForm";
import RecipeForm from "./RecipeForm";
import { deleteImageFromDb } from "@/actions/Image";

interface ContentSectionProps {
  index: number;
  form: UseFormReturn<any>;
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
  return (
    <Card className="overflow-hidden rounded-xl border-border/70">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer transition-colors hover:bg-muted/40">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-3 text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                Content Section {index + 1}
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </CardTitle>
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                variant="ghost"
                size="icon"
                aria-label={`Remove content section ${index + 1}`}
                className="h-8 w-8 text-error hover:bg-error/10 hover:text-error"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="flex flex-col gap-5 border-t border-border/60 pt-5">
            <ImageBox
              form={form}
              field={`contents.${index}.image` as any}
              inputcls={`image-content-${index}`}
              label="Content"
              deleteImage={async (path) => {
                await deleteImageFromDb(
                  "content_image",
                  path,
                  form.getValues(`contents.${index}.id`),
                );
              }}
            />

            <div className="flex flex-col gap-2">
              <Label htmlFor={`section-title-${index}`}>Section Title</Label>
              <Input
                id={`section-title-${index}`}
                {...form.register(`contents.${index}.title`)}
                placeholder="Section title"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`section-body-${index}`}>Content *</Label>
              <Textarea
                id={`section-body-${index}`}
                {...form.register(`contents.${index}.body`)}
                placeholder="Enter section content"
                rows={4}
              />
              {(form.formState.errors as any).contents?.[index]?.body && (
                <p className="text-sm text-error">
                  {(form.formState.errors as any).contents[index].body.message}
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
