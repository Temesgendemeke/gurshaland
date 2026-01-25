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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Settings as SettingsIcon,
  Camera,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Link as LinkIcon,
  Pen,
} from "lucide-react";
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
} from "@/actions/profile/profile";
import { useAuth } from "@/store/useAuth";
import { Profile } from "@/utils/types/Settings";
import DeleteAccount from "@/components/dashboard/DeleteAccount";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { deleteProfilePicture } from "@/actions/profile/profile";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: false,
    marketing: true,
    updates: true,
  });
  const [profile, setProfile] = useState<Profile>();
  const user = useAuth((store) => store.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(SettingProfileSchema),
    defaultValues: {
      full_name: "",
      username: "",
      image_url: "",
      bio: "",
      image_file: "",
    },
  });

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
          toast({
            title: "Error",
            description:
              "Failed to load profile data. Please refresh the page.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [user, user?.id, form, toast]);

  const handleRemoveImage = async () => {
    form.setValue("image_file", "");
    form.setValue("image_url", "");
  };

  const onSubmit = async (data: any) => {
    if (!user?.id) return;

    const existingImagePath = profile?.image?.path;

    if (!data.image_url && existingImagePath) {
      await deleteProfilePicture(user.id, existingImagePath);
    } else if (data.image_url !== profile?.image?.url && data.image_file) {
      // upload new picture new image
      await upsertProfilePicure(user.id, data.image_file);
    }

    // Check if form data has actually changed
    const hasChanges =
      data.full_name !== profile?.full_name ||
      data.username !== profile?.username ||
      data.bio !== profile?.bio ||
      data.image_url !== profile?.image?.url;

    if (!hasChanges) {
      toast({
        title: "No Changes",
        description: "No changes detected in your profile.",
        variant: "default",
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare the data for the database update
      const updateData = {
        full_name: data.full_name,
        username: data.username,
        bio: data.bio,
        image_url: data.image_url || null,
      };

      const updatedProfile = await updateProfile(user.id, updateData);
      setProfile(updatedProfile);

      // Show success toast
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
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
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-[calc(100%-1rem)] max-w-5xl space-y-8">
      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
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
                        form.getValues("image_file") ??
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
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 border-border bg-background"
                  >
                    <Camera className="h-4 w-4 text-muted-foreground" />
                  </Button>
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
                      onClick={() => {
                        // Create a hidden file input and trigger it
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e: any) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            form.setValue(
                              "image_file",
                              URL.createObjectURL(file),
                              { shouldDirty: true },
                            );
                          }
                        };
                        input.click();
                      }}
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
            <CardContent className="m-0 mt-5 p-0">
              <div className="flex items-center justify-between ">
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
          </CardHeader>
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
