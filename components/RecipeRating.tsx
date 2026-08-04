"use client";
import React, { useState, useRef } from "react";
import { StarIcon as Star } from "@heroicons/react/24/outline";
import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Rating } from "@/utils/types/recipe";
import { postRating } from "@/actions/Recipe/rating";
import { Card } from "./ui/card";

interface RecipeRatingProps {
  user_id: string;
  recipe_id: string;
  rating: number;
}

const RecipeRating = ({ user_id, recipe_id, rating }: RecipeRatingProps) => {
  const [userRating, setUserRating] = useState<number>(rating);
  const [hoverRating, setHoverRating] = useState<number>(rating);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);
  const router = useRouter();
  const ratingRef = useRef<HTMLDivElement>(null);

  const handleRate = async (rate: number) => {
    if (!user_id || !recipe_id) {
      return router.push("/login");
    }
    setUserRating(rate);
    setRatingSubmitted(true);
    setTimeout(() => setRatingSubmitted(false), 1200);
    try {
      await postRating({ user_id, recipe_id, rating: rate });
    } catch (error) {
      toast.error("Failed to submit rating. Please try again.");
    }
  };

  return (
    <Card className="p-6 bg-card border border-border rounded-lg shadow-modern">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
        Rate this recipe
      </h2>
      <div ref={ratingRef} className="flex items-center space-x-2 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleRate(star)}
            className="p-1 rounded transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            type="button"
          >
            {(hoverRating || userRating) >= star ? (
              <SolidStar className="w-8 h-8 text-warning" />
            ) : (
              <Star className="w-8 h-8 text-muted-foreground/30" />
            )}
          </button>
        ))}
        {ratingSubmitted && (
          <span className="ml-4 text-primary font-semibold">
            Thank you for rating!
          </span>
        )}
      </div>
    </Card>
  );
};

export default RecipeRating;
