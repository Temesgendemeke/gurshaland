"use client";
import React, { useState } from "react";
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
import { useRouter } from "next/navigation";
import { z } from "zod";
import PasswordField from "@/components/PasswordField";
import Image from "next/image";
import gursh_image from "@/public/gursha.webp";
import Logo from "@/components/Logo";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AuthVisual from "@/components/AuthVisual";

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

const Page = () => {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async (formData: { email: string; password: string }) => {
    try {
      await login(formData.email, formData.password);
      toast.success("You have successfully logged in. እንኳን ደህና መጡ።", {
        icon: <Sparkles className="w-4 h-4 text-primary" />,
      });
      router.push("/");
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
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      <div className="grain-overlay">
        <svg
          className="grain-svg"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="mono"
            />
            <feComponentTransfer in="mono" result="grainAlpha">
              <feFuncA type="gamma" amplitude="1" exponent="1.4" offset="0" />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="grainAlpha" operator="in" />
          </filter>

          <rect
            className="grain-rect"
            width="100%"
            height="100%"
            filter="url(#grain)"
          />
        </svg>
      </div>

      {/* Left Side - Visuals */}
      <AuthVisual />

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center p-6 md:p-12 relative z-10">
        <div className="w-full  mx-auto space-y-8  p-8 md:p-10 rounded-3xl border border-border/20">
          <div className="relative z-10 flex items-center justify-between w-full sm:hidden">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 transition-colors duration-200 text-sm font-medium group text-white"
            >
              <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              Back
            </Link>
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-bold tracking-tight text-foreground font-gosh">
              Welcome back
            </h1>
            <p className="text-lg text-muted-foreground">
              New to Gurshaland?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary/90 font-semibold transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-foreground text-lg font-semibold">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        className="h-14 rounded-xl bg-background/50 border-2 border-muted focus:border-primary focus:ring-0 transition-all duration-200 text-lg px-4 placeholder:text-muted-foreground/50"
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
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-foreground text-lg font-semibold">
                        Password
                      </FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-primary font-medium hover:underline focus:outline-none  focus:ring-2 focus:ring-primary/20 rounded-sm"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordField
                        placeholder="Enter your password"
                        {...field}
                        className="h-14 rounded-xl bg-background/50 border-2 border-muted focus:border-primary focus:ring-0 transition-all duration-200 text-lg px-4 placeholder:text-muted-foreground/50 "
                      />
                    </FormControl>
                    <FormMessage className="text-sm font-medium pl-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-14 rounded-xl text-lg font-bold tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 shadow-lg shadow-primary/20 mt-2"
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

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-4 text-muted-foreground font-semibold tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-14 rounded-xl border-2 border-muted bg-background/50 hover:bg-muted/50 transition-colors text-lg font-medium text-foreground"
            >
              <svg className="mr-3 h-6 w-6" viewBox="0 0 24 24">
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
            <Button
              variant="outline"
              className="h-14 rounded-xl border-2 border-muted bg-background/50 hover:bg-muted/50 transition-colors text-lg font-medium text-foreground"
            >
              <svg className="mr-3 h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M17.5 12.6c0-2.5 2-3.7 2.2-3.7-.1-.3-1.4-4.8-4.8-4.8-1.3 0-2.4.7-3 .7-.7 0-1.8-.7-3-.7-3.6 0-5.7 4.1-5.7 8.3 0 3.3 1.2 7.1 5.3 7 1 0 1.5-.7 2.7-.7s1.6.7 2.8.7c2.6-.1 3.6-2.4 3.6-2.4-2.1-1-3.5-3.5-3.5-6.3zM12.8 4.2c1.1-1.3 1.8-3.2 1.6-5C12.8-.7 11.2.2 10.2 1.4c-1 1.2-1.9 3.2-1.7 5.1 1.6.1 3-1.1 4.3-2.3z" />
              </svg>
              Apple
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
