import Link from "next/link";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, User } from "lucide-react";
import { format_date } from "@/utils/formatdate";
import { Blog } from "@/utils/types/blog";

export default function BlogPostCard({ post }: { post: Blog }) {
  return (
    <Link key={post.slug} href={`/blog/${post.slug}`}>
      <Card className="overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-emerald-100 dark:border-emerald-800 h-full">
        <div className="relative">
          <img
            src={post?.image?.url || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-gray-700 hover:bg-white">
              {post.category}
            </Badge>
          </div>
        </div>
        <div className="p-6 flex flex-col h-full">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
            {post.subtitle}
          </p>
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags?.slice(0, 2).map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="truncate">{post.author?.full_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{post.read_time} read</span>
            </div>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {format_date(post?.created_at as string)}
          </div>
        </div>
      </Card>
    </Link>
  );
}
