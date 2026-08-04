import React from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StatsCardSkeleton } from "@/components/ui/loading-skeleton";

interface StatsCardProps {
  name: string;
  count: number;
  Icon: LucideIcon;
  className?: string;
  loading: Boolean;
  type: "post" | "follower";
  published_posts_count?: number;
  draft_posts_count?: number;
}

const StatsCard = ({
  name,
  count,
  Icon,
  className,
  loading,
  type,
  published_posts_count,
  draft_posts_count,
}: StatsCardProps) => {
  if (loading) {
    return <StatsCardSkeleton className={className} />;
  }

  return (
    <Link
      href={`/dashboard/${name}`}
      aria-label={`${name} stats`}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card",
        "shadow-sm hover:shadow-sm transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 dark:focus:ring-offset-background",
        "p-5 aspect-[5/3]",
        className,
      )}
    >
      {/* icon */}
      <div
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg
        bg-primary/10 text-primary dark:text-primary dark:bg-primary/15"
      >
        <Icon className="h-5 w-5" />
      </div>
      {/* content */}
      {
        <div className="relative h-full flex flex-col justify-end">
          <div className="text-4xl font-bold tracking-tight text-foreground select-none">
            {count.toLocaleString()}
          </div>
          <p className="mt-1 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {name}
          </p>

          {type === "post" && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg p-3 ring-1 ring-inset ring-border bg-background transition-colors">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Published
                </div>
                <div className="mt-0.5 text-xl font-bold text-primary">
                  {(published_posts_count ?? 0).toLocaleString()}
                </div>
              </div>

              <div className="rounded-lg p-3 ring-1 ring-inset ring-border bg-background transition-colors">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Drafts
                </div>
                <div className="mt-0.5 text-xl font-bold text-foreground">
                  {(draft_posts_count ?? 0).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      }
    </Link>
  );
};

export default StatsCard;
