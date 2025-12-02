import Link from "next/link";
import { PlusCircle } from "lucide-react";

const CreateNewPostButton = ({postType}: {postType: "Blog" | "Recipe"}) => {
    return (
        <div className="flex justify-end mb-6">
        <Link
        href={`${postType === 'Blog' ? "/blog/create" : "/recipes/create"}`}
        className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
      >
        <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
        <span>Create New {postType}</span>
        <span className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
      </Link>
      </div>
    );
};


export default CreateNewPostButton;