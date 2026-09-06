"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { format_date } from "@/utils/formatdate";
import { Blog } from "@/utils/types/blog";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { deleteBlog } from "@/actions/blog/blog";
import { blogStore } from "@/store/Blog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

type FeaturedPostProps = {
  post: Blog & { excerpt?: string };
};

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const router = useRouter();
  const user = useAuth((store) => store.user);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const authorName =
    post.author?.full_name || post.author?.username || "Anonymous";

  const isOwner = Boolean(
    user?.id && (
      user.id === post.author_id ||
      user.id === (post as any).author?.id ||
      user.id === (post as any).user_id
    )
  );

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/blog/edit/${post.slug}`);
  };

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

  return (
    <div className="relative">
      <section
        className="group grid overflow-hidden rounded-xl border border-border/60 bg-card transition-colors duration-300 hover:border-primary/40 md:grid-cols-12 cursor-pointer"
        onClick={() => router.push(`/blog/${post.slug}`)}
      >
        {/* Image */}
        <div className="relative aspect-[4/2] overflow-hidden bg-muted md:col-span-7 md:aspect-auto md:min-h-[340px]">
          <Image
            src={post.image?.url || "/placeholder.svg"}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center p-6 sm:p-10 md:col-span-5 lg:p-12">
          <h3 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-3xl">
            {post.title}
          </h3>

          <p className="mb-6 line-clamp-4 leading-relaxed text-muted-foreground">
            {post.excerpt || post.subtitle}
          </p>

          <div className="flex items-center gap-3">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-muted text-xs font-bold text-muted-foreground">
              {post.author?.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={authorName}
                  fill
                  sizes="40px"
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
              <p className="text-xs text-muted-foreground">
                {format_date(post.created_at as string)} · {post.read_time} read
              </p>
            </div>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
          >
            Read the story
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Owner Menu for Featured Post */}
      {isOwner && (
        <div className="absolute top-4 right-4 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm border border-border hover:bg-background text-foreground"
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                className="cursor-pointer font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{post.title}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              onClick={(e) => e.stopPropagation()}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
