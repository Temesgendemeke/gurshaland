import React from "react";
import Link from "next/link";
import { CookingPot } from "lucide-react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="text-2xl font-bold modern-logo capitalize">
        Gurshaland
      </div>
    </Link>
  );
};

export default Logo;
