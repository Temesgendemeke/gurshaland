import React from "react";

const RecipeCulturalNote = ({ culturalNote }: { culturalNote: string }) => {
  if (!culturalNote) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border/80">
      <div className="border-b border-border/80 bg-card px-4 py-3">
        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-widest text-foreground">
          Cultural significance
        </h3>
      </div>
      <div className="bg-card px-4 py-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {culturalNote}
        </p>
      </div>
    </div>
  );
};

export default RecipeCulturalNote;
