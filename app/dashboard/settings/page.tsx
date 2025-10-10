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
          console.log(data);
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
            err instanceof Error ? err.message : "Failed to load profile"
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
    form.setValue("image_file", '');
    form.setValue("image_url", '');
  };

  const onSubmit = async (data: any) => {
    if (!user?.id) return;

    if(!data.image.url){
      await deleteProfilePicture(data.image.path)
    }else if (data.image_url !== profile?.image?.url && data.image_file) {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="mx-4 sm:mx-6 md:mx-10 py-6 space-y-8">
        {/* Header */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground max-w-full">
            Manage your account preferences, privacy settings, and customize
            your experience on Gurshaland.
          </p>
        </div>

        <div className="bg-background">
          {/* Left Sidebar - Navigation */}

          {/* Main Content */}
          <div className=" space-y-6 bg-background">
            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <span className="text-sm font-medium">
                      Error loading profile:
                    </span>
                    <span className="text-sm">{error}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 border-red-200 text-red-600 hover:bg-red-100"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Profile Settings */}
            {loading ? (
              <Card className="border-emerald-100 dark:border-emerald-800 bg-background">
                <CardHeader>
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-emerald-100 dark:border-emerald-800 bg-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-600">
                    <User className="h-5 w-5" />
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
                      <Avatar className="h-20 w-20 border-4 border-emerald-100 dark:border-emerald-800">
                        <AvatarImage
                          src={
                            form.getValues("image_file") ??
                            profile?.image?.url ??
                            "/placeholder-user.jpg"
                          }
                          alt="Profile"
                        />
                        <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xl font-semibold">
                          {profile?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 border-emerald-200 bg-white dark:bg-background"
                      >
                        <Camera className="h-4 w-4 text-emerald-600" />
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
                          className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
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
                                  { shouldDirty: true }
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
                                className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20"
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
                                className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20"
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
                                className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-muted-foreground">
                                Share a brief description about yourself (max
                                500 characters)
                              </p>
                              <span
                                className={`text-xs ${
                                  (field.value?.length || 0) > 450
                                    ? "text-orange-600"
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
                          className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
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
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
            <Card className="border-emerald-100 dark:border-emerald-800 bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <Lock className="h-5 w-5" />
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
                      <span className="text-base font-semibold text-emerald-700 dark:text-emerald-200 tracking-tight">
                        {user?.email}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition"
                      aria-label="Edit Email"
                      onClick={() =>
                        router.push("/dashboard/settings/change-email")
                      }
                    >
                      <Pen className="h-4 w-4 text-emerald-600" />
                    </Button>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Security Settings */}
            <Card className="border-emerald-100 dark:border-emerald-800 bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Link href="/dashboard/settings/change-password">
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <Lock className="h-4 w-4" />
                    Change Password
                  </Button>
                </Link>

                {/* <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                      Two-Factor Authentication
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-300">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch className="data-[state=checked]:bg-emerald-600" />
                </div> */}
              </CardContent>
            </Card>

            <DeleteAccount profile_id={user?.id as string} />
            <div className="h-20"></div>

            {/* Notification Settings */}
            {/* <Card className="border-emerald-100 dark:border-emerald-800 bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Marketing Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features and promotions
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          marketing: checked,
                        })
                      }
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">System Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Important updates about your account and security
                      </p>
                    </div>
                    <Switch
                      checked={notifications.updates}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, updates: checked })
                      }
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Appearance Settings */}
            {/* <Card className="border-emerald-100 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <Palette className="h-5 w-5" />
                  Appearance & Theme
                </CardTitle>
                <CardDescription>
                  Customize how Gurshaland looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue="system">
                      <SelectTrigger className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-emerald-600 cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-transparent cursor-pointer hover:border-blue-600"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-transparent cursor-pointer hover:border-purple-600"></div>
                    <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-transparent cursor-pointer hover:border-pink-600"></div>
                    <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-transparent cursor-pointer hover:border-orange-600"></div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Action Buttons */}
            {/* <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-emerald-200 text-emerald-600 hover:bg-emerald-50 gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset to Default
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
