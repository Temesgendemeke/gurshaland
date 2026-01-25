"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Mail, Shield, User } from "lucide-react";
import Link from "next/link";
import EyeButton from "@/components/EyeButton";

// Schema for change email form
const changeEmailSchema = z
  .object({
    currentEmail: z.string().email("Please enter a valid email address"),
    newEmail: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.currentEmail !== data.newEmail, {
    message: "New email must be different from current email",
    path: ["newEmail"],
  });

type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;

const ChangeEmailPage = () => {
  const form = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      currentEmail: "",
      newEmail: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = async (formData: ChangeEmailFormData) => {
    setLoading(true);
    try {
      // TODO: Implement email change logic
      void formData;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        "Email change request submitted successfully! Please check your new email for verification.",
      );

      // Reset form
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while changing your email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-2">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Change Email Address
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Update your email address for account notifications and login.
          </p>
        </div>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-info/10">
            <Mail className="h-7 w-7 text-info" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Update Email Address
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your current email, new email, and password to confirm the
            change.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Current Email */}
              <FormField
                control={form.control}
                name="currentEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4" />
                      Current Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.current@email.com"
                        className="h-12 bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Email */}
              <FormField
                control={form.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-4 w-4" />
                      New Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.new@email.com"
                        className="h-12 bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Confirmation */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Shield className="h-4 w-4" />
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your current password"
                          type={showPassword ? "text" : "password"}
                          className="h-12 bg-background pr-12"
                          {...field}
                        />
                        <EyeButton
                          showPassword={showPassword}
                          setShowPassword={setShowPassword}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 btn-primary-modern font-medium"
                disabled={form.formState.isSubmitting || loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating Email...
                  </div>
                ) : (
                  "Update Email Address"
                )}
              </Button>
            </form>
          </Form>

          {/* Additional Info */}
          <div className="mt-6 rounded-lg border border-info/20 bg-info/10 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-info shrink-0" />
              <div className="text-sm text-foreground">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • A verification email will be sent to your new email
                    address
                  </li>
                  <li>• Click the verification link to confirm the change</li>
                  <li>• Your email will be updated after verification</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeEmailPage;
