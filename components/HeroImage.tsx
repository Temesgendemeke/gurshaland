import Image from "next/image";
import React from "react";
import FloatingRecipeCard from "./FloatingRecipeCard";
import injera from "@/public/injera.webp";
import dorowet_image from "@/public/dorowet.webp";
import gursh_image from "@/public/gursha.webp";

const HeroImage = ({ cls }: { cls?: string }) => {
  return (
    <>
      <div className={`relative ${cls}`}>
        <div className="relative">
          <Image
            src={gursh_image}
            alt="Traditional Ethiopian platter with injera, doro wat, and various dishes"
            className="w-full h-[360px] sm:h-[440px] lg:h-[600px] object-cover rounded-3xl shadow-2xl"
          />

          {/* Floating Recipe Cards */}
          <FloatingRecipeCard
            cls={
              "absolute -top-6 -left-6 modern-card p-6 rounded-3xl shadow-xl max-w-[320px] hidden xl:block"
            }
            text={"Traditional Injera"}
            image={injera.src}
            rating={4.8}
          />

          <FloatingRecipeCard
            cls={
              "absolute -bottom-6 -right-6 modern-card p-6 rounded-3xl shadow-xl max-w-[280px] hidden xl:block"
            }
            rating={4.9}
            text={"Doro Wat"}
            image={dorowet_image.src}
          />

          <div className="absolute top-1/2 -left-8 -translate-y-1/2 hidden xl:block">
            <div className="modern-card bg-linear-to-br from-primary/10 to-popular/10 p-5 rounded-2xl shadow-2xl border border-primary/20 ring-1 ring-primary/20">
              <div className="text-center">
                <div className="text-3xl font-extrabold leading-none gradient-text-primary">
                  89
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground/90">
                  New Recipes
                </div>
                <div className="text-xs text-muted-foreground">This Week</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-linear-to-br from-primary/20 to-ethiopian-green/20 rounded-full opacity-30 blur-xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-linear-to-br from-warning/20 to-popular/20 rounded-full opacity-30 blur-xl"></div>
        </div>
      </div>
    </>
  );
};

export default HeroImage;
