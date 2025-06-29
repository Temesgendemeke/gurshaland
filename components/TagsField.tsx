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
    <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Tags
      </h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-2 dark:bg-gray-700 dark:text-gray-300"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-500"
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
          className="border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
        />
        <Button
          onClick={addTag}
          type="button"
          variant="outline"
          className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
        >
          Add
        </Button>
      </div>
    </Card>
  );
}
