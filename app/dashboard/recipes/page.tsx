"use client";
import CreateNewPostButton from "@/components/CreateNewPostButton";
import { postColumn } from "@/components/dashboard/PostColumn";
import { DataTable } from "@/components/data-table";
import StatsCard from "@/components/StatsCard";
import { Separator } from "@/components/ui/separator";
import useRecipe from "@/store/DashboardRecipe";
import { useAuth } from "@/store/useAuth";
import { Post } from "@/utils/types/Dashboard";
import { CheckCircle2, Eye, FileEdit, UtensilsCrossed } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { toast } from "sonner";

const DashBoardRecipe = () => {
  const fetchRecipes = useRecipe((store) => store.fetchRecipes);
  const loading = useRecipe((store) => store.loading);
  const user = useAuth((store) => store.user);
  const recipes = useRecipe((store) => store.recipes);
  const deleteRecipe = useRecipe((store) => store.deleteRecipe);
  const error = useRecipe((store) => store.error);

  useEffect(() => {
    if (user?.id) {
      fetchRecipes(user.id);
    }
  }, [fetchRecipes, user?.id]);

  const publishedCount = useMemo(
    () => recipes.filter((r) => r.status === "published").length,
    [recipes],
  );
  const draftCount = useMemo(
    () => recipes.filter((r) => r.status === "draft").length,
    [recipes],
  );
  const totalViews = useMemo(
    () => recipes.reduce((sum, r) => sum + (r.view_count ?? 0), 0),
    [recipes],
  );

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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-gosh tracking-tight text-foreground">
              Your Recipes
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Track drafts and published recipes.
            </p>
          </div>
          <CreateNewPostButton postType="Recipe" />
        </div>

        <Separator className="opacity-60" />

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {error} Showing cached values if available.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            name="recipes"
            count={recipes.length}
            Icon={UtensilsCrossed}
            loading={loading}
            type="follower"
            href="/dashboard/recipes"
          />
          <StatsCard
            name="published"
            count={publishedCount}
            Icon={CheckCircle2}
            loading={loading}
            type="follower"
            href="/dashboard/recipes"
          />
          <StatsCard
            name="drafts"
            count={draftCount}
            Icon={FileEdit}
            loading={loading}
            type="follower"
            href="/dashboard/recipes"
          />
          <StatsCard
            name="views"
            count={totalViews}
            Icon={Eye}
            loading={loading}
            type="follower"
            href="/dashboard/recipes"
          />
        </div>
      </div>

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
