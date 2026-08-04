"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className=" flex flex-col items-center justify-center h-screen text-foreground">
      <h1 className="text-5xl md:text-7xl font-bold text-destructive tracking-widest">
        404
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground mt-4">
        Oops! The page you are looking for does not exist.
      </p>
      <Button
        onClick={() => router.back()}
        variant="outline"
        className="mt-8 px-8 py-3 font-bold"
      >
        Go Back
      </Button>
    </div>
  );
};

export default NotFound;
