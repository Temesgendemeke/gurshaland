import BackNavigation from "@/components/BackNavigation";
import { Header } from "@/components/header";
import SubmitRecipeForm from "@/components/SubmitRecipe";
import React, { Suspense } from "react";

const CreateRecipe = () => {
  return (
    <>
      <Header />
      <div className="mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-8">
        <Suspense fallback={<div>Loading...</div>}>
          <BackNavigation route="/recipes" pagename="Recipes" />
        </Suspense>
        <div className="text-center ">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="">Share Your Recipe</span>
          </h1>
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
