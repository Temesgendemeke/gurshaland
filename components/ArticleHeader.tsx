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
      <Badge className="mb-4 bg-primary/10 text-primary">
        {blogPost?.category}
      </Badge>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
        {blogPost.title}
      </h1>
      <p className="text-xl text-muted-foreground mb-6">{blogPost?.subtitle}</p>

      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>
            {blogPost?.author?.full_name ||
              blogPost?.author?.username ||
              "noname"}
          </span>
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
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex gap-4 mb-8">
        <Button
          variant="outline"
          size="sm"
          className="border-primary/40 text-primary hover:bg-primary/10"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-primary/40 text-primary hover:bg-primary/10"
        >
          <Heart className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-primary/40 text-primary hover:bg-primary/10"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Comment
        </Button>
      </div>
    </div>
  );
};

export default ArticleHeader;
