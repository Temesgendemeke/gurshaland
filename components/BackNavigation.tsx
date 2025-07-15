"use client";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  route?: string;
  pagename: string;
}

const BackNavigation = ({ route, pagename }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const handleGoBack = () => {
    if (from) {
      router.push(`/${from}`);
    } else {
      router.back();
    }
  };
  return (
    <Button
      asChild
      variant="ghost"
      className="mb-6 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
      onClick={handleGoBack}
    >
      <span>
        <ArrowLeft className="w-4 h-4 mr-2" />
        {from ? "Go back" : `Back to ${pagename}`}
      </span>
    </Button>
  );
};

export default BackNavigation;
