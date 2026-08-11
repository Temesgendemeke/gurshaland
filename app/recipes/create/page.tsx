import BackNavigation from "@/components/BackNavigation";
import { Header } from "@/components/header";
import SubmitRecipeForm from "@/components/SubmitRecipe";
import React, { Suspense } from "react";

const CreateRecipe = () => {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-6xl space-y-2 px-4 py-12 sm:px-6 sm:py-8 lg:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <BackNavigation route="/recipes" pagename="Recipes" />
        </Suspense>
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Share Your Recipe</h1>
          <p className="text-lg text-muted-foreground">
            Help preserve Ethiopian culinary traditions by sharing your family
            recipes
          </p>
        </div>
        <SubmitRecipeForm />
      </div>
    </>
  );
};

export default CreateRecipe;
