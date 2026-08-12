import Image from "next/image";
import {
  CalendarDays,
  Clock,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { format_date } from "@/utils/formatdate";
import { Blog } from "@/utils/types/blog";

const ArticleHeader = ({ blogPost }: { blogPost: Blog }) => {
  const authorName =
    blogPost.author?.full_name || blogPost.author?.username || "Anonymous";

  return (
    <div className="mx-auto w-full">
      <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-primary">
        {blogPost?.category}
      </p>

      <h1 className="text-4xl font-black leading-[1.08] tracking-tighter text-foreground sm:text-5xl">
        {blogPost.title}
      </h1>

      <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {blogPost?.subtitle}
      </p>

      {/* Byline */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-border/70 py-5">
        <div className="flex items-center gap-3">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-muted text-sm font-bold text-muted-foreground">
            {blogPost?.author?.avatar ? (
              <Image
                src={blogPost.author.avatar}
                alt={authorName}
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              authorName[0]?.toUpperCase() || "A"
            )}
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {authorName}
            </p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {format_date(blogPost?.created_at as string)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {blogPost?.read_time} read
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Heart className="h-4 w-4" />
            Save
          </button>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <MessageCircle className="h-4 w-4" />
            Comment
          </button>
        </div>
      </div>

      {blogPost?.tags && blogPost.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 ">
          {blogPost.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted/80 px-3 py-1 text-xs font-medium text-muted-foreground border border-transparent "
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
