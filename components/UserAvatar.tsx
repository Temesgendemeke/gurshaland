"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface UserAvatarProps {
  /** Explicit profile_image url from database table */
  profileImage?: string | null;
  /** Supabase Auth user image or profile avatar_url */
  avatarUrl?: string | null;
  /** Legacy or general avatar url */
  avatar?: string | null;
  /** Generic fallback src */
  src?: string | null;
  /** Author / User display name */
  name?: string | null;
  /** Author / User username */
  username?: string | null;
  /** Author / User email */
  email?: string | null;
  /** Custom class for outer wrapper */
  className?: string;
  /** Custom class for fallback text/wrapper */
  fallbackClassName?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Size in pixels (if provided, styles inline width/height) */
  size?: number;
}

/**
 * Universal UserAvatar component that strictly implements the 3-tier fallback rule:
 * 1. Profile image (`profile_image` table url)
 * 2. Supabase user image (`avatar_url` / `avatar` / OAuth avatar)
 * 3. Author initial (first letter of name, username, or email)
 *
 * Automatically handles network/image load errors by degrading to the initial fallback.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  profileImage,
  avatarUrl,
  avatar,
  src,
  name,
  username,
  email,
  className,
  fallbackClassName,
  alt,
  size,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // 1. Profile image -> 2. Supabase user image -> 3. Fallback letter
  const resolvedSrc = (profileImage || avatarUrl || avatar || src || "").trim();

  // Reset failure state whenever resolved URL changes
  useEffect(() => {
    setImageFailed(false);
  }, [resolvedSrc]);

  // Compute fallback initial
  const identifier = (name || username || email || "").trim();
  const initial = identifier ? identifier.charAt(0).toUpperCase() : "U";
  const displayName = identifier || alt || "User";

  const sizeStyle = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  if (resolvedSrc && !imageFailed) {
    return (
      <span
        style={sizeStyle}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted select-none",
          className
        )}
      >
        <img
          src={resolvedSrc}
          alt={alt || `${displayName}'s avatar`}
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </span>
    );
  }

  return (
    <span
      style={sizeStyle}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-semibold text-foreground select-none",
        fallbackClassName,
        className
      )}
      aria-label={alt || displayName}
    >
      <span className="leading-none">{initial}</span>
    </span>
  );
};

export default UserAvatar;
