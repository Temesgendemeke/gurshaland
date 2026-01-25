"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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
    <Card className="p-6 bg-card/70 border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">Tags</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-2"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-error"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add a tag (e.g., Traditional, Spicy, Vegan)"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          className="border-border bg-background"
        />
        <Button
          onClick={addTag}
          type="button"
          variant="outline"
          className="border-primary/40 text-primary hover:bg-primary/10"
        >
          Add
        </Button>
      </div>
    </Card>
  );
}
