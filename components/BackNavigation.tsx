"use client";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  route?: string;
  pagename?: string;
}

const BackNavigation = ({ route, pagename }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const handleGoBack = () => {
    if (route) {
      router.push(route);
      return;
    }
    router.back();
  };
  return (
    <Button
      asChild
      variant="ghost"
      className="hover:bg-emerald-100 cursor-pointer dark:hover:bg-emerald-900/50 justify-start"
      onClick={handleGoBack}
    >
      <span>
      <ArrowLeft className="w-4 h-4" />
      {from ? `Back to ${pagename}` : "Go back"}
      </span>
    </Button>
  );
};

export default BackNavigation;
