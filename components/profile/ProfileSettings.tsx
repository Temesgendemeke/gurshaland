"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SettingProfileSchema } from "@/schema/SettingsProfile";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  getSettingProfile,
  updateProfile,
  upsertProfilePicure,
  deleteProfilePicture,
  removeProfilePictureFile,
} from "@/actions/profile/profile";
import { useAuth } from "@/store/useAuth";
import { Profile } from "@/utils/types/Settings";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { SecuritySection } from "./ChangePasswordDialog";
import { DangerZoneSection } from "./DeleteAccountDialog";
import ProfileAvatarUpload from "./ProfileAvatarUpload";

export default function ProfileSettings() {
  const [profile, setProfile] = useState<Profile>();
  const user = useAuth((store) => store.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(SettingProfileSchema),
    defaultValues: {
      full_name: "",
      username: "",
      image_url: "",
      bio: "",
    },
  });

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getSettingProfile(user.id);
        if (!cancelled) {
          setProfile(data);
          if (data) {
            form.reset({
              full_name: data.full_name || "",
              username: data.username || "",
              image_url: data.image?.url || "",
              bio: data.bio || "",
            });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load profile",
          );
          toast.error("Failed to load profile data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [user?.id, form]);

  const handleAvatarSelect = (file: File) => {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    form.setValue("image_url", "");
  };

  const onSubmit = async (data: z.infer<typeof SettingProfileSchema>) => {
    if (!user?.id) return;

    try {
      setLoading(true);

      let imageUrl = data.image_url || "";
      let newImagePath: string | undefined;
      const previousImagePath = profile?.image?.path;

      if (avatarFile) {
        const { url, path } = await upsertProfilePicure(user.id, avatarFile);
        imageUrl = url;
        newImagePath = path;
      } else if (!imageUrl && previousImagePath) {
        await deleteProfilePicture(user.id, previousImagePath);
      }

      const updateData: {
        full_name: string;
        username: string;
        bio: string;
        image?: { url: string; path: string };
      } = {
        full_name: data.full_name,
        username: data.username,
        bio: data.bio,
      };

      if (imageUrl && newImagePath) {
        updateData.image = { url: imageUrl, path: newImagePath };
      }

      const updatedProfile = await updateProfile(user.id, updateData);
      setProfile(updatedProfile);

      if (
        newImagePath &&
        previousImagePath &&
        newImagePath !== previousImagePath
      ) {
        await removeProfilePictureFile(previousImagePath);
      }

      setAvatarFile(null);
      setAvatarPreview(null);

      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully.",
      });

      form.reset({
        full_name: updatedProfile.full_name || "",
        username: updatedProfile.username || "",
        image_url: updatedProfile.image?.url || "",
        bio: updatedProfile.bio || "",
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="space-y-6">
        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 bg-muted rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentAvatarUrl =
    profile?.image?.url ||
    (profile as any)?.avatar_url ||
    user?.user_metadata?.avatar_url;

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Main Profile Info */}
      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground text-lg">
            Profile Details
            {form.formState.isDirty && (
              <Badge variant="secondary" className="ml-2 font-normal">
                Unsaved Changes
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Update your public profile information and display details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfileAvatarUpload
            currentImageUrl={currentAvatarUrl}
            previewUrl={avatarPreview}
            fullName={profile?.full_name || form.watch("full_name")}
            username={profile?.username || form.watch("username")}
            onAvatarSelect={handleAvatarSelect}
            onAvatarRemove={handleRemoveImage}
            disabled={loading}
          />

          <Separator />

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="full_name">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        id="full_name"
                        placeholder="Enter your full name"
                        className="rounded-lg border-border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Visible to the Gurshaland community
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        placeholder="Enter username"
                        className="rounded-lg border-border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Letters, numbers, and underscores only
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel htmlFor="bio">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself and your culinary interests..."
                        className="rounded-lg border-border min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        Max 500 characters
                      </p>
                      <span
                        className={`text-xs ${(field.value?.length || 0) > 450
                            ? "text-warning font-semibold"
                            : "text-muted-foreground"
                          }`}
                      >
                        {field.value?.length || 0}/500
                      </span>
                    </div>
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="shadow-none"
                  onClick={() => {
                    if (profile) {
                      form.reset({
                        full_name: profile.full_name || "",
                        username: profile.username || "",
                        image_url: profile.image?.url || "",
                        bio: profile.bio || "",
                      });
                      setAvatarFile(null);
                      setAvatarPreview(null);
                    }
                  }}
                  disabled={form.formState.isSubmitting || loading}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="shadow-none"
                  disabled={form.formState.isSubmitting || loading}
                >
                  {form.formState.isSubmitting || loading
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      {/* Security & Password */}
      <SecuritySection />

      {/* Danger Zone */}
      <DangerZoneSection />
    </div>
  );
}
