import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CreateNewPostButton = ({
  postType,
  className,
}: {
  postType: "Blog" | "Recipe";
  className?: string;
}) => {
  return (
    <Button asChild className={cn("gap-2", className)}>
      <Link
        href={`${postType === "Blog" ? "/blog/create" : "/recipes/create"}`}
      >
        <PlusCircle className="h-5 w-5" />
        Create New {postType}
      </Link>
    </Button>
  );
};

export default CreateNewPostButton;
