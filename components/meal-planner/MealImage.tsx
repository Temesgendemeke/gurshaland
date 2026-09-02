"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getMealImage } from "@/actions/meal/images";

export default function MealImage({
  searchTerm,
  alt,
}: {
  searchTerm: string;
  alt: string;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMealImage(searchTerm).then((url) => {
      if (!cancelled) setSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [searchTerm]);

  if (!src) return null;

  return (
    <div className="relative aspect-[3/2] w-full max-w-sm overflow-hidden rounded-lg bg-muted">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="384px"
        className="object-cover"
      />
    </div>
  );
}
