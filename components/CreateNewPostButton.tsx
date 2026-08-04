import Link from "next/link";
import { PlusCircle } from "lucide-react";

const CreateNewPostButton = ({ postType }: { postType: "Blog" | "Recipe" }) => {
  return (
    <div className="flex justify-end mb-6">
      <Link
        href={`${postType === "Blog" ? "/blog/create" : "/recipes/create"}`}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <PlusCircle className="w-5 h-5" />
        <span>Create New {postType}</span>
      </Link>
    </div>
  );
};

export default CreateNewPostButton;
