import Image from "next/image";
import React from "react";
import gursh_image from "@/public/gursha.webp";
import BackNav from "./BackNav";
import ScrollVelocity from "@/components/ScrollVelocity";

const AuthVisual = () => {
  return (
    <div className="relative hidden lg:flex flex-col justify-between max-w-screen rounded-sm m-1 mb-1 overflow-hidden text-white lg:sticky lg:top-0 lg:h-[calc(100vh-0.5rem)]">
      {/* Background Image + Scrim */}
      <div className="absolute inset-0 z-0 bg-neutral-900">
        <Image
          src={gursh_image}
          alt="Ethiopian Cuisine"
          fill
          className="object-cover opacity-95  saturate-50 w-full h-full scale-125"
          priority
          sizes="30vw"
        />
        {/* Cinematic scrim — keeps text legible at every scroll/zoom level */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/85" /> */}

        {/* Subtle grain overlay for texture (section-scoped) */}
        {/* <div className="absolute  bg-grain opacity-10" /> */}
      </div>

      {/* <div className="absolute bottom-4 right-0 left-0">
        <ScrollVelocity
          texts={["Gursha", "Food"]}
          velocity={100}
          className="custom-scroll-text font-gosh text-2xl"
          numCopies={20}
          damping={50}
          stiffness={400}
        />
      </div> */}

      {/* Top Bar */}
      {/* <div className="relative z-10 p-12 lg:p-16 pb-0">
        <BackNav />
      </div> */}

      {/* Bottom Content */}
      {/* <div className="relative z-10 p-12 lg:p-16 pt-0">
        <div className="max-w-lg rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 lg:p-10">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-secondary">
            Ethiopian Cuisine
          </p>
          <h2 className="mt-4 text-[clamp(2rem,1.6rem+1.4vw,3.25rem)] font-bold font-gosh tracking-tight leading-[1.1] text-white">
            Capturing Flavors, <br />
            <span className="text-secondary">Creating Memories</span>
          </h2>
          <p className="mt-5 text-base lg:text-lg text-white/85 leading-relaxed font-normal">
            Join our community of food lovers to explore authentic recipes,
            cultural stories, and vibrant flavors.
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default AuthVisual;
