"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/UserAvatar";
import { getBlogComments, postBlogComment, deleteBlogComment, updateBlogComment } from "@/actions/blog/comment";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BlogComment } from "@/utils/types/blog";
import { format_date } from "@/utils/formatdate";
import { Trash2, ArrowUpDown, ChevronDown, MoreVertical, Pencil, Check } from "lucide-react";
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

interface BlogCommentSectionProps {
  blogId?: string;
  postAuthorId?: string;
  initialComments?: BlogComment[];
}

export default function BlogCommentSection({
  blogId,
  postAuthorId,
  initialComments = [],
}: BlogCommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>(initialComments);
  const [submitting, setSubmitting] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [commentToDelete, setCommentToDelete] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editText, setEditText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const user = useAuth((store) => store.user);
  const router = useRouter();

  const isPostOwner = Boolean(
    user?.id && postAuthorId && user.id === postAuthorId
  );

  // Fetch live comments on mount
  useEffect(() => {
    let active = true;
    if (blogId) {
      getBlogComments(blogId)
        .then((data) => {
          if (active && Array.isArray(data) && data.length > 0) {
            setComments(data);
          }
        })
        .catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [blogId]);

  // Sort comments
  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime();
      const timeB = new Date(b.created_at || 0).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });
  }, [comments, sortOrder]);

  const handlePost = async () => {
    if (!commentText.trim()) return;
    if (!user?.id) {
      toast.info("Please sign in to leave a comment");
      return router.push("/login");
    }
    if (!blogId) return;

    try {
      setSubmitting(true);
      const payload: any = {
        comment: commentText.trim(),
        blog_id: blogId,
        user_id: user.id,
        author_id: user.id,
      };

      const created = await postBlogComment(payload);

      const optimisticComment = {
        ...(created || payload),
        user_id: user.id,
        author_id: user.id,
        author: {
          id: user.id,
          full_name:
            (user as any)?.user_metadata?.full_name ||
            (user as any)?.user_metadata?.username ||
            "You",
          username:
            (user as any)?.user_metadata?.username ||
            (user as any)?.user_metadata?.full_name ||
            "You",
          avatar:
            (user as any)?.user_metadata?.avatar_url ||
            (user as any)?.user_metadata?.avatar,
        },
        created_at: new Date().toISOString(),
      };

      setComments((prev) => [optimisticComment, ...prev]);
      setCommentText("");
      toast.success(isPostOwner ? "Response posted!" : "Comment posted!");
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (c: any) => {
    setEditingId(c.id);
    setEditText(c.comment || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveEdit = async (commentId: string | number) => {
    if (!editText.trim()) return;
    try {
      setSavingEdit(true);
      await updateBlogComment(commentId, editText.trim());
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, comment: editText.trim(), is_edited: true }
            : c
        )
      );
      toast.success("Comment updated");
      setEditingId(null);
      setEditText("");
    } catch (error: any) {
      console.error("Failed to update comment:", error);
      toast.error(error?.message || "Failed to update comment");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete?.id) return;
    try {
      setDeletingId(commentToDelete.id);
      await deleteBlogComment(commentToDelete.id);
      setComments((prev) => prev.filter((c) => c.id !== commentToDelete.id));
      toast.success("Comment deleted");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setDeletingId(null);
      setCommentToDelete(null);
    }
  };

  return (
    <section id="comments" className="mt-12 scroll-mt-24 border-t border-border/60 pt-8 space-y-6">
      {/* Add Comment Card */}
      <div className="rounded-2xl border border-border bg-card/60 overflow-hidden focus-within:border-muted-foreground/50 transition-colors">
        <textarea
          placeholder={
            isPostOwner
              ? "Respond as author..."
              : "Add comment..."
          }
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          className="w-full resize-none border-0 bg-transparent px-4 py-3.5 text-sm sm:text-base leading-relaxed text-foreground placeholder:text-muted-foreground/60 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0"
        />

        <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5 bg-muted/20">
          <span className="text-xs text-muted-foreground">
            {isPostOwner ? "Posting as author" : ""}
          </span>
          <Button
            type="button"
            size="sm"
            onClick={handlePost}
            disabled={submitting || !commentText.trim()}
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 text-xs sm:text-sm shadow-none transition-all disabled:opacity-50"
          >
            {submitting ? "Posting..." : isPostOwner ? "Respond" : "Submit"}
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-border/60" />

      {/* Header with Title, Orange Count Pill, and Sort Dropdown */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h3 className="font-gosh text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Comments
          </h3>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">
            {comments.length}
          </span>
        </div>

        {comments.length > 1 && (
          <button
            type="button"
            onClick={() =>
              setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
            }
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>{sortOrder === "newest" ? "Most recent" : "Oldest first"}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Comments List */}
      {sortedComments.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6 pt-1">
          {sortedComments.map((c, idx) => {
            const authorName =
              c.author?.full_name ||
              c.author?.username ||
              (c.user_id && user?.id === c.user_id ? "You" : "Reader");

            const avatarUrl =
              c.author?.avatar ||
              c.author?.avatar_url ||
              (c.user_id && user?.id === c.user_id
                ? (user as any)?.user_metadata?.avatar_url
                : null);

            const isCommentByAuthor = Boolean(
              postAuthorId &&
                (c.user_id === postAuthorId ||
                  c.author_id === postAuthorId ||
                  c.author?.id === postAuthorId)
            );

            const canEdit = Boolean(
              user?.id &&
                (user.id === c.user_id || user.id === c.author_id)
            );

            const canDelete = Boolean(
              user?.id &&
                (user.id === c.user_id ||
                  user.id === c.author_id ||
                  isPostOwner)
            );

            const isEditing = editingId === c.id;

            return (
              <div
                key={c.id || `comment-${idx}`}
                className="flex items-start gap-3 group"
              >
                {/* Circular Avatar */}
                <UserAvatar
                  avatarUrl={avatarUrl}
                  name={authorName}
                  username={c.author?.username}
                  className="h-9 w-9 text-xs rounded-full shrink-0 ring-1 ring-border/40 mt-0.5"
                />

                {/* Comment Body */}
                <div className="min-w-0 flex-1 space-y-1">
                  {/* Name, Author Badge, Time & Three-Dots Menu */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {authorName}
                      </span>

                      {isCommentByAuthor && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary shrink-0">
                          <Check className="h-3 w-3 stroke-[2.5]" />
                          <span>Author</span>
                        </span>
                      )}

                      {c.created_at && (
                        <span className="text-xs text-muted-foreground">
                          {format_date(c.created_at)}
                        </span>
                      )}

                      {c.is_edited && (
                        <span className="text-[11px] text-muted-foreground/70 italic">
                          (edited)
                        </span>
                      )}
                    </div>

                    {/* Three-dots menu for Edit & Delete */}
                    {(canEdit || canDelete) && !isEditing && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="text-muted-foreground/60 hover:text-foreground transition-colors p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Comment options"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-28 border-border shadow-none">
                          {canEdit && (
                            <DropdownMenuItem
                              onClick={() => handleStartEdit(c)}
                              className="flex items-center gap-2 cursor-pointer text-xs"
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                          )}
                          {canDelete && (
                            <DropdownMenuItem
                              onClick={() => setCommentToDelete(c)}
                              className="flex items-center gap-2 cursor-pointer text-xs text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {/* Comment Text or Inline Editing Form */}
                  {isEditing ? (
                    <div className="mt-2.5 rounded-xl border border-border bg-card/80 overflow-hidden focus-within:border-muted-foreground/50 transition-colors">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full resize-none border-0 bg-transparent px-3.5 py-3 text-sm sm:text-base leading-relaxed text-foreground placeholder:text-muted-foreground/60 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0"
                        autoFocus
                      />
                      <div className="flex items-center justify-end gap-2 border-t border-border/50 px-3 py-2 bg-muted/20">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={savingEdit}
                          className="h-8 rounded-full px-3.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSaveEdit(c.id)}
                          disabled={savingEdit || !editText.trim()}
                          className="h-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 text-xs font-semibold shadow-none"
                        >
                          {savingEdit ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-[15px] leading-relaxed text-foreground/90 whitespace-pre-line pt-0.5">
                      {c.comment}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={Boolean(commentToDelete)}
        onOpenChange={(open) => !open && setCommentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete response?</AlertDialogTitle>
            <AlertDialogDescription>
              This response will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
