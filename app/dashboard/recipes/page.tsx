"use client";
import CreateNewPostButton from "@/components/CreateNewPostButton";
import { postColumn } from "@/components/dashboard/PostColumn";
import { DataTable } from "@/components/data-table";
import useRecipe from "@/store/DashboardRecipe";
import { useAuth } from "@/store/useAuth";
import { Post } from "@/utils/types/Dashboard";
import React, { useEffect } from "react";
import { toast } from "sonner";

const DashBoardRecipe = () => {
  const fetchRecipes = useRecipe((store) => store.fetchRecipes);
  const loading = useRecipe((store) => store.loading);
  const user = useAuth((store) => store.user);
  const recipes = useRecipe((store) => store.recipes);
  const deleteRecipe = useRecipe((store) => store.deleteRecipe);

  useEffect(() => {
    if (user?.id) {
      fetchRecipes(user.id);
    }
  }, [fetchRecipes, user?.id]);

  const handleDelete = async (rows: Post[]) => {
    try {
      for (const row of rows) {
        await deleteRecipe(row.slug!);
        toast.success(`${row.title} recipe deleted successfully`);
      }
      // Refetch recipes to ensure the list is updated
      if (user && user.id) {
        fetchRecipes(user.id);
      }
    } catch (error) {
      toast.error("Failed to delete recipe");
    }
  };
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Your Recipes
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track drafts and published recipes.
        </p>
      </div>

      <CreateNewPostButton postType="Recipe" />

      <DataTable<Post, any>
        columns={postColumn}
        data={recipes}
        loading={loading}
        onDeleteSelected={handleDelete}
      />
    </div>
  );
};

export default DashBoardRecipe;
