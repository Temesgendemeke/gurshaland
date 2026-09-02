import Image from "next/image";
import {
  CalendarDaysIcon,
  ClockIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { format_date } from "@/utils/formatdate";
import { formatCount } from "@/utils/formatCount";
import { Blog } from "@/utils/types/blog";

interface ArticleHeaderProps {
  blogPost: Blog;
  viewCount?: number;
}

const ArticleHeader = ({ blogPost, viewCount }: ArticleHeaderProps) => {
  const authorName =
    blogPost.author?.full_name || blogPost.author?.username || "Anonymous";

  return (
    <div className="w-full">
      {/* {blogPost.category && (
        <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {blogPost.category}
        </p>
      )} */}

      <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {blogPost.title}
      </h1>

      {blogPost.subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {blogPost.subtitle}
        </p>
      )}

      {/* Byline */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
            {blogPost?.author?.avatar ? (
              <Image
                src={blogPost.author.avatar}
                alt={authorName}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <span className="text-xs font-semibold text-muted-foreground">
                {authorName[0]?.toUpperCase() || "A"}
              </span>
            )}
          </span>
          <span className="text-sm font-medium text-foreground">
            {authorName}
          </span>
        </div>

        <span className="text-border/50">·</span>

        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <CalendarDaysIcon className="h-3.5 w-3.5" />
          {format_date(blogPost?.created_at as string)}
        </span>

        <span className="text-border/50">·</span>

        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <ClockIcon className="h-3.5 w-3.5" />
          {blogPost?.read_time}
        </span>

        {viewCount !== undefined && viewCount > 0 && (
          <>
            <span className="text-border/50">·</span>
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <EyeIcon className="h-3.5 w-3.5" />
              {formatCount(viewCount)}
            </span>
          </>
        )}
      </div>

      {blogPost?.tags && blogPost.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {[...new Set(blogPost.tags)].map((tag) => (
            <span
              key={tag}
              className="text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleHeader;
