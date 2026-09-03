"use client";

import Link from "next/link";
import Image from "next/image";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteBlog } from "@/actions/blog/blog";
import { blogStore } from "@/store/Blog";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isOwner = Boolean(
    isOwn ||
    (user?.id && (
      user.id === post.author_id ||
      user.id === (post as any).author?.id ||
      user.id === (post as any).user_id
    ))
  );

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!post.id && !post.slug) return;
    try {
      setDeleting(true);
      await deleteBlog(post);
      blogStore.setState((state) => ({
        blogs: state.blogs
          ? state.blogs.filter((b) => b.id !== post.id && b.slug !== post.slug)
          : null,
      }));
      toast.success("Blog post deleted");
      setShowDeleteDialog(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete blog post");
      setDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/blog/edit/${post.slug}`);
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:border-border hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
      {/* Three-dot menu for owners */}
      {isOwner && (
        <div className="absolute top-3 right-3 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm hover:bg-background text-foreground"
                aria-label="Blog options"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 bg-background">
              <DropdownMenuItem
                onClick={handleEdit}
                className="cursor-pointer font-medium"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setShowDeleteDialog(true);
                }}
                className="cursor-pointer font-medium text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
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
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Image */}
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0 z-10"
        tabIndex={-1}
        aria-hidden
      />
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={post?.image?.url || "/placeholder.svg"}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {post.category && (
          <p className="mb-2 text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
            {badge && (
              <span className="text-primary font-semibold mr-1.5">
                {badge} ·
              </span>
            )}
            {post.category}
          </p>
        )}

        <h3 className="mb-2 line-clamp-2 font-gosh text-lg sm:text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary leading-snug">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {post.subtitle}
          </p>
        )}

        {/* Serene Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-[10px] font-medium text-foreground">
              {post.author?.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={authorName}
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              ) : (
                authorName[0]?.toUpperCase() || "A"
              )}
            </span>
            <span className="truncate font-medium text-foreground/80 text-xs">
              {authorName}
            </span>
          </div>

          <div className="text-[11px] text-muted-foreground/80 shrink-0">
            {post.read_time ? `${post.read_time} read` : format_date(post?.created_at as string)}
          </div>
        </div>
      </div>
    </div>
  );
}
