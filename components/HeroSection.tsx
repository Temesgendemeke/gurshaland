"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Heart, Utensils } from "lucide-react";
import HeroAiGenerator from "./HeroAiGenerator";

const HeroSection = () => {
  const reduce = useReducedMotion();

  const enter = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  });

  return (
    <section className="relative pt-[clamp(4rem,3rem+2vw,5rem)]">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        {/* Left Content */}
        <div className="text-center lg:text-left">
          <motion.h1
            {...enter(0)}
            className="font-gosh mb-6 text-fluid-hero font-bold"
          >
            Taste <span className="text-primary">Ethiopia</span>
          </motion.h1>

          <motion.p
            {...enter(0.1)}
            className="font-light text-body mb-8 max-w-xl text-muted-foreground sm:text-lg mx-auto lg:mx-0"
          >
            Doro wat simmered in berbere, injera fresh off the stove, coffee
            ceremony poured the slow way. Ethiopian kitchens, shared here.
          </motion.p>

          <motion.div
            {...enter(0.2)}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <Button
              asChild
              size="lg"
              className="btn-primary-modern w-full font-semibold text-primary-foreground sm:w-auto"
            >
              <Link href="/recipes">
                <Utensils className="mr-2 h-5 w-5" />
                Explore Recipes
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full text-primary sm:w-auto"
            >
              <Link href="/recipes/create">
                <Heart className="mr-2 h-5 w-5" />
                Share Your Recipe
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Right Content - Hero Food Image with AI overlay */}
        <motion.div {...enter(0.15)} className="relative">
          <HeroAiGenerator />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
