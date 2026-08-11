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

const StatsCard = ({
  name,
  count,
  Icon,
  className,
  loading,
  href = `/dashboard/${name}`,
  subtitle,
}: StatsCardProps) => {
  if (loading) {
    return <StatsCardSkeleton className={className} />;
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-colors hover:border-primary",
        className,
      )}
    >
      <Link
        href={href}
        aria-label={`${name} stats`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
      />
      <CardContent className="flex flex-col p-5">
        <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div className="text-4xl font-bold tracking-tight text-foreground select-none">
          {count.toLocaleString()}
        </div>
        <p className="mt-1 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {subtitle ?? name}
        </p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
