import Image from "next/image";
import React from "react";
import gursh_image from "@/public/gursha.png";
import { Button } from "./ui/button";
import Link from "next/link";
import { Heart, Star, Utensils } from "lucide-react";
import injera from "@/public/injera.png";
import FloatingRecipeCard from "./FloatingRecipeCard";

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
          <div className="relative">
            <div className="relative">
              <Image
                src={gursh_image}
                alt="Traditional Ethiopian platter with injera, doro wat, and various dishes"
                className="w-full h-[500px] lg:h-[600px] object-cover rounded-3xl shadow-2xl"
              />

              {/* Floating Recipe Cards */}
              <FloatingRecipeCard
                cls={
                  "absolute -top-4 -left-4 modern-card p-4 rounded-2xl shadow-lg max-w-[250px] hidden lg:block"
                }
                text={"Traditional Injera"}
                image={injera}
                rating={4.8}
              />

              {/* <div className=>
                <div className="flex items-center space-x-3">
                  <img
                    src="/placeholder.svg?height=50&width=50"
                    alt="Doro Wat"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-sm heading-primary"></h4>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 text-yellow-500 fill-current">
                        ⭐
                      </div>
                      <span className="text-xs text-body-muted">4.9</span>
                    </div>
                  </div>
                </div>
              </div> */}
              <FloatingRecipeCard cls={"absolute -bottom-4 -right-4 modern-card p-4 rounded-2xl shadow-lg max-w-[200px] hidden lg:block"} rating={4.9} text={"Doro Wat"} image={""} />/>

              <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 modern-card p-3 rounded-xl shadow-lg hidden lg:block">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">89</div>
                  <div className="text-xs text-body-muted">New Recipes</div>
                  <div className="text-xs text-body-muted">This Week</div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
              <div className="absolute top-1/4 -right-4 w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-500"></div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-emerald-200 to-emerald-300 dark:from-emerald-800 dark:to-emerald-900 rounded-full opacity-30 blur-xl"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-yellow-200 to-orange-300 dark:from-yellow-800 dark:to-orange-900 rounded-full opacity-30 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
