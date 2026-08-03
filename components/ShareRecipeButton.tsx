import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const ShareRecipeButton = () => {
  return (
    <Button asChild className="btn-primary-modern rounded-full">
      <Link href="/recipes/create">
        <Plus className="w-4 h-4 mr-2" />
        Share Recipe
      </Link>
    </Button>
  );
};

export default ShareRecipeButton;
