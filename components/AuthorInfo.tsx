"use client";
import React from "react";
import { Card } from "./ui/card";
import { useRouter } from "next/navigation";
import { Profile } from "@/utils/types/profile";

interface AuthorInfoProps {
  author: {
    recipes: number;
    username: string;
    full_name: string;
    bio?: string;
    avatar_url: string;
  };
}

const AuthorInfo = ({ author }: AuthorInfoProps) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/profile/${author.username}`)}
      className="p-4 cursor-pointer bg-card/70 backdrop-blur-sm border-border/50"
    >
      <div className="flex items-center space-x-4">
        <img
          src={author?.avatar_url || "https://avatar.iran.liara.run/public/boy"}
          alt={author?.full_name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-foreground">@{author?.username}</h3>
          <p className="text-sm text-muted-foreground">{author?.bio}</p>
          <p className="text-xs text-muted-foreground/80">
            {author?.recipes} recipes shared
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AuthorInfo;
