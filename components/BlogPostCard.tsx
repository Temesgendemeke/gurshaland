import Link from "next/link";
import Image from "next/image";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, Calendar, ArrowRight, Hash } from "lucide-react";
import { format_date } from "@/utils/formatdate";
import { Blog } from "@/utils/types/blog";
import { cn } from "@/lib/utils";

export default function BlogPostCard({ post }: { post: Blog }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group h-full block">
      <Card className="flex h-full flex-col overflow-hidden border border-muted bg-card shadow-sm hover:shadow-sm transition-colors">
        {/* Image Section */}
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post?.image?.url || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Category Badge */}
          <div className="absolute left-3 top-3">
            <Badge className="border-0 bg-background text-foreground font-medium hover:bg-muted shadow-sm">
              {post.category}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-5">
          {/* Date & Read Time */}
          <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format_date(post?.created_at as string)}</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.read_time}</span>
            </div>
          </div>

          <h3 className="mb-2 line-clamp-2 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h3>

          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.subtitle}
          </p>

          <div className="mt-auto">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={`${post.slug}-tag-${idx}`}
                    className="inline-flex items-center text-[10px] font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md"
                  >
                    <Hash className="w-2.5 h-2.5 mr-1 opacity-50" /> {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 overflow-hidden rounded-full border border-border bg-muted shrink-0 relative">
                  {post.author?.avatar ? (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.full_name}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-bold text-muted-foreground">
                      {post.author?.full_name?.[0]?.toUpperCase() || "A"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground line-clamp-1">
                    {post.author?.full_name || "Anonymous"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    @{post.author?.username || "unknown"}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              {/* <div className="rounded-full border border-border bg-background p-2 text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                <ArrowRight className="h-4 w-4" />
              </div> */}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
