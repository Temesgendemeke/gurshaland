import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Heart, Utensils } from "lucide-react";
import HeroImage from "./HeroImage";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden text-foreground px-4 sm:px-6 py-14 sm:py-20">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 modern-card rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-6 border border-primary/20 text-foreground">
              <div className="w-2 h-2 bg-ethiopian-green rounded-full"></div>
              <div className="w-2 h-2 bg-ethiopian-yellow rounded-full"></div>
              <div className="w-2 h-2 bg-ethiopian-red rounded-full"></div>
              <span className="text-xs sm:text-sm font-medium">
                Authentic Ethiopian Cuisine
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] font-gosh">
              <span className="gradient-text-primary">Taste</span>
              <br />
              <span className="heading-primary font-gosh">Ethiopia</span>
            </h1>

            <p className="text-muted-foreground sm:text-lg md:text-xl text-body mb-8 max-w-2xl mx-auto lg:mx-0 font-light">
              Discover, share, and celebrate the rich culinary traditions of
              Ethiopia. From traditional injera to aromatic coffee ceremonies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-10 sm:mb-12">
              <Button
                asChild
                size="lg"
                className="btn-primary-modern font-semibold text-white px-8 py-4  rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
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
                className="border-2 border-primary text-primary hover:bg-primary/5 font-semibold px-8 py-4 rounded-full w-full sm:w-auto"
              >
                <Link href="/recipes/create">
                  <Heart className="w-5 h-5 mr-2" />
                  Share Your Recipe
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-5 sm:gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold gradient-text-primary">
                  500+
                </div>
                <div className="text-body">Recipes</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold gradient-text-primary">
                  1,200+
                </div>
                <div className="text-body">Community Members</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold gradient-text-primary">
                  50+
                </div>
                <div className="text-body">Cultural Stories</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold gradient-text-primary">
                  4.9
                </div>
                <div className="text-body">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Food Image */}
          <HeroImage />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
