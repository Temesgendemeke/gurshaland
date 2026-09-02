"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { format_date } from "@/utils/formatdate";
import { Blog } from "@/utils/types/blog";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteBlog } from "@/actions/blog/blog";
import { toast } from "sonner";

export default function BlogPostCard({
  post,
  badge,
  isOwn,
}: {
  post: Blog;
  badge?: string;
  isOwn?: boolean;
}) {
  const authorName =
    post.author?.full_name || post.author?.username || "Anonymous";

  const router = useRouter();
  const user = useAuth((store) => store.user);
  const [deleting, setDeleting] = useState(false);

  const canEdit = isOwn && user?.id === post.author_id;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!post.id) return;
    try {
      setDeleting(true);
      await deleteBlog(post);
      toast.success("Blog deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete blog");
      setDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/blog/edit/${post.slug}`);
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card transition-colors duration-200 hover:border-foreground/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
      {/* Three-dot menu for own blogs */}
      {canEdit && (
        <div className="absolute top-3 right-3 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm hover:bg-background"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete blog post?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. &quot;{post.title}&quot;
                      will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Image */}
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0 z-10"
        tabIndex={-1}
        aria-hidden
      />
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={post?.image?.url || "/placeholder.svg"}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {badge ? `${badge} / ` : ""}
          {post.category}
        </p>

        <h3 className="mb-2 line-clamp-2 font-gosh text-xl font-semibold leading-tight tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
          {post.title}
        </h3>

        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.subtitle}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-between border-t border-border/70 pt-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-bold text-muted-foreground">
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

            <span className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
