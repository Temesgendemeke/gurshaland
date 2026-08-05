"use client";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RecipeImageProps {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  placeholderSrc?: string;
  width?: number;
  height?: number;
}

export default function RecipeImage({
  src,
  alt,
  className,
  imgClassName,
  sizes,
  priority,
  placeholderSrc = "/placeholder.svg",
  width = 1600,
  height = 1000,
}: RecipeImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const resolvedSrc = errored || !src ? placeholderSrc : src;
  const isDataUrl = resolvedSrc.startsWith("data:");

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden />
      )}
      {isDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedSrc}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      ) : (
        <Image
          src={resolvedSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setErrored(true);
            setLoaded(true);
          }}
        />
      )}
    </div>
  );
}
