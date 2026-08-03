import React from "react";
import { Card } from "./ui/card";

const RecipeCulturalNote = ({ culturalNote }: { culturalNote: string }) => {
  return (
    <>
      {culturalNote && (
        <Card className="p-6 bg-primary/5 border-l-4 border-primary">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Cultural Significance
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {culturalNote}
          </p>
        </Card>
      )}
    </>
  );
};

export default RecipeCulturalNote;
