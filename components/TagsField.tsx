"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag, X } from "lucide-react";

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
    <Card className="border-border bg-card/70">
      <CardHeader className="space-y-2">
        {/* <div className="flex items-center gap-2 text-primary">
          <Tag className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Tags
          </span>
        </div> */}
        <CardTitle>Tags</CardTitle>
        <CardDescription className="text-sm leading-6">
          Help people find your recipe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="gap-1.5 py-1.5 pl-3 pr-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 transition-colors  hover:text-primary-foreground/60"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            className="h-11"
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
            className="h-11 shrink-0 border-primary/40 text-primary hover:bg-primary/10"
          >
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
