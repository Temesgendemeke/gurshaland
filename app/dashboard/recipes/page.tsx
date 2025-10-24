"use client";
import { postColumn } from "@/components/dashboard/PostColumn";
import { DataTable } from "@/components/data-table";
import useRecipe from "@/store/DashboardRecipe";
import { useAuth } from "@/store/useAuth";
import { Post } from "@/utils/types/Dashboard";
import React, { useEffect } from "react";

const page = () => {
  const fetchRecipes = useRecipe((store) => store.fetchRecipes);
  const loading = useRecipe((store) => store.loading);
  const user = useAuth((store) => store.user);
  const recipes = useRecipe((store) => store.recipes);

  useEffect(() => {
    (() => {
      if (user && user.id) {
        fetchRecipes(user.id);
      }
    })();
  }, [user?.id]);
  return (
    <div className="mx-5 md:mx-10">
      <div className="mt-4 text-center md:text-left">
        <h2 className="text-4xl font-bold mb-4">Your Recipe Posts</h2>
        <p className="mb-6 text-gray-600">
          Here’s a creative overview of all your recipe sections. Track
          progress, assign reviewers, and cook up something amazing!
        </p>
      </div>
      {JSON.stringify(recipes)}
      <DataTable<Post, any>
        columns={postColumn}
        data={recipes}
        loading={loading}
      />
    </div>
  );
};

export default page;
