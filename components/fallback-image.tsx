"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { Image as ImageIcon } from "lucide-react";

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string;
}

export function FallbackImage({ src, alt, fallbackText = "Image not available", className, ...rest }: FallbackImageProps) {
  const [error, setError] = useState(false);

  // Helper to fix malformed double-slash URLs from the database (e.g. .com//pr/)
  const correctUrl = (url: string | object | undefined | null) => {
    if (!url) return "";
    if (typeof url === "string" && url.includes("https://static.playfood.com/")) {
      return url.replace(/\.com\/\//g, ".com/");
    }
    return url;
  };

  const correctedSrc = correctUrl(src) as string;

  useEffect(() => {
    setError(false);
  }, [correctedSrc]);

  if (error || !correctedSrc) {
    const isFill = (rest as any).fill;
    
    return (
      <div className={`flex flex-col items-center justify-center bg-muted text-muted-foreground ${isFill ? "absolute inset-0 object-cover" : ""} ${className || ""}`}>
        <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
        <span className="text-sm font-medium opacity-50">{fallbackText}</span>
      </div>
    );
  }

  return (
    <Image
      {...rest}
      src={correctedSrc}
      alt={alt || fallbackText}
      className={className}
      onError={() => {
        setError(true);
      }}
    />
  );
}
