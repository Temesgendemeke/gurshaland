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
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/10 hover:bg-primary/20 border border-white/10 transition-colors duration-200 text-sm font-medium group text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Back
      </Button>
    </div>
  );
};

export default BackNav;
