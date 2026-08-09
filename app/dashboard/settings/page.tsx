"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Camera, Mail, Lock, Pen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "@/actions/profile/profile";
import { useAuth } from "@/store/useAuth";
import { Profile } from "@/utils/types/Settings";
import DeleteAccount from "@/components/dashboard/DeleteAccount";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>();
  const user = useAuth((store) => store.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    (async () => {
      if (user?.id) {
        setLoading(true);
        setError(null);
        try {
          const data = await getSettingProfile(user?.id);
          setProfile(data);

          // Reset form with loaded profile data
          if (data) {
            form.reset({
              full_name: data.full_name || "",
              username: data.username || "",
              image_url: data.image?.url || "",
              bio: data.bio || "",
            });
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load profile",
          );
          toast.error("Error", {
            description: "Failed to load profile data. Please refresh the page.",
          });
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [user, user?.id, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = async () => {
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

      if (avatarFile) {
        const { url, path } = await upsertProfilePicure(user.id, avatarFile);
        imageUrl = url;
        newImagePath = path;
      } else if (!imageUrl && profile?.image?.path) {
        await deleteProfilePicture(user.id, profile.image.path);
      }

      // Prepare the data for the database update
      const updateData = {
        full_name: data.full_name,
        username: data.username,
        bio: data.bio,
        image_url: imageUrl || undefined,
      };

      const updatedProfile = await updateProfile(user.id, updateData);
      setProfile(updatedProfile);

      // Clean up the previous profile picture if a new one was uploaded
      if (newImagePath && profile?.image?.path) {
        await deleteProfilePicture(user.id, profile.image.path);
      }

      setAvatarFile(null);
      setAvatarPreview(null);

      // Show success toast
      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully.",
      });

      // Optionally refresh the form with new data
      form.reset({
        full_name: updatedProfile.full_name || "",
        username: updatedProfile.username || "",
        image_url: updatedProfile.image?.url || "",
        bio: updatedProfile.bio || "",
      });
    } catch (error) {
      console.error("Error updating profile:", error);

      // Show error toast
      toast.error("Update Failed", {
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-gosh tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground max-w-full">
          Manage your account preferences, privacy settings, and customize your
          experience on Gurshaland.
        </p>
      </div>

      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <Card className="border-error/20 bg-error/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-error">
                <span className="text-sm font-medium">
                  Error loading profile:
                </span>
                <span className="text-sm">{error}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-error/30 text-error hover:bg-error/10"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Profile Settings */}
        {loading ? (
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 bg-muted rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                    <div className="h-10 bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="h-5 w-5 text-muted-foreground" />
                Profile Settings
                {form.formState.isDirty && (
                  <Badge variant="secondary" className="ml-2">
                    Unsaved Changes
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-border">
                    <AvatarImage
                      src={
                        avatarPreview ??
                        profile?.image?.url ??
                        "/placeholder-user.jpg"
                      }
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-muted text-foreground text-xl font-semibold">
                      {profile?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 p-0 border-border bg-background"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload profile picture"
                  >
                    <Camera className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    aria-hidden
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a new profile picture
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Photo
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}

              {/* Profile Form using react-hook-form, zod, and shadcn */}
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {/* Full Name */}
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
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          This is the name that will be displayed on your
                          profile
                        </p>
                      </FormItem>
                    )}
                  />

                  {/* Username */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <FormControl>
                          <Input
                            id="username"
                            placeholder="Enter a unique username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Username can only contain letters, numbers, and
                          underscores
                        </p>
                      </FormItem>
                    )}
                  />

                  {/* Bio */}
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel htmlFor="bio">Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            id="bio"
                            placeholder="Tell us about yourself..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            Share a brief description about yourself (max 500
                            characters)
                          </p>
                          <span
                            className={`text-xs ${
                              (field.value?.length || 0) > 450
                                ? "text-warning"
                                : "text-muted-foreground"
                            }`}
                          >
                            {field.value?.length || 0}/500
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="md:col-span-2 flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (profile) {
                          form.reset({
                            full_name: profile.full_name || "",
                            username: profile.username || "",
                            image_url: profile.image?.url || "",
                            bio: profile.bio || "",
                          });
                        }
                      }}
                      disabled={form.formState.isSubmitting || loading}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      className="btn-primary-modern"
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
        )}

        {/* Email Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Mail className="h-5 w-5 text-muted-foreground" />
              Email Settings
            </CardTitle>
            <CardDescription>
              Manage your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium">
                  Email Address
                </span>
                <span className="text-base font-semibold tracking-tight text-foreground">
                  {user?.email}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-border"
                aria-label="Edit Email"
                onClick={() =>
                  router.push("/dashboard/settings/change-email")
                }
              >
                <Pen className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Manage your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button asChild className="btn-primary-modern gap-2">
              <Link href="/dashboard/settings/change-password">
                <Lock className="h-4 w-4" />
                Change Password
              </Link>
            </Button>
          </CardContent>
        </Card>

        <DeleteAccount profile_id={user?.id as string} />
        <div className="h-20"></div>
      </div>
    </div>
  );
}
