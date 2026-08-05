import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Heart, Utensils } from "lucide-react";
import HeroAiGenerator from "./HeroAiGenerator";

const HeroSection = () => {
  return (
    <section className="relative px-4 sm:px-6 py-14 sm:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] font-gosh">
              Taste <span className="text-primary">Ethiopia</span>
            </h1>

            <p className="text-muted-foreground sm:text-lg text-body mb-8 max-w-xl mx-auto lg:mx-0 font-light">
              Discover, share, and celebrate the rich culinary traditions of
              Ethiopia. From traditional injera to aromatic coffee ceremonies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Button
                asChild
                size="lg"
                className="btn-primary-modern font-semibold text-primary-foreground w-full sm:w-auto"
              >
                <Link href="/recipes">
                  <Utensils className="w-5 h-5 mr-2" />
                  Explore Recipes
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-primary w-full sm:w-auto"
              >
                <Link href="/recipes/create">
                  <Heart className="w-5 h-5 mr-2" />
                  Share Your Recipe
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Food Image with AI overlay */}
          <HeroAiGenerator />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
