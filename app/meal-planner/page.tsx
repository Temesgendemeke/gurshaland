import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import MealPlanner from "@/components/meal-planner/MealPlanner";
import React from "react";

const page = () => {
  return (
    <>
      <Header />
      <MealPlanner />
    </>
  );
};

export default page;
