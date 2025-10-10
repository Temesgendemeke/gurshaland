import Image from "next/image";
import React from "react";
import FloatingRecipeCard from "./FloatingRecipeCard";
import injera from "@/public/injera.webp";
import dorowet_image from "@/public/dorowet.webp";
import gursh_image from "@/public/gursha.webp";


const HeroImage = ({cls}: {cls?: string}) => {
  return (
    <>
      <div className={`relative ${cls}`}>
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
            image={injera.src}
            rating={4.8}
          />

          <FloatingRecipeCard
            cls={
              "absolute -bottom-4 -right-4 modern-card p-4 rounded-2xl shadow-lg max-w-[200px] hidden lg:block"
            }
            rating={4.9}
            text={"Doro Wat"}
            image={dorowet_image.src}
          />

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
    </>
  );
};

export default HeroImage;
