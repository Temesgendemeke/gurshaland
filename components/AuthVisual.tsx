import Image from "next/image";
import React from "react";
import gursh_image from "@/public/hero.jpg";

const AuthVisual = () => {
  return (
    <div className="relative hidden lg:flex flex-col justify-between max-w-screen rounded-sm m-1 mb-1 overflow-hidden text-white lg:sticky lg:top-0 lg:h-[calc(100vh-0.5rem)]">
      {/* Background Image + Scrim */}
      <div className="absolute inset-0 z-0 bg-neutral-900">
        <Image
          src={gursh_image}
          alt="Ethiopian Cuisine"
          fill
          className="object-cover opacity-95 w-full h-full"
          priority
          sizes="30vw"
        />
      </div>
    </div>
  );
};

export default AuthVisual;
