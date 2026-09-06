import { Header } from "@/components/header";
import SubmitRecipeForm from "@/components/SubmitRecipe";
import React from "react";

const CreateRecipe = () => {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mt-6 space-y-3 text-center flex flex-col items-center justify-center">
          <h1 className="font-gosh text-3xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            Share your recipe
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Help preserve Ethiopian culinary traditions by sharing your family
            recipes.
          </p>
        </div>
        <div className="mt-10">
          <SubmitRecipeForm />
        </div>
      </div>
    </>
  );
};

export default CreateRecipe;
