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
    <section className="relative pt-[clamp(3rem,2rem+2vw,4.5rem)] pb-4 sm:pb-8 lg:pb-12">
      {/* Subtle Ambient Lighting */}
      <div
        className="pointer-events-none absolute -top-8 -left-12 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden="true"
      />

      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Left Content */}
        <div className="text-center lg:text-left">
          <motion.h1
            {...enter(0)}
            className="font-gosh mb-6 text-fluid-hero font-bold tracking-tight text-foreground text-balance"
          >
            Taste <span className="text-primary">Ethiopia</span>
          </motion.h1>

          <motion.p
            {...enter(0.1)}
            className="text-body mb-8 max-w-xl text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed text-balance mx-auto lg:mx-0"
          >
            Doro wat simmered in berbere, injera fresh off the stove, coffee
            ceremony poured the slow way. Ethiopian kitchens, shared here.
          </motion.p>

          <motion.div
            {...enter(0.2)}
            className="flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4 lg:justify-start"
          >
            <Button
              asChild
              size="lg"
              className="btn-primary-modern group h-12 w-full px-7 text-base font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 active:translate-y-px sm:w-auto"
            >
              <Link href="/recipes" className="inline-flex items-center justify-center gap-2.5">
                <Utensils className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                <span>Explore Recipes</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 w-full border-border/80 bg-background/60 px-7 text-base font-semibold text-foreground backdrop-blur-xs transition-all hover:border-primary/50 hover:bg-card hover:text-primary active:translate-y-px sm:w-auto"
            >
              <Link href="/recipes/create" className="inline-flex items-center justify-center gap-2">
                <Heart className="h-4 w-4 text-primary transition-transform duration-200 group-hover:scale-110" />
                <span>Share Your Recipe</span>
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
