import React from "react";
import Link from "next/link";
import { CookingPot } from "lucide-react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-10 h-10 bg-gradient-to-br btn-primary-modern rounded-full flex items-center justify-center">
        <CookingPot className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-bold modern-logo capitalize">
        Gurshaland
      </div>
    </Link>
  );
};

export default Logo;
