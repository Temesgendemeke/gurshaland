"use client";

import Image from "next/image";
import React from "react";
import grusha_image from "@/public/hero.jpg";

const HeroImage = ({ cls }: { cls?: string }) => {
  return (
    <div className={`hidden lg:block relative ${cls || ""} mx-auto w-full max-w-lg lg:max-w-none`}>
      <div
        className="pointer-events-none absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-primary/10 via-[#26446c]/15 to-transparent blur-2xl"
        aria-hidden="true"
      />

      <div className="relative h-[480px] sm:h-[540px] lg:h-[500px] w-full overflow-hidden rounded-t-[5.5rem] sm:rounded-t-[7rem] lg:rounded-t-[8rem] rounded-b-3xl border border-border bg-muted/30">
        <Image
          src={grusha_image}
          alt="Traditional Ethiopian dining with injera and wat"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default HeroImage;
