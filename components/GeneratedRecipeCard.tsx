import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, Edit, Users, X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { DialogClose, DialogHeader } from "./ui/dialog";
import { DialogTitle } from "./ui/dialog";
import { DialogDescription } from "./ui/dialog";
import Image from "next/image";
import generateImage from "@/utils/getImage";
import FullRecipeModel from "./recipe/FullRecipeModel";
import SubmitRecipeForm from "./SubmitRecipe";

export default function GeneratedRecipeCard({ recipe }: { recipe: any }) {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold heading-primary">{recipe.title}</h3>
          <Badge className="bg-emerald-100 text-emerald-700">
            AI Generated
          </Badge>
        </div>
        <div>
          <Image
            width={400}
            height={300}
            src={recipe.image?.url ?? "/placeholder.jpg"}
            alt={recipe.title}
            className="object-cover w-full h-48 rounded-lg"
          />
        </div>
        <p className="text-body text-sm">{recipe.description}</p>
        <div className="flex items-center space-x-4 text-sm text-body-muted">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.cooktime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
          <Badge variant="secondary">{recipe.difficulty}</Badge>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-body">Ingredients:</h4>
          <ul className="text-sm text-body space-y-1">
            {recipe?.ingredients?.map(
              (
                ingredient: { amount: number; unit: string; item: string },
                idx: number
              ) => (
                <li key={idx} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>
                    {ingredient.amount} {ingredient.unit} {ingredient.item}
                  </span>
                </li>
              )
            )}
            {recipe?.ingredients?.length > 4 && (
              <li className="text-body-muted text-xs">
                + {recipe?.ingredients?.length - 4} more ingredients
              </li>
            )}
          </ul>
        </div>
        <div className="flex gap-2 pt-4">
          <FullRecipeModel recipe={recipe}/>
        </div>
      </div>
    </>
  );
}
