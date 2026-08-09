"use client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const GoBackNoText = () => {
  const router = useRouter();
  return (
    <div className="absolute top-4 left-4 z-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="flex items-center text-primary-foreground hover:text-primary-foreground  gap-1.5 sm:gap-2   transition-colors duration-200 text-xs sm:text-sm font-medium bg-transparent hover:bg-primary p-2 rounded-full"
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default GoBackNoText;
