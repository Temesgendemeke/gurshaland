"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const BackNav = () => {
  const router = useRouter();
  return (
    <div className="relative z-10 flex items-center justify-between w-full">
      <Button
        onClick={() => router.back()}
        className="flex items-center gap-2 px-4 py-1 rounded-md bg-transparent hover:bg-transparent transition-colors duration-200 text-xs font-medium group text-primary-foreground/60 hover:text-primary-foreground"
      >
        <ArrowLeft className="w-2 h-2" />
        Go Back
      </Button>
    </div>
  );
};

export default BackNav;
