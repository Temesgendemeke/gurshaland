"use client";
import React, { Suspense, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { loginFormSchema } from "@/utils/schema";
import Link from "next/link";
import { login } from "@/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import PasswordField from "@/components/PasswordField";
import Image from "next/image";
import gursh_image from "@/public/gursha.webp";
import Logo from "@/components/Logo";
import { ArrowLeft, Sparkles, X } from "lucide-react";
import AuthVisual from "@/components/AuthVisual";
import { createClient } from "@/utils/supabase/client";
import GoBackNoText from "@/components/GoBackNoText";

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

const LoginPage = () => {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const safeNext = next && next.startsWith("/") ? next : "/";

  const onSubmit = async (formData: { email: string; password: string }) => {
    try {
      await login(formData.email, formData.password);
      toast.success(
        "You have successfully logged in. áŠ¥áŠ•áŠ³áŠ• á‹°áˆ…áŠ“ áˆ˜áŒ¡á¢",
        {
          icon: <Sparkles className="w-4 h-4 text-primary" />,
        },
      );
      router.push(safeNext);
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again.",
      );
    }
  };

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(safeNext)}`,
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-viewport w-full grid lg:h-screen lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden relative">
      {/* Left Side - Visuals */}
      <AuthVisual />

      {/* close button overlay on top right */}
      {/* <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="flex items-center text-primary-foreground hover:text-primary-foreground  gap-1.5 sm:gap-2   transition-colors duration-200 text-xs sm:text-sm font-medium bg-transparent hover:bg-primary p-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div> */}
      <GoBackNoText />

      {/* Right Side - Form */}
      <div className="flex flex-col relative z-10 lg:min-h-0 lg:overflow-y-auto">
        <div className="w-full mx-auto space-y-6 sm:space-y-8 sm:p-8 md:p-10 rounded-lg max-w-2xl lg:mr-0 lg:my-auto">
          <div className="relative z-10 hidden sm:flex items-center justify-between w-full lg:hidden">
            <Logo />
            <Link
              href="/"
              className="hidden sm:flex  items-center gap-1.5   sm:gap-2 px-3 sm:px-4 py-2 rounded-md bg-muted hover:bg-muted/70 border border-border transition-colors duration-200 text-xs sm:text-sm font-medium text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
          <div className="space-y-2 sm:space-y-3 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-[clamp(1.75rem,1.5rem+1.5vw,3rem)] font-bold tracking-tight text-foreground font-gosh">
              Welcome back
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              New to Gurshaland?{" "}
              <Link
                href={
                  safeNext !== "/"
                    ? `/signup?next=${encodeURIComponent(safeNext)}`
                    : "/signup"
                }
                className="text-primary hover:text-primary/90 font-semibold transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>

          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-foreground text-sm sm:text-base font-semibold">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
                          className="h-12 rounded-xl bg-background border-2 border-muted focus:border-primary focus:ring-0 transition-colors duration-200 text-base px-4 placeholder:text-muted-foreground/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm font-medium pl-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <FormLabel className="text-foreground text-sm sm:text-base font-semibold">
                          Password
                        </FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs sm:text-sm text-primary font-medium hover:underline focus:outline-none  focus:ring-2 focus:ring-primary/20 rounded-sm"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <PasswordField
                          placeholder="Enter your password"
                          {...field}
                          className="h-12 rounded-xl bg-background border-2 border-muted focus:border-primary focus:ring-0 transition-colors duration-200 text-base px-4 placeholder:text-muted-foreground/50"
                        />
                      </FormControl>
                      <FormMessage className="text-sm font-medium pl-1" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-base font-bold tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 mt-2"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Log in"
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <div className="relative my-5 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-[0.6875rem] sm:text-xs uppercase">
              <span className="bg-transparent px-4 text-muted-foreground font-semibold tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid">
            <Button
              variant="outline"
              className="h-12 rounded-xl border-2 border-muted bg-background hover:bg-muted/50 transition-colors text-base font-medium text-foreground"
              onClick={handleGoogleSignIn}
            >
              <svg className="mr-3 h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
