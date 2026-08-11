import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { format_date } from "@/utils/formatdate";
import { Blog } from "@/utils/types/blog";

export default function BlogPostCard({ post }: { post: Blog }) {
  const authorName =
    post.author?.full_name || post.author?.username || "Anonymous";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={post?.image?.url || "/placeholder.svg"}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary">
          {post.category}
        </p>

        <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
          {post.title}
        </h3>

        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.subtitle}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-between border-t border-border/70 pt-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-muted text-xs font-bold text-muted-foreground">
                {post.author?.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={authorName}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  authorName[0]?.toUpperCase() || "A"
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">
                  {authorName}
                </p>
                <p className="text-[0.6875rem] text-muted-foreground">
                  {format_date(post?.created_at as string)} · {post.read_time}
                </p>
              </div>
            </div>

            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
