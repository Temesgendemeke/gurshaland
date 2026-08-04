import React from "react";
import Link from "next/link";
import { CookingPot } from "lucide-react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="text-3xl modern-logo capitalize font-bold ">
        Gurshaland
      </div>
    </Link>
  );
};

export default Logo;
