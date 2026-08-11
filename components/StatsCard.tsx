import React from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCardSkeleton } from "@/components/ui/loading-skeleton";

interface StatsCardProps {
  name: string;
  count: number;
  Icon: LucideIcon;
  className?: string;
  loading: boolean;
  type: "post" | "follower" | "engagement";
  published_posts_count?: number;
  draft_posts_count?: number;
  likes_count?: number;
  comments_count?: number;
  href?: string;
  subtitle?: string;
}

const StatBlock = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) => (
  <div className="rounded-lg p-3 ring-1 ring-inset ring-border bg-background transition-colors">
    <div className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
    <div
      className={cn(
        "mt-0.5 text-xl font-bold",
        highlight ? "text-primary" : "text-foreground",
      )}
    >
      {value.toLocaleString()}
    </div>
  </div>
);

const StatsCard = ({
  name,
  count,
  Icon,
  className,
  loading,
  type,
  published_posts_count,
  draft_posts_count,
  likes_count,
  comments_count,
  href = `/dashboard/${name}`,
  subtitle,
}: StatsCardProps) => {
  if (loading) {
    return <StatsCardSkeleton className={className} />;
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden aspect-[5/3] group",
        " transition-colors hover:bg-card border border-transparent  hover:border-primary ",
        className,
      )}
    >
      <Link
        href={href}
        aria-label={`${name} stats`}
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
      />
      <CardContent className="flex h-full flex-col justify-end p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
        </div>
        <div className="text-4xl font-bold tracking-tight text-foreground select-none">
          {count.toLocaleString()}
        </div>
        <p className="mt-1 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {subtitle ?? name}
        </p>

        {/* {type === "post" && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <StatBlock
              label="Published"
              value={published_posts_count ?? 0}
              highlight
            />
            <StatBlock label="Drafts" value={draft_posts_count ?? 0} />
          </div>
        )}

        {type === "engagement" && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <StatBlock label="Likes" value={likes_count ?? 0} />
            <StatBlock label="Comments" value={comments_count ?? 0} />
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
