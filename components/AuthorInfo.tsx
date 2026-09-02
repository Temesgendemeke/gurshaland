"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface AuthorInfoProps {
  author: {
    recipes: number;
    username: string;
    full_name: string;
    bio?: string;
    avatar_url: string;
  };
}

export default function AuthorInfo({ author }: AuthorInfoProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/profile/${author.username}`)}
      className="group flex w-full items-center gap-3.5 rounded-2xl border border-border/60 bg-card px-3.5 py-3 text-left transition-[border-color,background-color,box-shadow,transform] duration-150 hover:border-primary/30 hover:bg-card/80 hover:-translate-y-px hover:shadow-sm hover:shadow-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.99]"
    >
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-border/70">
        <Image
          src={author.avatar_url || "/placeholder-user.jpg"}
          alt={author.full_name}
          fill
          sizes="40px"
          className="object-cover"
        />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight text-foreground">
          {author.full_name}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate">@{author.username}</span>
          {author.bio && (
            <>
              <span className="text-border/80">·</span>
              <span className="truncate">{author.bio}</span>
            </>
          )}
        </p>
        {/* <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[0.625rem] font-semibold tabular-nums text-primary/80">
          {author.recipes} {author.recipes === 1 ? "recipe" : "recipes"}
        </span> */}
      </div>

      <ArrowRightIcon className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
    </button>
  );
}
