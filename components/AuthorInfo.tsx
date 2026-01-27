"use client";
import React from "react";
import { Card } from "./ui/card";
import { useRouter } from "next/navigation";
import { Profile } from "@/utils/types/profile";
import Image from "next/image";

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
      className="p-4 sm:p-5 cursor-pointer bg-card  rounded-lg"
    >
      <div className="flex items-center space-x-4">
        <Image
          src={author?.avatar_url || "/placeholder-user.jpg"}
          alt={author?.full_name[0] || "Author Avatar"}
          className="w-12 h-12 rounded-full object-cover ring-1 ring-border"
          width={48}
          height={48}
        />
        <div>
          <h3 className="font-semibold text-foreground">@{author?.username}</h3>
          <p className="text-sm text-muted-foreground">{author?.bio}</p>
          <p className="text-sm text-muted-foreground/80">
            {author?.recipes} recipes shared
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AuthorInfo;
