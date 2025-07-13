import React from "react";
import { Card } from "./ui/card";

const AuthorInfo = ({author}) => {
  return (
    <Card className="p-4 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <div className="flex items-center space-x-4">
        <img
          src={
            author?.avatar_url ||
            "https://avatar.iran.liara.run/public/boy"
          }
          alt={author?.full_name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            @{author?.username}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {author?.bio}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {author?.recipes} recipes shared
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AuthorInfo;
