import Image from "next/image";
import React from "react";
import gursh_image from "@/public/gursha.webp";

const HeroImage = ({ cls }: { cls?: string }) => {
  return (
    <>
      <div className={`relative ${cls}`}>
        <Image
          src={gursh_image}
          alt="Traditional Ethiopian platter with injera, doro wat, and various dishes"
          className="w-full h-[360px] sm:h-[440px] lg:h-[380px] object-cover rounded-lg shadow-sm"
        />
      </div>
    </>
  );
};

export default HeroImage;
