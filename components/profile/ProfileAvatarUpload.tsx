"use client";

import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Trash2 } from "lucide-react";
import { compressImageToFile } from "@/utils/compressImage";

interface ProfileAvatarUploadProps {
  currentImageUrl?: string | null;
  previewUrl?: string | null;
  fullName?: string;
  username?: string;
  onAvatarSelect: (file: File) => void;
  onAvatarRemove: () => void;
  disabled?: boolean;
}

export default function ProfileAvatarUpload({
  currentImageUrl,
  previewUrl,
  fullName,
  username,
  onAvatarSelect,
  onAvatarRemove,
  disabled,
}: ProfileAvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const optimized = await compressImageToFile(file, {
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.85,
      mimeType: "image/webp",
    });

    onAvatarSelect(optimized);
  };

  const displayImage = previewUrl || currentImageUrl || undefined;
  const initialFallback = (fullName?.[0] || username?.[0] || "U").toUpperCase();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative group">
        <Avatar className="h-24 w-24 rounded-full border-2 border-border">
          <AvatarImage
            src={displayImage}
            alt={fullName || username || "Avatar"}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl font-bold bg-muted text-foreground">
            {initialFallback}
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:pointer-events-none"
        >
          <Camera className="h-6 w-6" />
        </button>
      </div>

      <div className="flex flex-col items-center sm:items-start gap-2.5 text-center sm:text-left">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="h-9 gap-1.5 shadow-none"
          >
            <Camera className="h-4 w-4" />
            <span>Upload photo</span>
          </Button>

          {(previewUrl || currentImageUrl) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onAvatarRemove}
              disabled={disabled}
              className="h-9 gap-1.5 text-muted-foreground hover:text-error"
            >
              <Trash2 className="h-4 w-4" />
              <span>Remove</span>
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Recommended: square JPG, PNG, or WebP up to 5MB.
        </p>
      </div>
    </div>
  );
}
