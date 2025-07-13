import React from "react";
import { Card } from "./ui/card";

const RecipeCulturalNote = ({culturalNote}:{culturalNote: string}) => {
  return (
    <>
      {culturalNote && (
        <Card className="p-6 bg-gradient-to-r from-emerald-50 to-yellow-50 dark:from-emerald-900/20 dark:to-yellow-900/20 border-emerald-200 dark:border-emerald-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Cultural Significance
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {culturalNote}
          </p>
        </Card>
      )}
    </>
  );
};

export default RecipeCulturalNote;
