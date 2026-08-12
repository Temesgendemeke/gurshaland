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
    <Card className="space-y-4  border-none">
      <CardHeader className="">
        <CardTitle className="">Tags</CardTitle>
        <CardDescription>Help people find your recipe.</CardDescription>
      </CardHeader>
      <CardContent className="">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 py-1 pl-3 pr-2 text-sm text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
                className="rounded-full p-0.5 text-primary/60 transition-colors hover:text-primary"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
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
            className="h-11 shrink-0 border-primary/40 text-primary hover:border-primary hover:bg-primary/5"
          >
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
