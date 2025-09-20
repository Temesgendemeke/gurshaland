import { Header } from "@/components/header";
import MealPlanner from "@/components/meal-planner/MealPlanner";
import React from "react";

const page = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Header />
      <MealPlanner />
    </div>
  );
};

export default page;
