import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Plus, UtensilsCrossed, FileText } from "lucide-react";

interface CreateAPost {
  align?: "center" | "end" | "start" | undefined;
  cls?: string;
}

const CreateAPost = ({ align, cls }: CreateAPost) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium flex items-center space-x-1 w-full sm:w-auto justify-start sm:justify-center">
          <Plus className="w-4 h-4" />
          <span>Create a Post</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={`bg-background p-1.5 ${cls}`}
      >
        {/* <div className="mb-1 flex items-center gap-2.5 border-b border-border/70 px-2.5 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Plus className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              Create a Post
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Share with the community
            </p>
          </div>
        </div> */}

        <DropdownMenuItem asChild>
          <Link
            href="/recipes/create"
            className="gap-2.5 text-muted-foreground focus:text-foreground"
          >
            <UtensilsCrossed className="text-muted-foreground" />
            <span>Recipe</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/blog/create"
            className="gap-2.5 text-muted-foreground focus:text-foreground"
          >
            <FileText className="text-muted-foreground" />
            <span>Blog</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CreateAPost;
