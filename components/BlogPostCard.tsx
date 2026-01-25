import Link from "next/link";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, User } from "lucide-react";
import { format_date } from "@/utils/formatdate";
import { Blog } from "@/utils/types/blog";

export default function BlogPostCard({ post }: { post: Blog }) {
  return (
    <Link key={post.slug} href={`/blog/${post.slug}`}>
      <Card className="overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group bg-card/70 backdrop-blur-sm border-primary/20 h-full">
        <div className="relative">
          <img
            src={post?.image?.url || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge
              variant="secondary"
              className="bg-background/80 text-foreground backdrop-blur border border-border/50"
            >
              {post.category}
            </Badge>
          </div>
        </div>
        <div className="p-6 flex flex-col h-full">
          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">
            {post.subtitle}
          </p>
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags?.slice(0, 2).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="truncate">{post.author?.full_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{post.read_time} read</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {format_date(post?.created_at as string)}
          </div>
        </div>
      </Card>
    </Link>
  );
}
