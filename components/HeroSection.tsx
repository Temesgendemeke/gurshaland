"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChefHat,
  Flame,
  Sparkles,
  Utensils,
} from "lucide-react";
import HeroAiGenerator from "./HeroAiGenerator";

const POPULAR_DISHES = [
  { label: "Doro Wat", q: "Doro Wat" },
  { label: "Teff Injera", q: "Injera" },
  { label: "Shiro", q: "Shiro" },
  { label: "Tibs", q: "Tibs" },
  { label: "Misir Wot", q: "Misir" },
];

const HeroSection = () => {
  const reduce = useReducedMotion();

  const enter = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.55,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  });

  return (
    <section className="relative pt-[clamp(2.5rem,1.5rem+2vw,4rem)] pb-4 sm:pb-8 lg:pb-12">
      {/* Subtle Ambient Lighting */}
      <div
        className="pointer-events-none absolute -top-8 -left-12 h-64 w-64 rounded-full bg-primary/[0.08] blur-3xl"
        aria-hidden="true"
      />

      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Left Content - Pragmatic & High-Converting Marketing */}
        <div className="text-center lg:text-left">
          {/* Pragmatic Eyebrow Badge */}
          {/* <motion.div
            {...enter(0)}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-3.5 py-1.5 text-xs font-semibold text-foreground backdrop-blur-xs shadow-xs"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-bold">Authentic & Tested</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-muted-foreground font-medium">
              Ethiopian Heritage & AI Culinary Tools
            </span>
          </motion.div> */}

          {/* Marketing-Driven Headline */}
          <motion.h1
            {...enter(0.06)}
            className="font-gosh mb-5 text-fluid-hero font-bold tracking-tight text-foreground text-balance"
          >
            Cook Authentic{" "}
            <span className="text-primary">Ethiopian Dishes</span> With
            Confidence.
          </motion.h1>

          {/* Pragmatic Value Proposition */}
          <motion.p
            {...enter(0.12)}
            className="mb-8 max-w-xl text-balance mx-auto lg:mx-0 text-base ml-1 text-muted-foreground leading-relaxed"
          >
            From slow-simmered berbere doro wat and fresh sourdough teff injera
            to wholesome fasting wats. Master traditional techniques with
            foolproof recipes, step-by-step guides, and smart AI kitchen tools.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            {...enter(0.18)}
            className="flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4 lg:justify-start"
          >
            <Button
              asChild
              size="lg"
              className="btn-primary-modern group h-12 w-full px-7 text-base font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 active:translate-y-px sm:w-auto"
            >
              <Link
                href="/recipes"
                className="inline-flex items-center justify-center gap-2.5"
              >
                <Utensils className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                <span>Explore Recipes</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="btn-secondary-modern h-12 w-full px-6 text-base font-semibold sm:w-auto hover:border-primary/40 hover:text-primary transition-all backdrop-blur-xs"
            >
              <Link
                href="/ai-features/generate-recipe"
                className="inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4 text-primary transition-transform duration-200 group-hover:rotate-12" />
                <span>AI Recipe Generator</span>
              </Link>
            </Button>
          </motion.div>

          {/* Popular Dishes Quick Tags */}
          <motion.div
            {...enter(0.22)}
            className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground lg:justify-start"
          >
            <span className="font-semibold text-foreground/85 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-primary" /> Popular:
            </span>
            {POPULAR_DISHES.map((dish) => (
              <Link
                key={dish.label}
                href={`/recipes?search=${encodeURIComponent(dish.q)}`}
                className="inline-flex items-center rounded-full border border-border/80 bg-card/60 px-3 py-1 text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all"
              >
                {dish.label}
              </Link>
            ))}
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
