"use client";
import { signupFormSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
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
import Link from "next/link";
import { signup } from "@/actions/auth";
import { toast } from "sonner";
import { SignUpData } from "@/utils/types/account";
import { useRouter, useSearchParams } from "next/navigation";
import AuthVisual from "@/components/AuthVisual";
import PasswordField from "@/components/PasswordField";
import Logo from "@/components/Logo";
import { Sparkles } from "lucide-react";

const SignupPage = () => {
  const form = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const safeNext = next && next.startsWith("/") ? next : "/";
  const loginHref =
    safeNext !== "/" ? `/login?next=${encodeURIComponent(safeNext)}` : "/login";

  const onSubmit = async (formData: SignUpData) => {
    try {
      await signup(formData);
      toast.success(
        "Account created successfully! Please check your email to verify your account.",
        {
          icon: <Sparkles className="w-4 h-4 text-primary" />,
        },
      );
      router.push(loginHref);
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during sign up. Please try again or contact support if the issue persists.",
      );
    }
  };

  const handleGoogleSignup = async () => {
    try {
    } catch (error) {}
  };
  return (
    <div className="w-full grid lg:grid-cols-2 lg:h-screen lg:overflow-hidden">
      {/* Left Side - Visuals */}
      <AuthVisual />

      {/* Right Side - Form */}
      <div className="flex flex-col items-center justify-start   relative z-10 lg:h-screen lg:overflow-y-auto">
        <div className="w-full max-w-7xl  mx-auto space-y-6 sm:space-y-8 p-5 sm:p-8 md:p-10">
          <div className="relative z-10 flex items-center justify-between w-full lg:hidden">
            <Logo />
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-[clamp(1.75rem,1.5rem+1.5vw,3rem)] font-bold tracking-tight text-foreground font-gosh">
              Create Account
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={loginHref}
                className="text-primary hover:text-primary/90 font-semibold transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex gap-0.5 flex-col">
                    <FormLabel className="text-foreground text-sm sm:text-base font-semibold">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg. abebe"
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
                name="full_name"
                render={({ field }) => (
                  <FormItem className="flex gap-0.5 flex-col">
                    <FormLabel className="text-foreground text-sm sm:text-base font-semibold">
                      Full name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg. aleme kebde"
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
                name="email"
                render={({ field }) => (
                  <FormItem className="flex gap-0.5 flex-col">
                    <FormLabel className="text-foreground text-sm sm:text-base font-semibold">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg. abebebeso@test.com"
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
                  <FormItem className="flex gap-0.5 flex-col">
                    <FormLabel className="text-foreground text-sm sm:text-base font-semibold">
                      Password
                    </FormLabel>
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
                    Creating account...
                  </span>
                ) : (
                  "Create an account"
                )}
              </Button>
            </form>
          </Form>
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

          <div className="grid ">
            <Button
              variant="outline"
              className="h-12 rounded-xl border-2 border-muted bg-background hover:bg-muted/50 transition-colors text-base font-medium text-foreground"
              onClick={handleGoogleSignup}
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
      <SignupPage />
    </Suspense>
  );
}
