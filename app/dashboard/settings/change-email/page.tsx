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
      console.log("Form data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        "Email change request submitted successfully! Please check your new email for verification."
      );

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error changing email:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while changing your email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Change Email Address
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update your email address for account notifications and login
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Update Email Address
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Enter your current email, new email, and password to confirm the
                change
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Current Email */}
                  <FormField
                    control={form.control}
                    name="currentEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <User className="h-4 w-4" />
                          Current Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.current@email.com"
                            className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500"
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
                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Mail className="h-4 w-4" />
                          New Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.new@email.com"
                            className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500"
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
                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Shield className="h-4 w-4" />
                          Current Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter your current password"
                              type={showPassword ? "text" : "password"}
                              className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 pr-12"
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
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-medium transition-colors"
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
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">What happens next?</p>
                    <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                      <li>
                        • A verification email will be sent to your new email
                        address
                      </li>
                      <li>
                        • Click the verification link to confirm the change
                      </li>
                      <li>• Your email will be updated after verification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChangeEmailPage;
