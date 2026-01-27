import React from "react";
import { Card } from "./ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table";
import { Ingredient } from "@/utils/types/recipe";

type IngredientWithUnit = Ingredient & { unit?: string };

const IngredientsView = ({
  ingredients,
}: {
  ingredients: IngredientWithUnit[];
}) => {
  return (
    <Card className="p-6 bg-card border border-border rounded-lg shadow-modern">
      <h2 className="heading-secondary text-2xl md:text-3xl border-b border-border pb-3">
        Ingredients
      </h2>
      <div className="overflow-x-auto">
        <Table className="text-base" aria-label="Ingredients table">
          <TableHeader className="bg-muted/20">
            <TableRow>
              <TableHead className="text-right w-30 pr-10">Quantity</TableHead>
              <TableHead className="w-100 pr-10">Ingredient</TableHead>
              <TableHead className="w-120">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient, index) => (
              <TableRow
                key={index}
                className="even:bg-muted/20 hover:bg-muted/30 transition-standard"
              >
                <TableCell className="align-top pr-10 text-right">
                  <span className="tabular-nums font-semibold text-muted-foreground  whitespace-nowrap">
                    {ingredient.amount ?? ""}
                    {ingredient.unit ? (
                      <span className="ml-1 text-muted-foreground">
                        {ingredient.unit}
                      </span>
                    ) : null}
                  </span>
                </TableCell>
                <TableCell className="align-top pr-10">
                  <span className="text-foreground">{ingredient.item}</span>
                </TableCell>
                <TableCell className="align-top">
                  <span className="text-body-muted text-sm ">
                    {ingredient.notes || "—"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default IngredientsView;
