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
import { Camera, Key, Lock, Shield, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAccount } from "@/actions/profile/profile";
import generate_error from "@/utils/generate_error";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Change Password  button card + modal form                        */
/* ------------------------------------------------------------------ */
function ChangePasswordSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
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
        <CardContent>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Change Password
          </Button>
        </CardContent>
      </Card>

      <ChangePasswordDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const user = useAuth((store) => store.user);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const reset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();

      if (user?.email) {
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });
        if (verifyError) throw verifyError;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      toast.success("Password Updated", {
        description: "Your password has been changed successfully.",
      });
      reset();
      onOpenChange(false);
    } catch (error: any) {
      const message = error?.message || "Failed to update password";
      const isInvalid =
        error?.code === "invalid_credentials" ||
        /invalid login credentials/i.test(message);
      toast.error("Update Failed", {
        description: isInvalid
          ? "Your current password is incorrect."
          : message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Update your password to keep your account secure.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrent}
            toggle={() => setShowCurrent(!showCurrent)}
            placeholder="Enter your current password"
          />
          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            toggle={() => setShowNew(!showNew)}
            placeholder="Enter your new password"
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            toggle={() => setShowConfirm(!showConfirm)}
            placeholder="Confirm your new password"
          />
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  show,
  toggle,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  toggle: () => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3"
          onClick={toggle}
        >
          <Key className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main ProfileSettings component                                     */
/* ------------------------------------------------------------------ */
export default function ProfileSettings() {
  const [profile, setProfile] = useState<Profile>();
  const user = useAuth((store) => store.user);
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
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
            description:
              "Failed to load profile data. Please refresh the page.",
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
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Update Failed", {
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="space-y-6">
        <Card className="border-border bg-card">
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

      {/* Profile Settings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
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
                    user?.user_metadata?.avatar_url ??
                    "/placeholder-user.jpg"
                  }
                  className="object-cover w-full h-full"
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

          {/* Profile Form */}
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      This is the name displayed on your profile
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
                        placeholder="Enter a unique username"
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
                        className={`text-xs ${(field.value?.length || 0) > 450
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

      {/* Security Settings */}
      <ChangePasswordSection />

      {/* Danger Zone */}
      <Card className="border border-error/20 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-error text-xl font-bold">
            <span className="inline-flex items-center justify-center bg-error/10 rounded-full p-2">
              <Shield className="h-6 w-6 text-error" />
            </span>
            Delete Account
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Permanently delete your account and all associated data.{" "}
            <span className="font-semibold text-foreground">
              This action cannot be undone.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="max-w-md">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-error">Warning:</span> Once
                you delete your account,{" "}
                <span className="font-medium text-foreground">
                  all your data
                </span>{" "}
                including recipes, blogs, and profile information will be{" "}
                <span className="underline decoration-error underline-offset-2">
                  permanently removed
                </span>
                . Please be absolutely certain before proceeding.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="px-8 py-2 font-semibold text-base"
                >
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border border-error/20">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-error text-lg font-bold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-error" />
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground mt-2">
                    This action{" "}
                    <span className="font-semibold text-error">
                      cannot be undone
                    </span>
                    . Your account and all data will be{" "}
                    <span className="font-semibold">permanently deleted</span>{" "}
                    from our servers. You will lose access to all your content
                    and settings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-3 mt-4">
                  <AlertDialogCancel className="px-6 py-2">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 py-2 font-semibold focus:ring-2 focus:ring-destructive/30 focus:ring-offset-2"
                    onClick={async () => {
                      if (!user?.id) return;
                      try {
                        setDeleting(true);
                        await deleteAccount(user.id);
                        router.push("/login");
                      } catch (error) {
                        toast.error(generate_error(error));
                        setDeleting(false);
                      }
                    }}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Yes, Delete My Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
