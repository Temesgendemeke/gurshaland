import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { TrashIcon as Trash } from "@heroicons/react/24/outline";
import React from "react";
import { Button } from "./ui/button";
import { useRecipeDetailStore } from "@/store/Recipedetail";
import { format_date } from "@/utils/formatdate";
import avater from "@/public/placeholder-user.jpg";

interface RecipeCommentListProps {
  comments: PostComment[];
  user_id: string;
}

const RecipeCommentList = ({ comments, user_id }: RecipeCommentListProps) => {
  const deleteComment = useRecipeDetailStore((state) => state.deleteComment);
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="border-b border-border/50 pb-4 last:border-b-0"
        >
          <div className="flex items-start space-x-3">
            <img
              src={comment.author?.avatar_url || avater.src}
              alt={comment.author.username}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-foreground">
                  {comment.author.username}
                </span>
                <div className="flex">
                  {[...Array(comment.rating)].map((_, i) => (
                    <SolidStar key={i} className="w-3 h-3 text-warning" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {format_date(comment.created_at!)}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-2">
                {comment.comment}
              </p>

              {/* <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {comment.likes}
                        </Button> */}
            </div>
            {user_id === comment.author_id && (
              <Button
                variant={"ghost"}
                type="button"
                onClick={async () => await deleteComment(comment.id)}
              >
                <Trash className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeCommentList;
