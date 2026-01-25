import Link from "next/link";
import { PlusCircle } from "lucide-react";

const CreateNewPostButton = ({ postType }: { postType: "Blog" | "Recipe" }) => {
  return (
    <div className="flex justify-end mb-6">
      <Link
        href={`${postType === "Blog" ? "/blog/create" : "/recipes/create"}`}
        className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
        <span>Create New {postType}</span>
        <span className="absolute inset-0 rounded-lg bg-primary-foreground opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
      </Link>
    </div>
  );
};

export default CreateNewPostButton;
