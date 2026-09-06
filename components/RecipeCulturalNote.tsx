import React from "react";
import { Sparkles } from "lucide-react";

interface RecipeCulturalNoteProps {
  culturalNote?: string;
}

export default function RecipeCulturalNote({ culturalNote }: RecipeCulturalNoteProps) {
  if (!culturalNote?.trim()) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-none">
      <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Sparkles className="h-3 w-3" />
        </span>
        <h3 className="font-gosh text-base sm:text-lg font-bold tracking-tight text-foreground">
          Tradition & Heritage
        </h3>
      </div>
      <p className="text-sm sm:text-base leading-relaxed text-foreground/80">
        {culturalNote}
      </p>
    </div>
  );
}
