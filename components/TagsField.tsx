"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type TagsFieldProps = {
  tags: string[];
  newTag: string;
  setNewTag: (tag: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
};

export default function TagsField({
  tags,
  newTag,
  setNewTag,
  addTag,
  removeTag,
}: TagsFieldProps) {
  return (
    <Card className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 shadow-none space-y-5">
      <CardHeader className="p-0 pb-4 border-b border-border/60">
        <CardTitle className="font-gosh text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Tags
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          Keywords to help food lovers discover your recipe.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-3">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
                className="rounded-md p-0.5 text-primary/60 transition-colors hover:text-primary hover:bg-primary/20"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            className="h-11 rounded-xl border-border/80 bg-background/80"
            placeholder="Add a tag (e.g., Traditional, Spicy, Vegan)"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addTag())
            }
          />
          <Button
            onClick={addTag}
            type="button"
            variant="outline"
            className="h-11 shrink-0 rounded-xl px-5 text-xs sm:text-sm font-medium border-border/80 bg-background/80 hover:bg-accent"
          >
            Add Tag
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
