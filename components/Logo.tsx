import React from "react";
import Link from "next/link";
import { CookingPot } from "lucide-react";

const Logo = () => {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform duration-200 group-hover:-rotate-3">
        <CookingPot className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="font-gosh text-2xl font-bold tracking-tight text-foreground">
        Gurshaland
      </span>
    </Link>
  );
};

export default Logo;
