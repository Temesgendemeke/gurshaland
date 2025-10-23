import BackNavigation from "@/components/BackNavigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import SubmitRecipeForm from "@/components/SubmitRecipe";
import React from "react";

const CreateRecipe = () => {
  return (
    <>
      <Header />
      <div className="mx-auto px-10 py-12 space-y-8">
        <BackNavigation route="/recipes" pagename="Recipes" />
              <div className="text-center ">
                <h1 className="text-6xl font-bold mb-4">
                  <span className="">Share Your Recipe</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Help preserve Ethiopian culinary traditions by sharing your family
                  recipes
                </p>
              </div>
      <SubmitRecipeForm />
            </div>
      <Footer />
          </>
        );
      };
      
      export default CreateRecipe;
