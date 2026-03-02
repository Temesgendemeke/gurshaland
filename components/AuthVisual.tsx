import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import gursh_image from "@/public/gursha.webp";
import { Button } from "./ui/button";
import BackNav from "./BackNav";

const AuthVisual = () => {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 lg:p-16 text-white h-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-neutral-900">
        <Image
          src={gursh_image}
          alt="Ethiopian Cuisine"
          fill
          className="object-cover opacity-90 scale-110 saturate-50"
          priority
          sizes="50vw"
        />
        {/* Professional dark scrim for text readability - Neutral, no tint */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Subtle grain overlay for texture (section-scoped) */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <filter id="grain-section">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.1"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
              />
              <feComponentTransfer>
                <feFuncA type="gamma" amplitude="1" exponent="1.3" offset="0" />
              </feComponentTransfer>
            </filter>
            <rect width="100%" height="100%" filter="url(#grain-section)" />
          </svg>
        </div>
      </div>

      {/* Top Bar */}
      {/* <div className="relative z-10 flex items-center justify-between w-full">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/10 hover:bg-primary/20 border border-white/10 transition-colors duration-200 text-sm font-medium group text-white"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to website
        </Button>
      </div> */}
      <BackNav />

      {/* Bottom Content */}
      <div className="relative z-10 space-y-6  mb-12">
        <div className="h-1 w-12 bg-white-/80 rounded-full" />
        <h2 className="text-5xl font-bold font-gosh tracking-tight leading-[1.1] text-white/70 ">
          Capturing Flavors, <br />
          <span className="text-primary">Creating Memories</span>
        </h2>

        <p className="text-lg text-white/60 leading-relaxed font-normal max-w-lg">
          Join our community of food lovers to explore authentic recipes,
          cultural stories, and vibrant flavors.
        </p>
      </div>

      

      {/* Shadow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default AuthVisual;
