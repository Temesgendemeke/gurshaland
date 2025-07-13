"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
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
    <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <h2 className="text-xl font-bold dark:bg-gray-800 dark:text-gray-100 mb-4 flex items-center">
        Rate this recipe
      </h2>
      <div ref={ratingRef} className="flex items-center space-x-2 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.2, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleRate(star)}
            className="focus:outline-none"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            type="button"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                (hoverRating || userRating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
              fill={
                (hoverRating || userRating) >= star ? "currentColor" : "none"
              }
            />
          </motion.button>
        ))}
        <AnimatePresence>
          {ratingSubmitted && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="ml-4 text-emerald-600 font-semibold"
            >
              Thank you for rating!
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default RecipeRating;
