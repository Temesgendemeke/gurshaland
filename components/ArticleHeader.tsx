"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon } from "@heroicons/react/24/outline";
import {
  Pencil,
  Trash2,
  Bookmark,
  Share2,
  MessageCircle,
  Heart,
} from "lucide-react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { formatCount } from "@/utils/formatCount";
import { Blog } from "@/utils/types/blog";
import { useAuth } from "@/store/useAuth";
import { deleteBlog } from "@/actions/blog/blog";
import { toggleBlogLike, getBlogLikeStatus, getBlogLikesCount } from "@/actions/blog/like";
import { isBlogBookmarked, toggleBlogBookmark } from "@/actions/blog/bookmark";
import { favoritesStore } from "@/store/Favorites";
import { followProfile, unfollowProfile } from "@/actions/followers/followActions";
import { blogStore } from "@/store/Blog";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

interface ArticleHeaderProps {
  blogPost: Blog;
  viewCount?: number;
  isOwner?: boolean;
}

const ArticleHeader = ({ blogPost, viewCount, isOwner: propIsOwner }: ArticleHeaderProps) => {
  const router = useRouter();
  const user = useAuth((store) => store.user);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fast optimistic states initialized immediately from blogPost props
  const [likesCount, setLikesCount] = useState<number>(
    (blogPost as any).like_count ?? blogPost.like?.length ?? 0
  );
  const [isLiked, setIsLiked] = useState<boolean>(
    Boolean(
      (blogPost as any).is_liked ??
      (user?.id && blogPost.like?.some((l) => (l as any).liked_by === user.id))
    )
  );
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    Boolean((blogPost as any).is_bookmarked ?? false)
  );

  // Background state sync (non-blocking)
  useEffect(() => {
    let active = true;
    if (blogPost?.id) {
      if ((blogPost as any).like_count === undefined) {
        getBlogLikesCount(blogPost.id).then((count) => {
          if (active) setLikesCount(count);
        });
      }
      if (user?.id && (blogPost as any).is_liked === undefined) {
        getBlogLikeStatus(user.id, blogPost.id).then((liked) => {
          if (active) setIsLiked(liked);
        });
      }
      if (user?.id && (blogPost as any).is_bookmarked === undefined) {
        isBlogBookmarked(user.id, blogPost.id || blogPost.slug).then((bookmarked) => {
          if (active) setIsBookmarked(bookmarked);
        });
      }
    }
    return () => {
      active = false;
    };
  }, [user?.id, blogPost?.id, blogPost?.slug]);

  // Instant 0ms like toggle
  const handleLikeToggle = () => {
    if (!user?.id) {
      toast.info("Please sign in to like this article");
      return;
    }
    if (!blogPost.id) return;

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    // Non-blocking background sync with database
    toggleBlogLike(user.id, blogPost.id).catch((err) => {
      console.error("Like error:", err);
      setIsLiked(!nextLiked);
      setLikesCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
      toast.error("Failed to update like");
    });
  };

  // Instant 0ms bookmark toggle
  const handleBookmarkToggle = () => {
    if (!user?.id) {
      toast.info("Please sign in to save articles to your favorites");
      return;
    }
    if (!blogPost?.id && !blogPost?.slug) return;

    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    // Instant Zustand store sync
    if (nextState) {
      favoritesStore.getState().addBlogBookmark(blogPost);
      toast.success("Saved to favorites", { duration: 1500 });
    } else {
      favoritesStore.getState().removeBlogBookmark(blogPost.id || blogPost.slug);
      toast.success("Removed from favorites", { duration: 1500 });
    }

    // Non-blocking background DB update
    toggleBlogBookmark(user.id, blogPost.id || blogPost.slug).catch((err) => {
      console.error("Bookmark error:", err);
      setIsBookmarked(!nextState);
      if (!nextState) {
        favoritesStore.getState().addBlogBookmark(blogPost);
      } else {
        favoritesStore.getState().removeBlogBookmark(blogPost.id || blogPost.slug);
      }
      toast.error("Failed to update bookmark");
    });
  };

  const authorName =
    blogPost.author?.full_name || blogPost.author?.username || "Anonymous";

  const isOwner = Boolean(
    propIsOwner ||
    (user?.id && (
      user.id === blogPost.author_id ||
      user.id === (blogPost as any).author?.id ||
      user.id === (blogPost as any).user_id
    ))
  );

  const handleDelete = async () => {
    if (!blogPost.id && !blogPost.slug) return;
    try {
      setDeleting(true);
      await deleteBlog(blogPost);
      blogStore.setState((state) => ({
        blogs: state.blogs
          ? state.blogs.filter((b) => b.id !== blogPost.id && b.slug !== blogPost.slug)
          : null,
      }));
      toast.success("Blog post deleted successfully");
      setShowDeleteDialog(false);
      router.push("/blog");
    } catch (error) {
      toast.error("Failed to delete blog post");
      setDeleting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="flex-1 text-3xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-5xl font-gosh">
          {blogPost.title}
        </h1>

        {/* Owner Action Buttons */}
        {isOwner && (
          <div className="flex items-center gap-2 shrink-0 self-start">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 font-medium"
              onClick={() => router.push(`/blog/edit/${blogPost.slug}`)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 font-medium text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Subtitle */}
      {blogPost.subtitle && (
        <p className="mt-1 pl-2 text-sm leading-relaxed text-muted-foreground sm:text-lg">
          {blogPost.subtitle}
        </p>
      )}

      {/* Byline - Medium style (Avatar, Author Name, Follow pill button, read time · date) */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {/* Author Avatar & Name */}
        <div className="flex items-center gap-3">
          <UserAvatar
            avatarUrl={blogPost?.author?.avatar || (blogPost?.author as any)?.avatar_url}
            name={authorName}
            username={blogPost?.author?.username}
            className="h-10 w-10 text-sm font-semibold ring-1 ring-border/40"
          />

          <span className="text-sm font-semibold text-foreground">
            {authorName}
          </span>
        </div>

        {/* Follow Button */}
        <button
          type="button"
          onClick={async () => {
            if (!user?.id) {
              toast.info("Please sign in to follow authors");
              return;
            }
            if (isOwner) {
              toast.info("You cannot follow yourself");
              return;
            }
            const authorId = blogPost.author_id || (blogPost as any).author?.id;
            const nextFollow = !isFollowing;
            setIsFollowing(nextFollow);
            try {
              if (authorId) {
                if (nextFollow) {
                  await followProfile(authorId);
                  toast.success(`Following ${authorName}`);
                } else {
                  await unfollowProfile(authorId);
                  toast.success(`Unfollowed ${authorName}`);
                }
              }
            } catch (error) {
              setIsFollowing(!nextFollow);
              toast.error("Failed to update follow status");
            }
          }}
          className={cn(
            "rounded-full px-3.5 py-1 text-xs font-medium transition-all",
            isFollowing
              ? "border border-border bg-muted/60 text-foreground hover:bg-muted"
              : "border border-border/80 bg-background text-foreground hover:border-foreground/40 hover:bg-muted/20"
          )}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>

        {/* Read Time & Formatted Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {blogPost?.read_time && (
            <span>{blogPost.read_time.toLowerCase().includes("read") ? blogPost.read_time : `${blogPost.read_time} read`}</span>
          )}
          {blogPost?.read_time && blogPost?.created_at && (
            <span className="text-border">·</span>
          )}
          {blogPost?.created_at && (
            <span>{dayjs(blogPost.created_at).format("MMM D, YYYY")}</span>
          )}
          {viewCount !== undefined && viewCount > 0 && (
            <>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-1 text-xs">
                <EyeIcon className="h-3.5 w-3.5" />
                {formatCount(viewCount)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Tags Section */}
      {blogPost?.tags && blogPost.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-1">
          {[...new Set(blogPost.tags)]
            .filter((tag) => tag && tag.trim().length > 0)
            .map((tag) => {
              const cleanTag = tag.replace(/^#/, "").trim();
              return (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(cleanTag)}`}
                  className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/60 hover:bg-muted/70 hover:text-primary active:scale-95"
                >
                  #{cleanTag}
                </Link>
              );
            })}
        </div>
      )}

      {/* Article Actions */}
      <div className="mt-6 flex items-center justify-between border-y border-border/50 py-2.5 text-muted-foreground">
        {/* Left Actions: Likes, Comments, Views */}
        <div className="flex items-center gap-5 text-xs font-medium">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleLikeToggle}
            className="group flex items-center gap-1.5 transition-colors hover:text-foreground active:scale-95"
            title="Like"
            aria-label="Like article"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isLiked ? "fill-rose-500 text-rose-500" : "group-hover:text-foreground"
              )}
            />
            <span className="tabular-nums">
              {formatCount(likesCount)}
            </span>
          </button>

          {/* Comment Count */}
          <button
            type="button"
            onClick={() => {
              const commentSection = document.getElementById("comments");
              if (commentSection) {
                commentSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="group flex items-center gap-1.5 transition-colors hover:text-foreground active:scale-95"
            title="Comments"
            aria-label="View comments"
          >
            <MessageCircle className="h-4 w-4 transition-colors group-hover:text-foreground" />
            <span className="tabular-nums">
              {formatCount(blogPost.comments?.length || 0)}
            </span>
          </button>

          {/* View Count */}
          <div
            className="flex items-center gap-1.5"
            title="Views"
          >
            <EyeIcon className="h-4 w-4" />
            <span className="tabular-nums">
              {formatCount(viewCount ?? (blogPost.view_count || 0))}
            </span>
          </div>
        </div>

        {/* Right Actions: Bookmark, Share */}
        <div className="flex items-center gap-1">
          {/* Bookmark */}
          <button
            type="button"
            onClick={handleBookmarkToggle}
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground active:scale-95"
            title={isBookmarked ? "Remove from favorites" : "Save to favorites"}
            aria-label={isBookmarked ? "Remove from favorites" : "Save to favorites"}
          >
            <Bookmark
              className={cn(
                "h-4 w-4 transition-colors",
                isBookmarked && "fill-foreground text-foreground"
              )}
            />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={async () => {
              const url = window.location.href;
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: blogPost.title,
                    url,
                  });
                  return;
                } catch {
                  // Fall back
                }
              }
              try {
                await navigator.clipboard.writeText(url);
                toast.success("Link copied");
              } catch {
                toast.error("Failed to copy link");
              }
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground active:scale-95"
            title="Share article"
            aria-label="Share article"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{blogPost.title}&rdquo;? This action cannot be undone.
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
};

export default ArticleHeader;
