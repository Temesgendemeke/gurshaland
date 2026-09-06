"use client";
import React, { useState, useRef } from "react";
import { StarIcon as Star } from "@heroicons/react/24/outline";
import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { postRating } from "@/actions/Recipe/rating";

interface RecipeRatingProps {
  user_id: string;
  recipe_id: string;
  rating: number;
  isOwner?: boolean;
}

const RecipeRating = ({
  user_id,
  recipe_id,
  rating,
  isOwner = false,
}: RecipeRatingProps) => {
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

  if (isOwner) return null;

  return (
    <div className="rounded-xl border border-border bg-card/50 p-5">
      <h3 className="font-gosh text-base font-semibold tracking-tight text-foreground mb-3">
        Rate this Recipe
      </h3>
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
                <SolidStar className="w-7 h-7 text-warning" />
              ) : (
                <Star className="w-7 h-7 text-muted-foreground/30" />
              )}
            </button>
          ))}
          {ratingSubmitted && (
            <span className="ml-4 text-primary font-semibold">
              Thank you for rating!
            </span>
          )}
        </div>
    </div>
  );
};

export default RecipeRating;
