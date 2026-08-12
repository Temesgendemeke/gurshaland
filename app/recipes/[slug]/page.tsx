"use client";

import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import {
  ClockIcon as Clock,
  UsersIcon as Group,
  HomeModernIcon as Restaurant,
  StarIcon as Star,
  ChatBubbleLeftRightIcon as MessageRoundedDetail,
  PencilSquareIcon as PenBoxIcon,
} from "@heroicons/react/24/outline";
import { PostComment } from "@/utils/types/recipe";
import { useParams } from "next/navigation";
import RecipeComment from "@/components/RecipeComment";
import { useAuth } from "@/store/useAuth";
import RecipeRating from "@/components/RecipeRating";
import RecipeDetailSkeleton from "@/components/skeleton/RecipeDetailSkeleton";
import RecipeCommentList from "@/components/RecipeCommentList";
import { useRecipeDetailStore } from "@/store/Recipedetail";
import { toast } from "sonner";
import NutritionView from "@/components/NutritionView";
import AuthorInfo from "@/components/AuthorInfo";
import RecipeCulturalNote from "@/components/RecipeCulturalNote";
import InstructionsView from "@/components/InstructionsView";
import IngredientsView from "@/components/IngredientsView";
import ActionButtons from "@/components/recipe/ActionButtons";
import BackNavigation from "@/components/BackNavigation";
import Link from "next/link";
import PreviewWarning from "@/components/PreviewWarning";
import YoutubeVideoSection from "@/components/recipe/YoutubeVideoSection";
import { motion, useReducedMotion } from "motion/react";
import Reveal from "@/components/Reveal";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function RecipeDetailPage() {
  const params = useParams();
  const { slug } = params;
  const user = useAuth((store) => store.user);
  const recipe = useRecipeDetailStore((state) => state.recipe);
  const loading = useRecipeDetailStore((state) => state.loading);
  const fetchRecipe = useRecipeDetailStore((state) => state.fetchRecipe);
  const error = useRecipeDetailStore((store) => store.error);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (error) {
      toast.error("An error occurred. Please try again.");
    }
  }, [error]);

  useEffect(() => {
    fetchRecipe(slug as string, user?.id);
  }, [slug, user]);

  const stats = recipe
    ? [
        {
          label: "Total Time",
          value:
            recipe.preptime && recipe.cooktime
              ? `${recipe.preptime + recipe.cooktime} min`
              : "Unknown",
          icon: Clock,
        },
        { label: "Servings", value: recipe.servings, icon: Group },
        { label: "Difficulty", value: recipe.difficulty, icon: Restaurant },
        {
          label: "Rating",
          value: recipe.average_rating ? recipe.average_rating : "N/A",
          icon: Star,
        },
      ]
    : [];

  return (
    <div className="min-h-screen ">
      <Header />
      {loading || !recipe ? (
        <RecipeDetailSkeleton />
      ) : (
        <div className="w-full max-w-7xl mx-auto px-6 py-12 space-y-6">
          {/* Back Navigation */}
          <BackNavigation pagename={"Recipes"} />

          {/* Preview Mode Warning */}
          <PreviewWarning
            slug={recipe.slug}
            postType="recipe"
            author_id={recipe?.author_id || ""}
            user_id={user?.id || ""}
            status={recipe?.status || ""}
          />

          {/* Recipe Header */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-10 items-start">
            {/* Image */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease }}
              className="group relative overflow-hidden rounded-2xl border border-border shadow-[0_24px_70px_-40px_hsl(var(--foreground)/0.45)]"
            >
              <img
                src={recipe.image.url || "/placeholder.svg"}
                alt={recipe.title}
                className="h-96 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
            </motion.div>

            {/* Info */}
            <div>
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease }}
                className="flex items-center gap-2 mb-4 flex-wrap"
              >
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {recipe.category?.name}
                </Badge>
                {recipe.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground border-transparent"
                  >
                    {tag}
                  </Badge>
                ))}
              </motion.div>

              <motion.h1
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16, ease }}
                className="heading-primary text-4xl md:text-5xl wrap-break-word max-w-full mb-3 font-gosh"
              >
                {recipe.title}
              </motion.h1>

              <motion.p
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.22, ease }}
                className="text-lg text-muted-foreground leading-relaxed mb-6"
              >
                {recipe.description}
              </motion.p>

              {/* Recipe Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={
                      reduce ? false : { opacity: 0, y: 14, scale: 0.97 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, delay: 0.3 + i * 0.07, ease }}
                    className="group/stat relative overflow-hidden rounded-xl border border-border bg-card p-5 text-center transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_40px_-22px_hsl(var(--primary)/0.4)] active:scale-[0.97]"
                  >
                    <span className="absolute inset-x-4 top-0 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 group-hover/stat:scale-x-100" />
                    <stat.icon
                      className="w-6 h-6 text-muted-foreground mx-auto mb-2 transition-colors duration-300 group-hover/stat:text-primary"
                      aria-hidden="true"
                    />
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                    <div className="text-base font-semibold text-foreground">
                      {stat.value}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.62, ease }}
              >
                <ActionButtons
                  recipe_id={recipe.id ?? ""}
                  user_id={user?.id ?? ""}
                />
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.7, ease }}
              >
                {recipe.author && <AuthorInfo author={recipe.author} />}
              </motion.div>
            </div>
          </div>

          {/* Recipe Content */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Instructions */}
              <Reveal>
                <InstructionsView instructions={recipe?.instructions} />
              </Reveal>

              {/* Ingredients */}
              <Reveal delay={0.05}>
                <IngredientsView ingredients={recipe?.ingredients} />
              </Reveal>

              {/* Cultural Note */}
              <Reveal delay={0.1}>
                <RecipeCulturalNote culturalNote={recipe?.culturalNote} />
              </Reveal>

              {/* youtube video section */}
              <Reveal delay={0.1}>
                <Card className="p-6 bg-card border border-border rounded-lg">
                  <YoutubeVideoSection
                    videoId={recipe.youtube_video_id}
                    videoQuery={recipe.youtube_search_query}
                  />
                </Card>
              </Reveal>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Nutrition */}
              <Reveal>
                <NutritionView nutrition={recipe?.nutrition} />
              </Reveal>

              <Reveal delay={0.05}>
                <RecipeRating
                  user_id={user?.id ?? ""}
                  recipe_id={recipe.id ?? ""}
                  rating={
                    recipe.rating.find((r) => r.user_id === user?.id)?.rating ||
                    0
                  }
                />
              </Reveal>

              {/* Comments */}
              <Reveal delay={0.1}>
                <Card className="p-6 bg-card border border-border rounded-lg">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                    <MessageRoundedDetail className="w-5 h-5 mr-2" />
                    Comments ({recipe.comments.length})
                  </h3>

                  {/* Add Comment */}
                  <RecipeComment user_id={user?.id} recipe_id={recipe.id} />

                  {/* Comments List */}
                  <RecipeCommentList
                    user_id={user?.id || ""}
                    comments={recipe.comments as PostComment[]}
                  />
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
