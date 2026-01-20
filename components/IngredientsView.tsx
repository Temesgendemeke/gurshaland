import React from "react";
import { Card } from "./ui/card";
import { Ingredient } from "@/utils/types/recipe";

const IngredientsView = ({ ingredients }: { ingredients: Ingredient[] }) => {
  return (
    <Card className="p-6 bg-card/70 backdrop-blur-sm border-border/50">
      <h2 className="text-2xl font-bold text-foreground mb-6">Ingredients</h2>
      <ul className="space-y-4">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex justify-between items-start">
            <div className="flex-1">
              <span className="font-medium text-foreground">
                {ingredient.amount}
              </span>
              <span className="ml-2 text-muted-foreground">
                {ingredient.item}
              </span>
              {ingredient.notes && (
                <p className="text-sm text-muted-foreground/80 mt-1">
                  {ingredient.notes}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default IngredientsView;
