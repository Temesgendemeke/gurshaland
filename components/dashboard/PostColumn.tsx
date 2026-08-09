"use client";
import { useState } from "react";
import { Post } from "@/utils/types/Dashboard";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DefaultHeader } from "./DefaultHeader";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { MoreVertical, PenBox, Trash, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import { useBlog } from "@/store/DashboardBlog";
import useRecipe from "@/store/DashboardRecipe";
import { useRouter } from "next/navigation";

function PostActionsCell({
  slug,
  linkBasePath,
}: {
  slug?: string;
  linkBasePath: "/recipes" | "/blog";
}) {
  const router = useRouter();
  const deleteBlogFn = useBlog((store) => store.deleteBlog);
  const deleteRecipeFn = useRecipe((store) => store.deleteRecipe);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!slug) return null;

  const handleDelete = async () => {
    try {
      if (linkBasePath === "/blog") {
        await deleteBlogFn(slug);
      } else {
        await deleteRecipeFn(slug);
      }
      toast.success("Post deleted successfully");
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Post actions">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="bg-background z-50"
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => router.push(`${linkBasePath}/edit/${slug}`)}
          >
            <PenBox className="h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-error focus:text-error"
          >
            <Trash className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border border-error/20 shadow-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post and all associated
              comments, likes, and media will be permanently deleted and cannot
              be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={async () => {
                await handleDelete();
                setDeleteOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Modern Status Badge Component
const getStatusConfig = (status: string) => {
  switch (status?.toLowerCase()) {
    case "published":
      return {
        color: "hsl(var(--success))",
        bg: "hsl(var(--success) / 0.10)",
        border: "hsl(var(--success) / 0.20)",
      };
    case "draft":
      return {
        color: "hsl(var(--warning))",
        bg: "hsl(var(--warning) / 0.10)",
        border: "hsl(var(--warning) / 0.20)",
      };
    default:
      return {
        color: "hsl(var(--muted-foreground))",
        bg: "hsl(var(--muted) / 0.5)",
        border: "hsl(var(--border))",
      };
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className="gap-2 px-3 py-1.5 cursor-default"
      style={{
        color: config.color,
        backgroundColor: config.bg,
        borderColor: config.border,
      }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      <span className="capitalize font-semibold tracking-wide">{status}</span>
    </Badge>
  );
};

const columnHelper = createColumnHelper<Post>();

export const createPostColumns = (
  linkBasePath: "/recipes" | "/blog" = "/recipes",
): ColumnDef<Post, any>[] => [
  columnHelper.accessor("title", {
    header: (info) => <DefaultHeader info={info as any} name="Title" />,
    cell: (info) => {
      const title = info.getValue() as string;
      const slug = (info.row.original as Post).slug;
      if (slug) {
        return (
          <Link href={`${linkBasePath}/${slug}`} className="hover:underline">
            {title}
          </Link>
        );
      }
      return title;
    },
  }),
  columnHelper.accessor("created_at", {
    header: (info) => <DefaultHeader info={info as any} name="Created At" />,
    cell: (info) => {
      const date = info.getValue();
      if (!date) return "";

      return new Date(date as string).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  }),
  columnHelper.accessor("view_count", {
    header: (info) => (
      <DefaultHeader info={info as any} name="Engagement Rate" />
    ),
    cell: (info) => {
      const views = Number(info.getValue()) || 0;
      const likes = Number((info.row.original as any).like) || 0;
      const comments = Number((info.row.original as any).comment_count) || 0;

      let engagementRate = 0;
      if (views > 0) {
        engagementRate = ((likes + comments) / views) * 100;
      }

      const displayRate = Math.min(100, Math.round(engagementRate * 100) / 100);

      const getEngagementColor = (rate: number) => {
        if (rate >= 15) return "bg-primary"; // High engagement
        if (rate >= 10) return "bg-success"; // Good engagement
        if (rate >= 5) return "bg-warning"; // Moderate engagement
        if (rate >= 2) return "bg-popular"; // Low engagement
        return "bg-error";
      };

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <Eye className="h-3 w-3 text-sm" />
              {views.toLocaleString()} views
            </span>
            <span className="text-[0.625rem] font-medium text-muted-foreground ml-auto">
              {displayRate.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 rounded bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-r transition-all duration-300",
                getEngagementColor(displayRate),
              )}
              style={{ width: `${displayRate}%` }}
            />
          </div>
          <div className="text-[0.625rem] text-muted-foreground">
            {likes} likes • {comments} comments
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: (info) => <DefaultHeader info={info as any} name="Status" />,
    cell: (info) => <StatusBadge status={info.getValue() as string} />,
  }),
  columnHelper.display({
    id: "more",
    cell: (row) => {
      return (
        <PostActionsCell
          slug={row.row.original.slug}
          linkBasePath={linkBasePath}
        />
      );
    },
  }),
];

export const postColumn: ColumnDef<Post, any>[] = createPostColumns("/recipes");
