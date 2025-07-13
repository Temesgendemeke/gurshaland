import React from "react";
import { Card } from "./ui/card";
import { Ingredient } from "@/utils/types/recipe";

const IngredientsView = ({ ingredients }: { ingredients: Ingredient[] }) => {
  return (
    <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Ingredients
      </h2>
      <ul className="space-y-4">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex justify-between items-start">
            <div className="flex-1">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {ingredient.amount}
              </span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                {ingredient.item}
              </span>
              {ingredient.notes && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
