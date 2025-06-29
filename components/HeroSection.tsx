import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Heart, Star, Utensils } from "lucide-react";
import injera from "@/public/injera.png";
import FloatingRecipeCard from "./FloatingRecipeCard";
import dorowet_image from "@/public/dorowet.png";
import HeroImage from "./HeroImage";

const HeroSection = () => {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 modern-card rounded-full px-4 py-2 mb-6 border border-emerald-200 dark:border-emerald-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Authentic Ethiopian Cuisine
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text-primary">Taste</span>
              <br />
              <span className="heading-primary">Ethiopia</span>
            </h1>

            <p className="text-xl md:text-2xl text-body mb-8 max-w-2xl mx-auto lg:mx-0 font-light">
              Discover, share, and celebrate the rich culinary traditions of
              Ethiopia. From traditional injera to aromatic coffee ceremonies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
              <Button
                asChild
                size="lg"
                className="btn-primary-modern text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
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
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-semibold px-8 py-4 text-lg rounded-full"
              >
                <Link href="/recipes/create">
                  <Heart className="w-5 h-5 mr-2" />
                  Share Your Recipe
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-emerald-600">500+</div>
                <div className="text-body">Recipes</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-yellow-600">1,200+</div>
                <div className="text-body">Community Members</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-red-600">50+</div>
                <div className="text-body">Cultural Stories</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-emerald-600">4.9</div>
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
