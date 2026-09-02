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
  ArrowLeftIcon as ArrowLeft,
} from "@heroicons/react/24/outline";
import { PostComment } from "@/utils/types/recipe";
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
import Link from "next/link";
import YoutubeVideoSection from "@/components/recipe/YoutubeVideoSection";
import { motion, useReducedMotion } from "motion/react";
import Reveal from "@/components/Reveal";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function RecipePreviewPage() {
  const user = useAuth((store) => store.user);
  const { recipe, loading, isPreview, setPreviewRecipe } = useRecipeDetailStore();
  const reduce = useReducedMotion();

  // Check if we have a recipe in sessionStorage (for page refresh)
  useEffect(() => {
    if (!isPreview && !recipe) {
      try {
        const stored = sessionStorage.getItem("recipe_preview");
        if (stored) {
          const parsed = JSON.parse(stored);
          setPreviewRecipe(parsed);
        }
      } catch {
        // ignore
      }
    }
  }, [isPreview, recipe, setPreviewRecipe]);

  if (loading || !recipe) {
    return (
      <div className="min-h-screen">
        <Header />
        <RecipeDetailSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="w-full max-w-7xl mx-auto px-6 py-12 space-y-6">
        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Preview Banner */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-primary">
          Preview mode — this recipe hasn&apos;t been saved yet.{" "}
          <ActionButtons
            recipe_id={recipe.id ?? ""}
            user_id={user?.id ?? ""}
            isOwner={!!user?.id}
          />
        </div>

        {/* Recipe Header */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-10">
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
              {[
                { label: "Total Time", value: recipe.preptime && recipe.cooktime ? `${recipe.preptime + recipe.cooktime} min` : "Unknown", icon: Clock },
                { label: "Servings", value: recipe.servings, icon: Group },
                { label: "Difficulty", value: recipe.difficulty, icon: Restaurant },
                { label: "Rating", value: recipe.average_rating ? recipe.average_rating : "N/A", icon: Star },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={reduce ? false : { opacity: 0, y: 14, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, delay: 0.3 + i * 0.07, ease }}
                  className="group/stat relative overflow-hidden rounded-xl border border-border bg-card p-5 text-center transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_40px_-22px_hsl(var(--primary)/0.4)] active:scale-[0.97]"
                >
                  <span className="absolute inset-x-4 top-0 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 group-hover/stat:scale-x-100" />
                  <stat.icon className="w-6 h-6 text-muted-foreground mx-auto mb-2 transition-colors duration-300 group-hover/stat:text-primary" aria-hidden="true" />
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="text-base font-semibold text-foreground">{stat.value}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.62, ease }}
            >
              {recipe.author && <AuthorInfo author={recipe.author} />}
            </motion.div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <Reveal>
              <InstructionsView instructions={recipe?.instructions} />
            </Reveal>
            <Reveal delay={0.05}>
              <RecipeCulturalNote culturalNote={recipe?.culturalNote} />
            </Reveal>
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
            <Reveal>
              <IngredientsView ingredients={recipe?.ingredients} />
            </Reveal>
            <Reveal delay={0.05}>
              <NutritionView nutrition={recipe?.nutrition} />
            </Reveal>
            <Reveal delay={0.1}>
              <RecipeRating
                user_id={user?.id ?? ""}
                recipe_id={recipe.id ?? ""}
                rating={recipe.rating.find((r) => r.user_id === user?.id)?.rating || 0}
                isOwner={!!user?.id}
              />
            </Reveal>
            <Reveal delay={0.15}>
              <Card className="p-6 bg-card border border-border rounded-lg">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                  <MessageRoundedDetail className="w-5 h-5 mr-2" />
                  Comments ({recipe.comments.length})
                </h3>
                <RecipeComment
                  user_id={user?.id}
                  recipe_id={recipe.id}
                  isOwner={!!user?.id}
                />
                <RecipeCommentList
                  user_id={user?.id || ""}
                  comments={recipe.comments as PostComment[]}
                />
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}