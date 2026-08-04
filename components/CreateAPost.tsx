import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Plus } from "lucide-react";

interface CreateAPost {
  align?: "center" | "end" | "start" | undefined;
  cls?: string;
}

const CreateAPost = ({ align, cls }: CreateAPost) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="btn-primary-modern">
          <Plus className="w-4 h-4" />
          <span> Create a Post</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={`bg-background ${cls}`}>
        <DropdownMenuItem asChild>
          <Link href={"/recipes/create"}>Recipe</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/blog/create"}>Blog</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CreateAPost;
