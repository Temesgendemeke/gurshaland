"use client";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconChevronDown as ChevronDown, IconChevronRight as ChevronRight, IconMinus as Minus, IconGripVertical as GripVertical } from "@tabler/icons-react";
import ImageBox from "../ImageBox";
import TipsForm from "./TipsForm";
import RecipeForm from "./RecipeForm";
import { deleteImageFromDb } from "@/actions/Image";
import { motion, useReducedMotion } from "motion/react";

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
  const reduceMotion = useReducedMotion();

  return (
    <div className="rounded-xl border border-border/70 bg-card overflow-hidden transition-all duration-300">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between gap-3 p-4 hover:bg-muted/40 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                {index + 1}
              </span>
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-gosh text-base font-medium text-foreground"
              >
                Content Section {index + 1}
              </motion.span>
              <motion.div
                initial={reduceMotion ? false : { rotate: isOpen ? 180 : 0 }}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              </motion.div>
            </div>
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
              <Minus className="h-4 w-4" strokeWidth={2} />
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="space-y-5 border-t border-border/60 pt-5 px-4 pb-4">
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

            <div className="space-y-2">
              <Label htmlFor={`section-title-${index}`} className="text-sm font-medium text-foreground">
                Section Title
              </Label>
              <Input
                id={`section-title-${index}`}
                {...form.register(`contents.${index}.title`)}
                placeholder="Section title (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`section-body-${index}`} className="text-sm font-medium text-foreground">
                Content <span className="text-error">*</span>
              </Label>
              <Textarea
                id={`section-body-${index}`}
                {...form.register(`contents.${index}.body`)}
                placeholder="Write your content here..."
                rows={4}
              />
              {(form.formState.errors as any).contents?.[index]?.body && (
                <p className="text-sm text-error" role="alert">
                  {(form.formState.errors as any).contents[index].body.message}
                </p>
              )}
            </div>

            {/* recipe */}
            <RecipeForm form={form} index={index} />

            {/* tips */}
            <TipsForm index={index} form={form} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}