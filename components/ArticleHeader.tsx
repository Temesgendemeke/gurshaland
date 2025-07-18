import React from "react";
import { Button } from "./ui/button";
import {
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  User,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { format_date } from "@/utils/formatdate";
import { Blog } from "@/utils/types/blog";

interface ArticleHeaderProps {
  blogPost: Blog;
}

const ArticleHeader = ({ blogPost }: ArticleHeaderProps) => {
  return (
    <div className="mb-8">
      <Badge className="mb-4 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
        {blogPost?.category}
      </Badge>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {blogPost.title}
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
        {blogPost?.subtitle}
      </p>

      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>{blogPost?.author?.full_name || blogPost?.author?.username || "noname"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{format_date(blogPost?.created_at as string)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{blogPost?.read_time} read</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {blogPost?.tags?.map((tag: string) => (
          <Badge
            key={tag}
            variant="secondary"
            className="dark:bg-gray-700 dark:text-gray-300"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex gap-4 mb-8">
        <Button
          variant="outline"
          size="sm"
          className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
        >
          <Heart className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Comment
        </Button>
      </div>
    </div>
  );
};

export default ArticleHeader;
